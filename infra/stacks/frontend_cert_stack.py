from aws_cdk import Stack, aws_certificatemanager as acm, aws_route53 as route53
from constructs import Construct

DOMAIN_NAME = "historyzoomout.com"


class FrontendCertStack(Stack):
    def __init__(
        self,
        scope: Construct,
        construct_id: str,
        hosted_zone: route53.IHostedZone,
        **kwargs,
    ) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # CloudFront only accepts certificates from us-east-1, regardless of which region
        # the distribution's other resources live in — this stack must be deployed there.
        self.certificate = acm.Certificate(
            self, "Certificate",
            domain_name=DOMAIN_NAME,
            subject_alternative_names=[f"www.{DOMAIN_NAME}"],
            validation=acm.CertificateValidation.from_dns(hosted_zone),
        )
