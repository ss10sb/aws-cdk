import {handler} from "../../../src/lambda/authorizers/token";

describe('token authorizer', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('should authorize token without ips', () => {
        process.env['AUTHORIZER_TOKEN'] = 'abc123';
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Allow');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute-api:us-east-2:111122223333:function',
            headers: {
                'x-auth-token': 'abc123'
            },
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });

    it('should authorize token with ips', () => {
        process.env['AUTHORIZER_TOKEN'] = 'abc123';
        process.env['AUTHORIZER_SUBNETS'] = '127.0.0.0/24,10.0.0.0/8';
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Allow');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute-api:us-east-2:111122223333:function',
            headers: {
                'x-auth-token': 'abc123'
            },
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });

    it('should not authorize token without ips', () => {
        process.env['AUTHORIZER_TOKEN'] = 'abc123';
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Deny');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute-api:us-east-2:111122223333:function',
            headers: {
                'x-auth-token': 'bbb222'
            },
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });

    it('should not authorize token with ips', () => {
        process.env['AUTHORIZER_TOKEN'] = 'abc123';
        process.env['AUTHORIZER_SUBNETS'] = '127.0.0.0/24,10.0.0.0/8';
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Deny');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute-api:us-east-2:111122223333:function',
            headers: {
                'x-auth-token': 'abc123'
            },
            requestContext: {
                identity: {
                    sourceIp: '192.168.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });
});