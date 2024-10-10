import {FunctionType} from "./lambda-definitions";

export class LambdaTimeout {
    public static timeout(type: FunctionType, apiGateway = true): number {
        if (type === FunctionType.WEB && apiGateway) {
            return 28; //gateway timeout 29 s
        }
        if (type === FunctionType.QUEUE) {
            return 30; //queue visibility timeout 30 s
        }
        if (type === FunctionType.ARTISAN) {
            return 720;
        }
        return 120;
    }
}