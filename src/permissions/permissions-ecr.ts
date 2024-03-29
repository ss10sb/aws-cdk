import {IGrantable, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {TaskDefinition} from "aws-cdk-lib/aws-ecs";
import {CfnRepository} from "aws-cdk-lib/aws-ecr";
import {EcrRepositories} from "../ecr/ecr-repositories";
import {FargateTasksAndServices} from "../ecs/fargate-factory";
import {Wrapper} from "../ecs/task-definitions";

export class PermissionsEcr {

    static replacePolicyTextForAccountIds(accountIds: string[], repositories: EcrRepositories): void {
        function accountArns(accountIds: string[]): string[] {
            const arns: string[] = [];
            for (const accountId of accountIds) {
                arns.push(`arn:aws:iam::${accountId}:root`);
            }
            return arns;
        }

        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (!ecrRepo.repository) {
                continue;
            }
            const cfnRepo = ecrRepo.repository.node.defaultChild as CfnRepository;
            cfnRepo.repositoryPolicyText = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {
                            "AWS": accountArns(accountIds)
                        },
                        "Action": [
                            "ecr:BatchCheckLayerAvailability",
                            "ecr:BatchGetImage",
                            "ecr:GetDownloadUrlForLayer",
                            "ecr:DescribeImages"
                        ]
                    }
                ]
            }
        }
    }

    static accountIdsCanPullFromEcr(accountIds: string[], repositories: EcrRepositories): void {
        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (!ecrRepo.repository) {
                continue;
            }
            const policyStatement = new PolicyStatement({
                actions: [
                    "ecr:BatchCheckLayerAvailability",
                    "ecr:BatchGetImage",
                    "ecr:GetDownloadUrlForLayer",
                    "ecr:DescribeImages"
                ]
            });
            for (const accountId of accountIds) {
                policyStatement.addAwsAccountPrincipal(accountId);
            }
            ecrRepo.repository.addToResourcePolicy(policyStatement);
        }
    }

    static accountIdsCanDescribeEcr(accountIds: string[], repositories: EcrRepositories): void {
        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (!ecrRepo.repository) {
                continue;
            }
            const policyStatement = new PolicyStatement({
                actions: ['ecr:DescribeImages']
            });
            for (const accountId of accountIds) {
                policyStatement.addAwsAccountPrincipal(accountId);
            }
            ecrRepo.repository.addToResourcePolicy(policyStatement);
        }
    }

    static granteeCanPushPullFromRepositories(grantee: IGrantable, repositories: EcrRepositories): void {
        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (ecrRepo.repository) {
                ecrRepo.repository.grantPullPush(grantee);
            }
        }
    }

    static granteeCanPullFromRepositories(grantee: IGrantable, repositories: EcrRepositories): void {
        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (ecrRepo.repository) {
                ecrRepo.repository.grantPull(grantee);
            }
        }
    }

    static granteeCanDescribeRepositories(grantee: IGrantable, repositories: EcrRepositories): void {
        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (ecrRepo.repository) {
                ecrRepo.repository.grant(grantee, 'ecr:DescribeImages');
            }
        }
    }

    static tasksServicesCanPullFromEcr(ts: FargateTasksAndServices, repositories: EcrRepositories): void {
        this.wrappedCanPullFromEcr(ts.wrappers, repositories);
    }

    static wrappedCanPullFromEcr(wrapped: Wrapper[], repositories: EcrRepositories): void {
        for (const wrap of wrapped) {
            this.executionRoleCanPullFromEcr(wrap.taskDefinition, repositories);
        }
    }

    static executionRoleCanPullFromEcr(taskDefinition: TaskDefinition, repositories: EcrRepositories): void {
        const repoArns: string[] = [];
        for (const ecrRepo of repositories.getEcrRepositories()) {
            if (!ecrRepo.repository) {
                continue;
            }
            repoArns.push(ecrRepo.repository.repositoryArn + '*');
        }
        if (repoArns.length) {
            const statement = new PolicyStatement();
            statement.addResources(...repoArns);
            statement.addActions(
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability"
            );
            taskDefinition.obtainExecutionRole().addToPrincipalPolicy(statement);
        }
        this.executionRoleCanGetEcrAuthToken(taskDefinition);
    }

    static executionRoleCanGetEcrAuthToken(taskDefinition: TaskDefinition): void {
        const statement = new PolicyStatement();
        statement.addResources('*');
        statement.addActions(
            "ecr:GetAuthorizationToken"
        );
        taskDefinition.obtainExecutionRole().addToPrincipalPolicy(statement);
    }
}