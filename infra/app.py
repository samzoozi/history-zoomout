#!/usr/bin/env python3
import os

import aws_cdk as cdk

from stacks.backend_stack import BackendStack
from stacks.domain_stack import DomainStack
from stacks.frontend_cert_stack import FrontendCertStack
from stacks.frontend_stack import FrontendStack

env = cdk.Environment(
    account=os.getenv("CDK_DEFAULT_ACCOUNT"),
    region=os.getenv("CDK_DEFAULT_REGION"),
)
# CloudFront certificates must live in us-east-1 no matter which region the rest of the
# app is deployed in.
us_east_1_env = cdk.Environment(
    account=os.getenv("CDK_DEFAULT_ACCOUNT"),
    region="us-east-1",
)

app = cdk.App()
domain_stack = DomainStack(app, "HistoryZoomoutDomain", env=env, cross_region_references=True)
frontend_cert_stack = FrontendCertStack(
    app, "HistoryZoomoutFrontendCert",
    hosted_zone=domain_stack.hosted_zone,
    env=us_east_1_env,
    cross_region_references=True,
)
FrontendStack(
    app, "HistoryZoomoutFrontend",
    hosted_zone=domain_stack.hosted_zone,
    certificate=frontend_cert_stack.certificate,
    env=env,
    cross_region_references=True,
)
BackendStack(
    app, "HistoryZoomoutBackend",
    hosted_zone=domain_stack.hosted_zone,
    env=env,
)

app.synth()
