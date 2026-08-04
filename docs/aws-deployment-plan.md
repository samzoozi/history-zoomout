# Deploy history-zoomout: Neon for the database, domain still pending

Planning doc, kept up to date as we implement. Supersedes an earlier draft that used Aurora
Serverless v2; that approach was replaced with Neon (see "Why Neon" below).

## Current state

- `infra/` has a two-stack CDK (Python) app: `HistoryZoomoutFrontend` (S3 + CloudFront) and
  `HistoryZoomoutBackend` (Lambda + API Gateway). **Neither stack is actually deployed yet** —
  confirmed via `aws cloudformation describe-stacks` returning "Stack does not exist" for both,
  in `ca-central-1`. Despite an earlier note claiming otherwise, this is a from-scratch deploy.
- The backend Lambda now runs the real FastAPI app (via Mangum), not a placeholder.
- The database is Neon Postgres, not Aurora. Migrations have been run and data seeded against it
  already, from a local machine.
- The domain `historyzoomout.com` has not been purchased yet. Domain/Route53/ACM work is
  deferred — the site is fully deployable and viewable without it, on the auto-generated
  CloudFront and API Gateway URLs.

## Why Neon instead of Aurora Serverless v2

The original plan used Aurora Serverless v2 with `min_capacity=0` (scale-to-zero) to avoid the
~$45-50/mo cost of Aurora's 0.5 ACU floor, replacing the NAT Gateway (~$33/mo) with a Secrets
Manager VPC interface endpoint. Two problems with that approach:

1. Aurora's resume-from-zero isn't instant (not guaranteed sub-second), and the API Lambda's
   timeout would need padding to absorb worst-case cold-resume latency.
2. It's still meaningfully complex: VPC, interface endpoint, `PythonFunction` Docker bundling for
   native deps, a dedicated migration Lambda invoked manually since there's no path out of the
   VPC for local `alembic` access.

Neon is Postgres-as-a-service built around fast scale-to-zero, reachable over a public TLS
endpoint. Switching to it removes the VPC/NAT/interface-endpoint story entirely — the API Lambda
doesn't need to be VPC-attached at all — and lets migrations run directly from a local machine
against the live database, no in-VPC migration Lambda needed. Estimated cost: ~$1-3/mo total
(mostly the eventual $0.50/mo Route53 hosted zone; Neon's free tier covers this project's traffic,
and Lambda/API Gateway/CloudFront stay within their free tiers at this scale).

Trade-off: the database now lives outside AWS/CDK — provisioning and scaling are managed via
Neon's own console/CLI, not `cdk deploy`. Migrations and app code are unaffected (same
SQLAlchemy/Alembic as before, just pointed at a different host).

## Backend stack (`infra/stacks/backend_stack.py`) — implemented

- No VPC, no NAT, no Aurora. The API Lambda is a plain `PythonFunction` (from
  `aws-cdk.aws-lambda-python-alpha`, needed for Docker-bundling `psycopg[binary]`'s native
  extensions), not VPC-attached.
- `backend/src/history_zoomout/lambda_handler.py` wraps the FastAPI app with Mangum:
  ```python
  from mangum import Mangum
  from .main import app
  handler = Mangum(app)
  ```
- The Neon connection string lives in Secrets Manager under the name
  `history-zoomout/database-url`, created out-of-band via:
  ```
  aws secretsmanager create-secret --name history-zoomout/database-url \
    --secret-string "<neon connection string>" --region ca-central-1
  ```
  (deliberately not created via CDK/`SecretValue`, so the value never touches committed source).
  The stack imports it with `Secret.from_secret_name_v2` and grants the Lambda read access via
  the `DB_SECRET_ARN` environment variable.
- `backend/src/history_zoomout/config.py` resolves `database_url` from that secret at cold start
  when `DB_SECRET_ARN` is set, falling through to the `.env`-based default otherwise — local dev
  is unaffected.
- `bundling.asset_excludes=[".venv", "__pycache__", ".ruff_cache", ".pytest_cache"]` on the
  `PythonFunction` — without this, CDK bind-mounts the whole `backend/` directory (including the
  106MB local `.venv`) into the Docker bundling container and rsync chokes on it.
- Lambda timeout is 30s (padded well above Neon's typical wake latency) and runtime is
  `PYTHON_3_14`, matching `backend/pyproject.toml`'s `requires-python = ">=3.14"` (the original
  placeholder used `PYTHON_3_13`, which would have failed dependency resolution during bundling).
- `cdk synth HistoryZoomoutBackend` and `cdk diff HistoryZoomoutBackend` both verified clean — diff
  shows only additions (Lambda, its role/policy, API Gateway, log group), consistent with nothing
  being deployed yet.

## Frontend stack (`infra/stacks/frontend_stack.py`) — unchanged

Still S3 + CloudFront serving `../frontend`, no domain/cert wiring yet. Works as-is without a
purchased domain — viewable at the auto-generated `https://<distribution-id>.cloudfront.net` URL.

## Still open / deferred until the domain is purchased

This is essentially the original plan's domain work, unchanged, just not yet started:

1. **`HistoryZoomoutDomain`** stack — Route53 hosted zone for `historyzoomout.com`. After first
   deploy, take the zone's NS records and set them at the domain registrar.
2. **`HistoryZoomoutFrontendCert`** stack (`us-east-1`, `cross_region_references=True`) — ACM cert
   for `historyzoomout.com` + `www`, DNS-validated against the hosted zone from stack 1.
3. **Frontend stack changes** — accept the cert + hosted zone, set `domain_names` on the
   CloudFront distribution, add Route53 alias records for apex and `www`, and inject a generated
   `config.js` pointing the frontend at wherever the API ends up living (custom domain or the
   `execute-api` URL — see below).
4. **Backend stack changes** — regional API Gateway custom domain (`api.historyzoomout.com`) with
   its own same-region ACM cert, Route53 alias record.

Until the domain exists, the frontend's `config.js` should point
`window.HISTORYZOOMOUT_API_BASE` at the plain `https://<api-id>.execute-api.ca-central-1.amazonaws.com/prod/`
URL from the backend stack's `ApiURL` output.

## Verification checklist

1. ~~`cdk synth HistoryZoomoutBackend`~~ — done, clean.
2. ~~`cdk diff HistoryZoomoutBackend` against currently-deployed~~ — done; nothing deployed yet, so
   diff is all-additions.
3. `cdk deploy HistoryZoomoutBackend` then `cdk deploy HistoryZoomoutFrontend` — **not yet run**,
   pending explicit go-ahead (these provision real, billable resources).
4. After backend deploy: hit `<ApiURL output>/health` and `/categories` to confirm the Lambda
   reaches Neon correctly from within AWS (already confirmed working from a local machine).
5. After frontend deploy: wire `config.js` to the backend's `ApiURL` output, redeploy frontend,
   confirm the CloudFront URL renders the timeline with real data.
6. Once the domain is purchased: pick this doc back up at "Still open / deferred" above.
