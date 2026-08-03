#!/usr/bin/env python3
import os

import aws_cdk as cdk

from stacks.backend_stack import BackendStack
from stacks.frontend_stack import FrontendStack

env = cdk.Environment(
    account=os.getenv("CDK_DEFAULT_ACCOUNT"),
    region=os.getenv("CDK_DEFAULT_REGION"),
)

app = cdk.App()
FrontendStack(app, "HistoryZoomoutFrontend", env=env)
BackendStack(app, "HistoryZoomoutBackend", env=env)

app.synth()
