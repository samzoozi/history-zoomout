# history-zoomout infra

AWS CDK (Python) app defining History Zoomout's infrastructure.

## Stacks

- **HistoryZoomoutFrontend** — S3 bucket + CloudFront distribution serving `../frontend` as a static site.
- **HistoryZoomoutBackend** — VPC, an Aurora Serverless v2 Postgres cluster, and a Lambda function behind
  API Gateway. The Lambda currently runs a placeholder handler; swap it for a Mangum-wrapped FastAPI app
  from `../backend` once one exists.

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
