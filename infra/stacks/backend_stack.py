from aws_cdk import (
    CfnOutput,
    Duration,
    Stack,
    aws_apigateway as apigateway,
    aws_lambda as lambda_,
    aws_lambda_python_alpha as lambda_python,
    aws_secretsmanager as secretsmanager,
)
from constructs import Construct

# Created out-of-band via `aws secretsmanager create-secret` so the Neon
# connection string never lands in committed source. See infra/README.md.
DB_SECRET_NAME = "history-zoomout/database-url"


class BackendStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        db_secret = secretsmanager.Secret.from_secret_name_v2(
            self, "DbSecret", DB_SECRET_NAME,
        )

        api_fn = lambda_python.PythonFunction(
            self, "ApiFunction",
            entry="../backend",
            index="src/history_zoomout/lambda_handler.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_14,
            timeout=Duration.seconds(30),
            memory_size=256,
            environment={
                "DB_SECRET_ARN": db_secret.secret_arn,
            },
            bundling=lambda_python.BundlingOptions(
                asset_excludes=[".venv", "__pycache__", ".ruff_cache", ".pytest_cache"],
            ),
        )
        db_secret.grant_read(api_fn)

        api = apigateway.LambdaRestApi(
            self, "Api",
            handler=api_fn,
            proxy=True,
        )

        CfnOutput(self, "ApiURL", value=api.url)
