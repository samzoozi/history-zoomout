from pathlib import Path

from aws_cdk import (
    CfnOutput,
    RemovalPolicy,
    Stack,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
)
from constructs import Construct

FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"


class FrontendStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        site_bucket = s3.Bucket(
            self, "SiteBucket",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        distribution = cloudfront.Distribution(
            self, "SiteDistribution",
            default_root_object="timeline.html",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3BucketOrigin.with_origin_access_control(site_bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            ),
        )

        s3_deployment.BucketDeployment(
            self, "SiteDeployment",
            sources=[s3_deployment.Source.asset(str(FRONTEND_DIR))],
            destination_bucket=site_bucket,
            distribution=distribution,
            distribution_paths=["/*"],
        )

        CfnOutput(self, "SiteURL", value=f"https://{distribution.domain_name}")
