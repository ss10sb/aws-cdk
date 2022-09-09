import {handler} from "../../../src/lambda/authorizers/host";

describe('host authorizer', () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = {...OLD_ENV};
    });

    afterAll(() => {
        process.env = OLD_ENV;
    });

    it('should authorize domain without ips', () => {
        process.env['AUTHORIZER_DOMAIN'] = 'test2.example.edu'
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Allow');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute...',
            headers: {
                Host: 'test2.example.edu'
            },
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });

    it('should authorize domain with ips', () => {
        process.env['AUTHORIZER_DOMAIN'] = 'test2.example.edu'
        process.env['AUTHORIZER_SUBNETS'] = '127.0.0.0/24,10.0.0.0/8';
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Allow');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute...',
            headers: {
                Host: 'test2.example.edu'
            },
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });

    it('should not authorize domain without ips', () => {
        process.env['AUTHORIZER_DOMAIN'] = 'test2.example.edu'
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Deny');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute...',
            headers: {
                Host: 'test1.example.edu'
            },
            requestContext: {
                identity: {
                    sourceIp: '127.0.0.1'
                }
            }
        }
        handler(event, {} ,callback);
    });

    it('should not authorize domain with ips', () => {
        process.env['AUTHORIZER_DOMAIN'] = 'test2.example.edu'
        process.env['AUTHORIZER_SUBNETS'] = '127.0.0.0/24,10.0.0.0/8';
        const callback = function(name: string | null, policy: Record<string, any>) {
            expect(policy.policyDocument.Statement[0].Effect).toEqual('Deny');
        };
        const event = {
            type: 'REQUEST',
            methodArn: 'arn:aws:execute...',
            headers: {
                Host: 'test2.example.edu'
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