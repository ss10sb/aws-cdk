import {NonConstruct} from "../core";
import {Construct} from "constructs";
import {CodePipelineEcsStackServicesProps} from "../pipeline";
import {Stack} from "aws-cdk-lib";
import {PermissionsEcr} from "./permissions-ecr";
import {EnvConfig} from "../env";
import {PermissionsParameter} from "./permissions-parameter";
import {IGrantable} from "aws-cdk-lib/aws-iam";
import {NamingHelper, SsmHelper} from "../utils";
import {IStringParameter} from "aws-cdk-lib/aws-ssm";
import {PermissionsBootstrap} from "./permissions-bootstrap";

export class PermissionsCodePipelineEcsStack extends NonConstruct {

    readonly props: CodePipelineEcsStackServicesProps;
    readonly environments: EnvConfig[];
    configParam?: IStringParameter;

    constructor(scope: Construct, id: string, props: CodePipelineEcsStackServicesProps, environments: EnvConfig[]) {
        super(scope, id);
        this.props = props;
        this.environments = environments;
        this.handlePermissions();
    }


    private handlePermissions() {
        this.synthStepPermissions();
        this.environmentPermissions();
        this.ecrSteps();
    }

    protected accountsCanDescribeEcr(): void {
        const accountIds: string[] = [
            Stack.of(this.scope).account
        ];
        PermissionsEcr.accountIdsCanDescribeEcr(accountIds, this.props.repositoryFactory.ecrRepositories);
    }

    protected accountsCanPullFromEcr(): void {
        const accountIds: string[] = [];
        for (const envConfig of this.environments) {
            if (envConfig.AWSAccountId) {
                accountIds.push(envConfig.AWSAccountId);
            }
        }
        if (accountIds && accountIds.length > 0) {
            PermissionsEcr.accountIdsCanPullFromEcr(accountIds, this.props.repositoryFactory.ecrRepositories);
        }
    }

    private ecrSteps() {
        PermissionsEcr.granteeCanPushPullFromRepositories(this.props.ecrSteps.role, this.props.repositoryFactory.ecrRepositories);
    }

    private environmentPermissions() {
        this.accountsCanDescribeEcr();
        this.accountsCanPullFromEcr();
    }

    private synthStepPermissions() {
        const grantee = this.props.synthStep.role;
        this.grantReadToConfigParam(grantee);
        PermissionsEcr.granteeCanDescribeRepositories(grantee, this.props.repositoryFactory.ecrRepositories);
        grantee.addToPrincipalPolicy(PermissionsBootstrap.policyStatementForBootstrapRole('lookup'));
    }

    private grantReadToConfigParam(grantee: IGrantable) {
        if (!this.configParam) {
            const paramName = NamingHelper.configParamName(this.scope.node.id);
            this.configParam = SsmHelper.getStringParam(this.scope, paramName);
        }
        PermissionsParameter.granteeCanReadParam(grantee, this.configParam);
    }
}