import {CodePipelineSource} from "aws-cdk-lib/pipelines";
import {Construct} from "constructs";
import {NonConstruct} from "../core/non-construct";
import {NamingHelper} from "../utils/naming-helper";

export interface SourceProps {
    owner: string;
    repo: string;
    branch?: string;
    triggerOnPush?: boolean;
}

export interface CodeStarSourceProps extends SourceProps {
    connectionArn: string;
}

export class CodePipelineCodestarSource extends NonConstruct {
    readonly props: CodeStarSourceProps;
    readonly source: CodePipelineSource;

    constructor(scope: Construct, id: string, props: CodeStarSourceProps) {
        super(scope, id);
        this.props = props;
        this.source = this.createCodeStarSource();
    }

    createCodeStarSource(): CodePipelineSource {
        return CodePipelineSource.connection(this.getRepo(), this.getBranch(), {
            connectionArn: this.props.connectionArn,
            triggerOnPush: this.props.triggerOnPush ?? true
        });
    }

    protected getBranch(): string {
        return this.props.branch ?? 'main';
    }

    protected getRepo(): string {
        return NamingHelper.fromParts([this.props.owner, this.props.repo], '/');
    }
}