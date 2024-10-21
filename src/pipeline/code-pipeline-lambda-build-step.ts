import {NonConstruct} from "../core/non-construct";
import {CodeBuildStep, CodePipelineSource} from "aws-cdk-lib/pipelines";
import {Construct} from "constructs";
import {Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import {PhpVersion} from "../config/config-definitions";
import {PhpVersionHelper} from "../utils/php-version-helper";
import {BuildSpec} from "aws-cdk-lib/aws-codebuild";

export interface CodePipelineLambdaBuildStepProps {
    input: CodeBuildStep | CodePipelineSource;
    phpVersion?: PhpVersion;
}

export class CodePipelineLambdaBuildStep extends NonConstruct {

    readonly step: CodeBuildStep;
    readonly props: CodePipelineLambdaBuildStepProps;
    readonly role: Role;

    constructor(scope: Construct, id: string, props: CodePipelineLambdaBuildStepProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, this.mixNameWithId('lambda-build-step-role'), {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.step = this.create();
    }

    protected create(): CodeBuildStep {
        return new CodeBuildStep(this.mixNameWithId('build-step'), {
            input: this.props.input,
            commands: this.getCommands(),
            role: this.role,
            buildEnvironment: {
                buildImage: PhpVersionHelper.awsImageFromProps(this.props),
                privileged: true
            },
            primaryOutputDirectory: "./",
            partialBuildSpec: BuildSpec.fromObject({
                phases: {
                    install: {
                        "runtime-versions": {
                            php: PhpVersionHelper.runtimeVersionFromProps(this.props),
                        },
                        commands: this.getInstallCommands()
                    }
                }
            })
        });
    }

    protected getInstallCommands(): string[] {
        return [
            'php -v',
            'php -r "copy(\'https://getcomposer.org/installer\', \'composer-setup.php\');"',
            'php composer-setup.php',
            'php -r "unlink(\'composer-setup.php\');"',
            'mv composer.phar /usr/local/bin/composer'
        ];
    }

    protected getCommands(): string[] {
        return [
            'cd codebase',
            'mv resources.copy resources && mv config.copy config && mv public.copy public',
            'cp .env.example .env',
            'composer install --ignore-platform-reqs --no-ansi --no-autoloader --no-dev --no-interaction --no-progress',
            'composer dump-autoload --optimize --classmap-authoritative',
            'php artisan route:cache',
            'rm -rf vendor/bin',
            'rm -f .env',
            'npm ci',
            'npm run prod',
            'rm -rf node_modules tests',
            'cd ..',
        ]
    }
}