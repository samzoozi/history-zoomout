# history-zoomout infra

AWS CDK (Python) app defining History Zoomout's infrastructure.

## Stacks

- **HistoryZoomoutFrontend** — S3 bucket + CloudFront distribution serving `../frontend` as a static site.
- **HistoryZoomoutBackend** — a Mangum-wrapped FastAPI Lambda (from `../backend`) behind API Gateway.
  No VPC — the database is [Neon](https://neon.tech) Postgres, reached over its public TLS endpoint, so
  the Lambda isn't VPC-attached. The connection string lives in Secrets Manager under
  `history-zoomout/database-url`, created out-of-band (not via CDK) with:
  ```
  aws secretsmanager create-secret --name history-zoomout/database-url \
    --secret-string "<neon connection string>" --region ca-central-1
  ```
  See `../docs/aws-deployment-plan.md` for the full design and rationale (Neon vs. Aurora).

## Usage

Managed with [uv](https://docs.astral.sh/uv/); `cdk.json` invokes the app via `uv run python app.py`,
so the `cdk` CLI itself picks up the right environment automatically.

```
cdk synth      # generate CloudFormation templates locally, no AWS calls
cdk diff       # compare against what's deployed
cdk deploy --all
```

`cdk deploy` provisions real, billable AWS resources (NAT gateway, Aurora Serverless v2, CloudFront) —
run it deliberately, not as part of routine iteration.
