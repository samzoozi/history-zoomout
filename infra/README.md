# history-zoomout infra

AWS CDK (Python) app defining History Zoomout's infrastructure.

## Stacks

- **HistoryZoomoutDomain** — Route53 hosted zone for `historyzoomout.com`. Its NS records are set
  at the registrar (GoDaddy).
- **HistoryZoomoutFrontendCert** — `us-east-1` ACM cert for `historyzoomout.com` + `www`
  (CloudFront requires `us-east-1` certs regardless of the app's home region), DNS-validated
  against the hosted zone. Uses `cross_region_references=True` to consume the hosted zone from
  `ca-central-1`.
- **HistoryZoomoutFrontend** — S3 bucket + CloudFront distribution serving `../frontend` as a
  static site, aliased to `historyzoomout.com` + `www.historyzoomout.com` via the cert above and
  Route53 alias records.
- **HistoryZoomoutBackend** — a Mangum-wrapped FastAPI Lambda (from `../backend`) behind API
  Gateway, with a regional ACM cert + custom domain at `api.historyzoomout.com`.
  No VPC — the database is [Neon](https://neon.tech) Postgres, reached over its public TLS endpoint, so
  the Lambda isn't VPC-attached. The connection string lives in Secrets Manager under
  `history-zoomout/database-url`, created out-of-band (not via CDK) with:
  ```
  aws secretsmanager create-secret --name history-zoomout/database-url \
    --secret-string "<neon connection string>" --region ca-central-1
  ```

### Re-seeding production

`history-zoomout-seed` (see `backend/README.md`) always seeds whatever `DATABASE_URL`
points at. To reseed the live Neon database instead of local Postgres, pull the
connection string out of Secrets Manager and export it first:

```
cd ../backend
export DATABASE_URL=$(aws secretsmanager get-secret-value \
  --secret-id history-zoomout/database-url \
  --region ca-central-1 \
  --query SecretString --output text)
uv run history-zoomout-seed
```

This clears and reloads every topic/event/location from `data/seed_data/` — same
destructive-but-idempotent behavior as the local re-seed, just pointed at production.

## Usage

Managed with [uv](https://docs.astral.sh/uv/); `cdk.json` invokes the app via `uv run python app.py`,
so the `cdk` CLI itself picks up the right environment automatically.

```
cdk synth      # generate CloudFormation templates locally, no AWS calls
cdk diff       # compare against what's deployed
cdk deploy --all
```

`cdk deploy` provisions real, billable AWS resources (Route53 hosted zone, CloudFront, Lambda,
API Gateway) — run it deliberately, not as part of routine iteration.
