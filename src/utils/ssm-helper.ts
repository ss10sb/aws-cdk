import {Construct} from "constructs";
import {IStringParameter, ParameterTier, StringParameter} from "aws-cdk-lib/aws-ssm";
import {SecretValue} from "aws-cdk-lib";

export class SsmHelper {

    public static advancedSize: number = (1024 * 4);

    public static createParam(scope: Construct, key: string, value: string): StringParameter {
        return new StringParameter(scope, `${scope.node.id}-${key}-param`, {
            parameterName: key,
            stringValue: value,
            tier: SsmHelper.getParamTier(value)
        });
    }

    public static getStringParam(scope: Construct, key: string): IStringParameter {
        return StringParameter.fromStringParameterAttributes(scope, `${key}-lookup`, {
            parameterName: key
        });
    }

    public static getSecretParam(scope: Construct, key: string, version = 1): IStringParameter {
        return StringParameter.fromSecureStringParameterAttributes(scope, `${key}-lookup`, {
            parameterName: key,
            version: version
        });
    }

    public static getStringValue(scope: Construct, key: string): string | null {
        try {
            return StringParameter.valueFromLookup(scope, key);
        } catch (e) {
            console.log(`Unable to locate param with key "${key}"`);
        }
        return null;
    }

    public static getStringValuePlaceholder(scope: Construct, key: string): string {
        return StringParameter.valueForStringParameter(scope, key);
    }

    public static getSecretValuePlaceholder(scope: Construct, key: string, version = 1): string {
        return SecretValue.ssmSecure(key).toString();
    }

    public static getParamTier(value: string): ParameterTier {
        if (Buffer.byteLength(value, 'utf8') >= SsmHelper.advancedSize) {
            return ParameterTier.ADVANCED;
        }
        return ParameterTier.STANDARD;
    }
}