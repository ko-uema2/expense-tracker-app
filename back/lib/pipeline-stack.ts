import * as cdk from "aws-cdk-lib";
import {
  CodePipeline,
  CodePipelineSource,
  ShellStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineStage } from "../lib/pipeline-stage";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "ExpenseTrackerPipeline", {
      pipelineName: "ExpenseTrackerPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.connection(
          "ko-uema2/expense-tracker-app",
          "main",
          {
            connectionArn:
              "arn:aws:codestar-connections:ap-northeast-1:887476331812:connection/67cadc11-2872-4611-9179-0a4d0b43e6ff",
          }
        ),
        commands: ["cd back", "npm ci", "npm run build", "npx cdk synth"],
        primaryOutputDirectory: "back/cdk.out",
      }),
    });

    pipeline.addStage(
      new PipelineStage(this, "dev", {
        env: { account: "887476331812", region: "ap-northeast-1" },
      })
    );
  }
}
