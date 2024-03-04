import {Construct} from "constructs";
import {Stack} from "aws-cdk-lib";
import {PermissionsEcr} from "./permissions-ecr";
import {PermissionsParameter} from "./permissions-parameter";
import {IGrantable, IRole, Role} from "aws-cdk-lib/aws-iam";
import {IStringParameter} from "aws-cdk-lib/aws-ssm";
import {PermissionsBootstrap} from "./permissions-bootstrap";
import {EnvConfig} from "../env/env-base-stack";
import {NonConstruct} from "../core/non-construct";
import {CodePipelineEcsStackServicesProps} from "../pipeline/code-pipeline-definitions";
import {NamingHelper} from "../utils/naming-helper";
import {SsmHelper} from "../utils/ssm-helper";
import {MakeConfig} from "../v2/stage/make-definitions";

export class PermissionsCodePipelineEcsStack extends NonConstruct {

    readonly props: CodePipelineEcsStackServicesProps;
    readonly environments: EnvConfig[] | MakeConfig[];
    configParam?: IStringParameter;

    constructor(scope: Construct, id: string, props: CodePipelineEcsStackServicesProps, environments: EnvConfig[] | MakeConfig[]) {
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
        // "fix" until aws fixes the automatic policy text by resource (needs * or something at the end)
        this.replaceEcrPolicyText();
        //this.accountsCanDescribeEcr();
        //this.accountsCanPullFromEcr();
    }

    private replaceEcrPolicyText() {
        const accountIds: string[] = [];
        for (const envConfig of this.environments) {
            if (envConfig.AWSAccountId) {
                accountIds.push(envConfig.AWSAccountId);
            }
        }
        PermissionsEcr.replacePolicyTextForAccountIds(accountIds, this.props.repositoryFactory.ecrRepositories);
    }

    private synthStepPermissions() {
        const grantee = this.props.synthStep.role;
        PermissionsEcr.granteeCanDescribeRepositories(grantee, this.props.repositoryFactory.ecrRepositories);
        if (!(this.props.needsSharedSynthStepPermissions ?? true)) {
            return;
        }
        this.grantReadToConfigParam(grantee);
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