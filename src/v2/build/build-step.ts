import {BuildEnvironmentProps, BuildStepEnvironment} from "./build-step-environment";
import {NonConstruct} from "../../core/non-construct";
import {Construct} from "constructs";
import {CodeBuildStepProps} from "aws-cdk-lib/pipelines";
import {BuildSpec} from "aws-cdk-lib/aws-codebuild";
import {PhpVersionHelper} from "../../utils/php-version-helper";
import {BaseParameters} from "../../config/config-definitions";

export interface BuildStepProps {
    buildEnvironment: BuildEnvironmentProps;
    buildSpec?: { [p: string]: any };
    commands?: string[];
}

export class BuildStep extends NonConstruct {
    protected props: BuildStepProps;

    constructor(scope: Construct, id: string, props: BuildStepProps) {
        super(scope, id);
        this.props = props;
    }

    static makeProps(config: Record<string, any>): BuildStepProps {
        return <BuildStepProps>{
            buildEnvironment: {
                ...config.buildStep?.buildEnvironment ?? {},
                phpVersion: config.buildStep?.buildEnvironment?.phpVersion ?? config.phpVersion,
            },
            buildSpec: config.buildStep?.buildSpec
        };
    }

    static makePropsFromParameters(parameters: BaseParameters): BuildStepProps {
        return <BuildStepProps>{
            buildEnvironment: {
                ...parameters.buildStep?.buildEnvironment ?? {},
                phpVersion: parameters.buildStep?.buildEnvironment?.phpVersion ?? parameters.phpVersion
            },
            buildSpec: parameters.buildStep?.buildSpec
        }
    }

    makeCodeBuildStepProps(): CodeBuildStepProps {
        const builderStepEnv = new BuildStepEnvironment(this.scope, 'build-step-env', this.props.buildEnvironment);
        return {
            commands: this.getCommands(),
            buildEnvironment: builderStepEnv.buildEnvironment(),
            primaryOutputDirectory: "./",
            partialBuildSpec: this.getPartialBuildSpec()
        }
    }

    protected getPartialBuildSpec(): BuildSpec {
        if (this.props.buildSpec) {
            return BuildSpec.fromObject(this.props.buildSpec);
        }
        return BuildSpec.fromObject({
            phases: {
                install: {
                    "runtime-versions": {
                        php: PhpVersionHelper.runtimeVersionFromProps(this.props.buildEnvironment),
                        nodejs: '22'
                    },
                    commands: this.getInstallCommands()
                }
            }
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
        if (this.props.commands) {
            return this.props.commands;
        }
        return [
            'cd codebase',
            'mv resources.copy resources && mv config.copy config && mv public.copy public',
            'cp .env.example .env',
            'composer install --ignore-platform-reqs --no-ansi --no-autoloader --no-dev --no-interaction --no-progress',
            'composer dump-autoload --optimize --classmap-authoritative --ignore-platform-reqs',
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