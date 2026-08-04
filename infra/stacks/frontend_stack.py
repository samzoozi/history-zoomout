from pathlib import Path

from aws_cdk import (
    CfnOutput,
    RemovalPolicy,
    Stack,
    aws_certificatemanager as acm,
    aws_cloudfront as cloudfront,
    aws_cloudfront_origins as origins,
    aws_route53 as route53,
    aws_route53_targets as route53_targets,
    aws_s3 as s3,
    aws_s3_deployment as s3_deployment,
)
from constructs import Construct

FRONTEND_DIR = Path(__file__).resolve().parents[2] / "frontend"

DOMAIN_NAME = "historyzoomout.com"
WWW_DOMAIN_NAME = f"www.{DOMAIN_NAME}"
API_BASE_URL = "https://api.historyzoomout.com"


class FrontendStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        hosted_zone: route53.IHostedZone,
        certificate: acm.ICertificate,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        site_bucket = s3.Bucket(
            self, "SiteBucket",
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        distribution = cloudfront.Distribution(
            self, "SiteDistribution",
            domain_names=[DOMAIN_NAME, WWW_DOMAIN_NAME],
            certificate=certificate,
            default_root_object="timeline.html",
            default_behavior=cloudfront.BehaviorOptions(
                origin=origins.S3BucketOrigin.with_origin_access_control(site_bucket),
                viewer_protocol_policy=cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            ),
        )

        s3_deployment.BucketDeployment(
            self, "SiteDeployment",
            sources=[
                s3_deployment.Source.asset(str(FRONTEND_DIR)),
                s3_deployment.Source.data(
                    "config.js",
                    f"window.HISTORYZOOMOUT_API_BASE = '{API_BASE_URL}';",
                ),
            ],
            destination_bucket=site_bucket,
            distribution=distribution,
            distribution_paths=["/*"],
        )

        cloudfront_target = route53.RecordTarget.from_alias(
            route53_targets.CloudFrontTarget(distribution),
        )
        route53.ARecord(
            self, "ApexAliasRecord",
            zone=hosted_zone,
            target=cloudfront_target,
        )
        route53.ARecord(
            self, "WwwAliasRecord",
            zone=hosted_zone,
            record_name="www",
            target=cloudfront_target,
        )

        CfnOutput(self, "SiteURL", value=f"https://{DOMAIN_NAME}")
        CfnOutput(self, "CloudFrontURL", value=f"https://{distribution.domain_name}")
