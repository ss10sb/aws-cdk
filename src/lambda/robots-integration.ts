import {MethodOptions, MockIntegration, Model} from "aws-cdk-lib/aws-apigateway";
import fs from "fs";
import path from "path";

export interface RobotsResult {
    integration: MockIntegration;
    methodOptions: MethodOptions;
}

export class RobotsIntegration {

    static create(): RobotsResult {
        const integration = new MockIntegration({
            requestTemplates: {
                'application/json': '{"statusCode": 200}'
            },
            integrationResponses: [
                {
                    statusCode: "200",
                    responseTemplates: {
                        'text/plain': robots
                    }
                }
            ]
        });
        const methodOptions: MethodOptions = {
            methodResponses: [{
                statusCode: '200',
                responseModels: {
                    'text/plain': Model.EMPTY_MODEL
                }
            }]
        };
        return {
            integration: integration,
            methodOptions: methodOptions
        }
    }
}

const robots = `
User-agent: *
Disallow: /

User-agent: bingbot
Disallow: /`;