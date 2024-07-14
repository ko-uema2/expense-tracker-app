import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as codebuild from "aws-cdk-lib/aws-codebuild";
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import { Construct } from "constructs";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a s3 bucket for the pipeline artifacts
    const sourceOutput = new codepipeline.Artifact("deployPipelineArtifact");

    // Create a pipeline for the ExpenseTracker application deployment
    const deployPipeline = new codepipeline.Pipeline(this, id, {
      pipelineName: "ExpenseTrackerDeployPipeline",
      pipelineType: codepipeline.PipelineType.V2,
      crossAccountKeys: false,
    });

    // Source stage: Get the application code from GitHub
    const sourceStage = deployPipeline.addStage({
      stageName: "Source",
      actions: [
        new codepipeline_actions.CodeStarConnectionsSourceAction({
          actionName: "GitHub",
          connectionArn: `arn:aws:codestar-connections:${this.region}:${this.account}:connection/67cadc11-2872-4611-9179-0a4d0b43e6ff`,
          owner: "ko-uema2",
          repo: "expense-tracker-app",
          branch: "main",
          output: sourceOutput,
        }),
      ],
    });

    // Create a CodeBuild project to deploy the application using CDK
    const cdkDeployProject = new codebuild.PipelineProject(
      this,
      "CdkDeployProject",
      {
        projectName: "ExpenseTrackerCdkDeployProject",
        buildSpec: codebuild.BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              commands: ["n stable", "node -v", "npm update npm"],
            },
            build: {
              commands: [
                'echo "node: $(node --version)"',
                'echo "npm: $(npm --version)"',
                "cd back",
                "npm ci",
              ],
            },
            post_build: {
              commands: ["npx cdk deploy --require-approval never"],
            },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        },
      }
    );

    // Add permissions to the CodeBuild project
    cdkDeployProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["iam:PassRole", "sts:AssumeRole"],
        resources: [
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-cfn-exec-role-${this.account}-${this.region}`,
          `arn:aws:iam::${this.account}:role/cdk-hnb659fds-file-publishing-role-${this.account}-${this.region}`,
        ],
      })
    );

    // Add permissions to the CodeBuild project
    cdkDeployProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["ssm:GetParameter"],
        resources: [
          `arn:aws:ssm:${this.region}:${this.account}:parameter/cdk-bootstrap/hnb659fds/version`,
        ],
      })
    );

    // Add permissions to the CodeBuild project
    const pipelineStackArn = cdk.Stack.of(this).formatArn({
      service: "cloudformation",
      resource: "stack",
      resourceName: `${cdk.Stack.of(this).stackName}/*`,
    });
    cdkDeployProject.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cloudformation:CreateChangeSet",
          "cloudformation:DescribeStacks",
          "cloudformation:DescribeChangeSet",
          "cloudformation:DeleteChangeSet",
          "cloudformation:ExecuteChangeSet",
          "cloudformation:GetTemplate",
        ],
        resources: [
          pipelineStackArn,
          `arn:aws:cloudformation:${this.region}:${this.account}:stack/ExpenseTrackerBackendStack/*`,
        ],
      })
    );

    // Deploy stage: Deploy the application using CDK
    const deployStage = deployPipeline.addStage({
      stageName: "Deploy",
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: "cdkDeploy",
          input: sourceOutput,
          project: cdkDeployProject,
        }),
      ],
    });
  }
}
