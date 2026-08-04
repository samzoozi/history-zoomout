from aws_cdk import (
    CfnOutput,
    Duration,
    Stack,
    aws_apigateway as apigateway,
    aws_certificatemanager as acm,
    aws_lambda as lambda_,
    aws_lambda_python_alpha as lambda_python,
    aws_route53 as route53,
    aws_route53_targets as route53_targets,
    aws_secretsmanager as secretsmanager,
)
from constructs import Construct

# Created out-of-band via `aws secretsmanager create-secret` so the Neon
# connection string never lands in committed source. See infra/README.md.
DB_SECRET_NAME = "history-zoomout/database-url"
API_DOMAIN_NAME = "api.historyzoomout.com"


class BackendStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        hosted_zone: route53.IHostedZone,
        **kwargs,
    ) -> None:
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

        api_certificate = acm.Certificate(
            self, "ApiCertificate",
            domain_name=API_DOMAIN_NAME,
            validation=acm.CertificateValidation.from_dns(hosted_zone),
        )

        api = apigateway.LambdaRestApi(
            self, "Api",
            handler=api_fn,
            proxy=True,
            domain_name=apigateway.DomainNameOptions(
                domain_name=API_DOMAIN_NAME,
                certificate=api_certificate,
            ),
        )

        route53.ARecord(
            self, "ApiAliasRecord",
            zone=hosted_zone,
            record_name="api",
            target=route53.RecordTarget.from_alias(
                route53_targets.ApiGateway(api),
            ),
        )

        CfnOutput(self, "ApiURL", value=api.url)
        CfnOutput(self, "ApiCustomDomainURL", value=f"https://{API_DOMAIN_NAME}")
