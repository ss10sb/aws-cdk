import {NonConstruct} from "../core";
import {CodeStarSourceProps} from "./code-pipeline-definitions";
import {CodePipelineSource} from "aws-cdk-lib/pipelines";
import {NamingHelper} from "../utils";
import {Construct} from "constructs";

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
            connectionArn: this.props.connectionArn
        });
    }

    protected getBranch(): string {
        return this.props.branch ?? 'main';
    }

    protected getRepo(): string {
        return NamingHelper.fromParts([this.props.owner, this.props.repo], '/');
    }
}