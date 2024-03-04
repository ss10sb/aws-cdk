import {Construct} from "constructs";
import {PermissionsParameter} from "./permissions-parameter";
import {IGrantable, IRole} from "aws-cdk-lib/aws-iam";
import {IStringParameter} from "aws-cdk-lib/aws-ssm";
import {PermissionsBootstrap} from "./permissions-bootstrap";
import {EnvConfig} from "../env/env-base-stack";
import {NonConstruct} from "../core/non-construct";
import {CodePipelineLambdaStackServicesProps} from "../pipeline/code-pipeline-definitions";
import {NamingHelper} from "../utils/naming-helper";
import {SsmHelper} from "../utils/ssm-helper";
import {MakeConfig} from "../v2/stage/make-definitions";

export class PermissionsCodePipelineLambdaStack extends NonConstruct {

    readonly props: CodePipelineLambdaStackServicesProps;
    readonly environments: EnvConfig[] | MakeConfig[];
    configParam?: IStringParameter;

    constructor(scope: Construct, id: string, props: CodePipelineLambdaStackServicesProps, environments: EnvConfig[] | MakeConfig[]) {
        super(scope, id);
        this.props = props;
        this.environments = environments;
        this.handlePermissions();
    }


    private handlePermissions() {
        this.synthStepPermissions();
        this.environmentPermissions();
    }

    private environmentPermissions() {
        //
    }

    private synthStepPermissions() {
        const grantee = this.props.synthStep.role;
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