#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PipelineStack } from "../lib/pipeline-stack";

const app = new cdk.App();
new PipelineStack(app, "ExpenseTrackerPipelineStack", {
  env: {
    account: "887476331812",
    region: "ap-northeast-1",
  },
});

app.synth();
