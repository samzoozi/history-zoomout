# Wire up historyzoomout.com, cut idle AWS cost, drop the NAT Gateway

Planning doc — not yet implemented. Captures the agreed design so we can pick this back up later.

## Context

`infra/` already has a working two-stack CDK (Python) skeleton (`HistoryZoomoutFrontend`: S3 + CloudFront; `HistoryZoomoutBackend`: VPC + Aurora Serverless v2 + Lambda + API Gateway), deployed to `ca-central-1`. Three things are still open:

1. The backend Lambda is a placeholder — it needs to actually run the FastAPI app.
2. The domain `historyzoomout.com` isn't wired to anything yet (no Route53 hosted zone or registration in this AWS account — it's registered elsewhere, so a hosted zone needs to be created and its nameservers pointed to from the registrar).
3. The design has two real cost problems for a low/occasional-traffic personal project: Aurora Serverless v2's 0.5 ACU floor runs 24/7 (~$45–50/mo), and the NAT Gateway is a flat ~$33/mo charge that exists only so the Lambda can reach Secrets Manager and (previously) so migrations could be run through it — neither actually requires internet egress.

Goal of this change: wire the real domain end-to-end, make the backend Lambda actually serve the API, and eliminate the NAT Gateway and the Aurora idle floor, replacing NAT with a private VPC endpoint and adding a dedicated, manually-invoked migration Lambda so `alembic upgrade head` / seeding never needs a path out of the VPC.

Confirmed decisions: migrations run via **manual `aws lambda invoke`** (not an automatic CDK custom resource); the domain covers **both `historyzoomout.com` and `www.historyzoomout.com`**.

## Stack layout

Three CDK stacks in `infra/app.py`, in dependency order:

1. **`HistoryZoomoutDomain`** (`ca-central-1`, new) — owns the Route53 `HostedZone` for `historyzoomout.com`. Nothing else. Its only manual step: after first deploy, take the zone's NS records from the stack output and set them at the domain registrar.
2. **`HistoryZoomoutFrontendCert`** (`us-east-1`, new, `cross_region_references=True`) — CloudFront requires its ACM cert in `us-east-1` regardless of where the rest of the app lives. DNS-validates a cert for `historyzoomout.com` + `www.historyzoomout.com` against the hosted zone from stack 1 (also `cross_region_references=True` on the Domain stack so the `HostedZone` construct can be passed directly instead of hand-copying the zone ID).
3. **`HistoryZoomoutFrontend`** (`ca-central-1`, existing, modified) — S3 + CloudFront, now with the real domain names and cert from stacks 1–2, plus Route53 alias records.
4. **`HistoryZoomoutBackend`** (`ca-central-1`, existing, modified) — VPC (no NAT) + Aurora Serverless v2 (scales to 0) + API Lambda + migration Lambda + API Gateway custom domain, using the hosted zone from stack 1 directly (same region, ordinary cross-stack reference, no special flag needed).

`cross_region_references=True` is a real CDK feature (available in the installed `aws-cdk-lib`) that lets stacks in different regions share construct references directly — CDK exchanges the values via SSM under the hood, so no manual ARN/zone-ID copying is needed anywhere in this plan.

## Backend stack changes (`infra/stacks/backend_stack.py`)

**VPC**: `nat_gateways=0` (currently `1`). Add a Secrets Manager interface endpoint in the Lambda-private subnets:
```python
vpc.add_interface_endpoint("SecretsManagerEndpoint",
    service=ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER)
```
This is the only thing NAT was providing that's actually needed — neither Lambda talks to anything else outside the VPC.

**Aurora**: add `serverless_v2_min_capacity=0` (currently effectively `0.5` via the default) and `serverless_v2_auto_pause_duration=Duration.minutes(5)`. Both params exist on `rds.DatabaseCluster` in the installed CDK version — confirmed by inspecting the installed package. This lets the cluster scale to 0 ACU after 5 minutes idle instead of running the floor 24/7.

**API Lambda — replace the placeholder with a real Mangum-wrapped FastAPI app**:
- `backend/pyproject.toml`: add `mangum` to `dependencies`.
- New `backend/src/history_zoomout/lambda_handler.py`:
  ```python
  from mangum import Mangum
  from .main import app
  handler = Mangum(app)
  ```
- `infra/pyproject.toml`: add `aws-cdk.aws-lambda-python-alpha` (matching the installed `aws-cdk-lib` version, e.g. `2.260.0a0`) — needed because `psycopg[binary]` has native extensions that plain `Code.from_asset` can't bundle correctly; `PythonFunction` Docker-bundles dependencies for the Lambda runtime.
- In `backend_stack.py`, swap `lambda_.Function(... code=lambda_.Code.from_inline(PLACEHOLDER_HANDLER) ...)` for:
  ```python
  from aws_cdk import aws_lambda_python_alpha as lambda_python
  api_fn = lambda_python.PythonFunction(
      self, "ApiFunction",
      entry="../backend",
      index="src/history_zoomout/lambda_handler.py",
      handler="handler",
      runtime=lambda_.Runtime.PYTHON_3_13,
      ...
  )
  ```
- Delete the now-unused `PLACEHOLDER_HANDLER` string.

**DB URL resolution in Lambda**: `config.py`'s `database_url` currently only reads from `.env`/env var, which is right for local dev but there's no live value to put in a Lambda env var at synth time (the secret's contents aren't known until deploy). Add a small helper in `config.py` that, when a `DB_SECRET_ARN` env var is present, fetches credentials from Secrets Manager via `boto3` at cold start and composes the `postgresql+psycopg://` URL using the secret's `username`/`password` plus a `DB_HOST` env var (set from `database.cluster_endpoint.hostname` in the CDK stack). Falls through to today's `.env`-based default otherwise, so local dev is untouched.

**API Gateway**: switch from the default `LambdaRestApi` (edge-optimized) to regional, so its custom-domain cert can live in `ca-central-1` alongside everything else instead of needing another `us-east-1` cross-region cert:
```python
api = apigateway.LambdaRestApi(self, "Api", handler=api_fn, proxy=True,
    endpoint_types=[apigateway.EndpointType.REGIONAL])
```
Add an ACM cert for `api.historyzoomout.com` (DNS-validated against the imported hosted zone, same region — ordinary cross-stack reference), a `DomainName` + `BasePathMapping`, and a Route53 `ARecord` alias pointing at it.

**CORS**: set the Lambda's `CORS_ORIGINS` env var (or equivalent settings override) to `["https://historyzoomout.com", "https://www.historyzoomout.com"]` for the deployed environment; local `.env` keeps today's `["*"]` default in `config.py` untouched.

**New migration Lambda**:
- New `backend/src/history_zoomout/lambda_migration.py`:
  ```python
  from alembic import command
  from alembic.config import Config

  def handler(event, context):
      cfg = Config("alembic.ini")
      command.upgrade(cfg, "head")
      if event.get("seed"):
          from .db.seed import seed
          seed()
      return {"status": "ok"}
  ```
- A second `PythonFunction` in `backend_stack.py` (same `entry="../backend"` bundle, `index="src/history_zoomout/lambda_migration.py"`), same VPC subnet/security-group/Secrets-Manager access as the API Lambda, longer timeout (~5 min) since migrations/seeding can run longer than a typical request. No API Gateway trigger — invoked manually:
  ```
  aws lambda invoke --function-name <MigrationFunction name> --payload '{"seed": true}' out.json
  ```
- Reuses the existing `alembic.ini` / `backend/alembic/` migration scripts and `backend/src/history_zoomout/db/seed.py::seed()` as-is — no changes needed there, since `alembic/env.py` already resolves its DB URL from `history_zoomout.config.settings`, which will pick up the new Secrets-Manager-backed resolution automatically.

## Frontend stack changes (`infra/stacks/frontend_stack.py`)

- Accept the cert (from the `us-east-1` stack) and hosted zone (from the Domain stack) as constructor args.
- `cloudfront.Distribution(..., domain_names=["historyzoomout.com", "www.historyzoomout.com"], certificate=cert, ...)`.
- Add Route53 `ARecord`/`AaaaRecord` (alias to the CloudFront distribution) for both the apex and `www` in the hosted zone.
- Add a generated `config.js` to the `BucketDeployment` sources so the frontend knows where the API lives:
  ```python
  s3_deployment.Source.data("config.js",
      "window.HISTORYZOOMOUT_API_BASE = 'https://api.historyzoomout.com';")
  ```
  The frontend already supports this override (`frontend/timeline.js:49` reads `window.HISTORYZOOMOUT_API_BASE`, falling back to `http://<hostname>:8000` for local dev) — no JS changes needed, just wiring the value in at deploy time.
- `frontend/timeline.html`: add `<script src="config.js"></script>` immediately before the existing `<script src="timeline.js"></script>` (line 112), so the override is set before `timeline.js` runs.

Since `api.historyzoomout.com` is a name we choose ourselves rather than a generated one, this is a plain string constant — no cross-stack token or stack-ordering dependency between frontend and backend is needed.

## `infra/app.py`

Reorder/extend to instantiate all four stacks with correct envs and dependencies:
```python
domain = DomainStack(app, "HistoryZoomoutDomain", env=env)
frontend_cert = FrontendCertStack(app, "HistoryZoomoutFrontendCert",
    env=cdk.Environment(account=env.account, region="us-east-1"),
    hosted_zone=domain.hosted_zone, cross_region_references=True)
FrontendStack(app, "HistoryZoomoutFrontend", env=env,
    hosted_zone=domain.hosted_zone, certificate=frontend_cert.certificate,
    cross_region_references=True)
BackendStack(app, "HistoryZoomoutBackend", env=env, hosted_zone=domain.hosted_zone)
```

## Verification

1. `cd infra && uv run cdk synth` for all four stacks — confirms the new constructs (interface endpoint, `PythonFunction` bundling, ACM DNS validation, Route53 records) synthesize without errors, no AWS calls.
2. `cd infra && uv run cdk diff --all` against the currently-deployed stacks to sanity-check the changeset (NAT removal, Aurora capacity change, new domain/cert/migration resources) before deploying anything billable.
3. After `cdk deploy HistoryZoomoutDomain`, manually update NS records at the domain registrar, then confirm propagation (`dig NS historyzoomout.com`) before deploying the cert stack (DNS validation will hang otherwise).
4. After full deploy: `aws lambda invoke --function-name <MigrationFunction> --payload '{"seed": true}' out.json` to apply migrations and seed data, then hit `https://api.historyzoomout.com/health` and `https://historyzoomout.com` to confirm the whole path works end-to-end.
5. Confirm cost reduction by checking Cost Explorer after a few idle days — Aurora and NAT line items should drop to near-zero between usage bursts.
