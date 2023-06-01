import {Match} from "aws-cdk-lib/assertions";

export class MatchHelper {

    static startsWith(str: string) {
        return Match.stringLikeRegexp(`^${str}.*`);
    }

    static endsWith(str: string) {
        return Match.stringLikeRegexp(`.*${str}$`);
    }
}