from aws_cdk import CfnOutput, Fn, Stack, aws_route53 as route53
from constructs import Construct

DOMAIN_NAME = "historyzoomout.com"


class DomainStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        self.hosted_zone = route53.HostedZone(
            self, "HostedZone",
            zone_name=DOMAIN_NAME,
        )

        CfnOutput(
            self, "NameServers",
            value=Fn.join(", ", self.hosted_zone.hosted_zone_name_servers),
            description=f"Set these as the NS records for {DOMAIN_NAME} at the domain registrar",
        )
