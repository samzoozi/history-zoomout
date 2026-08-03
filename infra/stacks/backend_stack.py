from aws_cdk import (
    CfnOutput,
    Duration,
    Stack,
    aws_apigateway as apigateway,
    aws_ec2 as ec2,
    aws_lambda as lambda_,
    aws_rds as rds,
)
from constructs import Construct

# The Lambda handler below is a placeholder that returns a static response.
# Swap `code` and `handler` for a Mangum-wrapped FastAPI app once
# backend/src/history_zoomout has one (e.g. lambda_.Code.from_asset("../backend")).
PLACEHOLDER_HANDLER = """
import json

def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"message": "history_zoomout API placeholder"}),
    }
"""


class BackendStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        vpc = ec2.Vpc(
            self, "Vpc",
            max_azs=2,
            nat_gateways=1,
            subnet_configuration=[
                ec2.SubnetConfiguration(name="Public", subnet_type=ec2.SubnetType.PUBLIC, cidr_mask=24),
                ec2.SubnetConfiguration(name="Lambda", subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS, cidr_mask=24),
                ec2.SubnetConfiguration(name="Database", subnet_type=ec2.SubnetType.PRIVATE_ISOLATED, cidr_mask=24),
            ],
        )

        database = rds.DatabaseCluster(
            self, "Database",
            engine=rds.DatabaseClusterEngine.aurora_postgres(version=rds.AuroraPostgresEngineVersion.VER_16_4),
            writer=rds.ClusterInstance.serverless_v2("Writer"),
            serverless_v2_min_capacity=0.5,
            serverless_v2_max_capacity=2,
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_ISOLATED),
            default_database_name="history_zoomout",
            credentials=rds.Credentials.from_generated_secret("history_zoomout_admin"),
        )

        api_fn = lambda_.Function(
            self, "ApiFunction",
            runtime=lambda_.Runtime.PYTHON_3_13,
            handler="index.handler",
            code=lambda_.Code.from_inline(PLACEHOLDER_HANDLER),
            timeout=Duration.seconds(10),
            memory_size=256,
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS),
            environment={
                "DB_SECRET_ARN": database.secret.secret_arn if database.secret else "",
            },
        )
        database.connections.allow_default_port_from(api_fn, "Lambda API to Aurora Postgres")
        if database.secret:
            database.secret.grant_read(api_fn)

        api = apigateway.LambdaRestApi(
            self, "Api",
            handler=api_fn,
            proxy=True,
        )

        CfnOutput(self, "ApiURL", value=api.url)
        CfnOutput(self, "DatabaseSecretArn", value=database.secret.secret_arn if database.secret else "none")
