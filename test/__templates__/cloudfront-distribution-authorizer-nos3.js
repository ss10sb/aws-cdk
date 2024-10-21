const {MatchHelper} = require("../../src/utils/testing/match-helper");
module.exports = {
    Resources: {
        certfoobarcom430629AB: {
            Type: 'AWS::CertificateManager::Certificate',
            Properties: {
                DomainName: 'foo.bar.com',
                DomainValidationOptions: [ { DomainName: 'foo.bar.com', HostedZoneId: 'DUMMY' } ],
                Tags: [ { Key: 'Name', Value: 'stack/cert-foo.bar.com' } ],
                ValidationMethod: 'DNS'
            },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          functioneventfn0lgD47CFCEB: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 30 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
        },
        functioneventfn0ServiceRole30E080B7: {
            Type: 'AWS::IAM::Role',
            Properties: {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' }
                        }
                    ],
                    Version: '2012-10-17'
                },
                ManagedPolicyArns: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                            ]
                        ]
                    }
                ]
            }
        },
        functioneventfn01CDA78AF: {
            Type: 'AWS::Lambda::Function',
            Properties: {
                Code: {
                    S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                    S3Key: MatchHelper.endsWith('zip')
                },
                FunctionName: 'function-event-fn-0',
                Handler: 'artisan',
                Layers: [
                    {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':lambda:us-west-2:534081306603:layer:php-81-fpm:59'
                            ]
                        ]
                    }
                ],
              LoggingConfig: { LogGroup: { Ref: 'functioneventfn0lgD47CFCEB' } },
                MemorySize: 512,
              Role: {
                'Fn::GetAtt': [ 'functioneventfn0ServiceRole30E080B7', 'Arn' ]
              },
                Runtime: 'provided.al2',
                Timeout: 120
            },
            DependsOn: [ 'functioneventfn0ServiceRole30E080B7' ]
        },
          httpapiauthorizerfnlg7D7CDD47: {
            Type: 'AWS::Logs::LogGroup',
            Properties: { RetentionInDays: 7 },
            UpdateReplacePolicy: 'Delete',
            DeletionPolicy: 'Delete'
          },
          httpapiauthorizerfnServiceRoleE977EE3D: {
            Type: 'AWS::IAM::Role',
            Properties: {
              AssumeRolePolicyDocument: {
                Statement: [
                  {
                    Action: 'sts:AssumeRole',
                    Effect: 'Allow',
                    Principal: { Service: 'lambda.amazonaws.com' }
                  }
                ],
                Version: '2012-10-17'
              },
              ManagedPolicyArns: [
                {
                  'Fn::Join': [
                    '',
                    [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
                    ]
                  ]
                }
              ]
            }
          },
          httpapiauthorizerfn8B4D1E1C: {
            Type: 'AWS::Lambda::Function',
            Properties: {
              Code: {
                S3Bucket: 'cdk-hnb659fds-assets-12344-us-west-2',
                S3Key: 'c53d3eefd84eda81ec21cae72089e12b7729368cb85e86fc9fb8b2031b76415b.zip'
              },
              Environment: {
                Variables: {
                  AUTHORIZER_TOKEN: {
                    'Fn::Join': [
                      '',
                      [
                        '{{resolve:secretsmanager:arn:',
                        { Ref: 'AWS::Partition' },
                        ':secretsmanager:us-west-2:12344:secret:secrets-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
                      ]
                    ]
                  }
                }
              },
              FunctionName: 'http-api-authorizer-fn',
              Handler: 'token.handler',
              LoggingConfig: { LogGroup: { Ref: 'httpapiauthorizerfnlg7D7CDD47' } },
              Role: {
                'Fn::GetAtt': [ 'httpapiauthorizerfnServiceRoleE977EE3D', 'Arn' ]
              },
              Runtime: MatchHelper.startsWith('nodejs'),
              Timeout: 5
            },
            DependsOn: [ 'httpapiauthorizerfnServiceRoleE977EE3D' ]
          },
        httpapihttpapi5E89BCFA: {
            Type: 'AWS::ApiGatewayV2::Api',
            Properties: {
                DisableExecuteApiEndpoint: false,
                Name: 'http-api-http-api',
                ProtocolType: 'HTTP'
            }
        },
        httpapihttpapiDefaultRoutehttpapihttpapiint560D1C07: {
            Type: 'AWS::ApiGatewayV2::Integration',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                IntegrationType: 'AWS_PROXY',
                IntegrationUri: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                PayloadFormatVersion: '2.0',
                RequestParameters: {
                    'append:header.x-cf-source-ip': '$request.header.x-cf-source-ip'
                }
            }
        },
        httpapihttpapiDefaultRoutehttpapihttpapiintPermission5B4ABB59: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'functioneventfn01CDA78AF', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-west-2:12344:',
                            { Ref: 'httpapihttpapi5E89BCFA' },
                            '/*/*'
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultRouteBFDE9743: {
            Type: 'AWS::ApiGatewayV2::Route',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                AuthorizationType: 'CUSTOM',
                AuthorizerId: { Ref: 'httpapihttpapiauthorizer9218F2F9' },
              RouteKey: '$default',
                Target: {
                    'Fn::Join': [
                        '',
                        [
                            'integrations/',
                            {
                                Ref: 'httpapihttpapiDefaultRoutehttpapihttpapiint560D1C07'
                            }
                        ]
                    ]
                }
            }
        },
        httpapihttpapiauthorizer9218F2F9: {
            Type: 'AWS::ApiGatewayV2::Authorizer',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
                AuthorizerPayloadFormatVersion: '1.0',
                AuthorizerResultTtlInSeconds: 300,
              AuthorizerType: 'REQUEST',
                AuthorizerUri: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':apigateway:us-west-2:lambda:path/2015-03-31/functions/',
                            {
                                'Fn::GetAtt': [ 'httpapiauthorizerfn8B4D1E1C', 'Arn' ]
                            },
                            '/invocations'
                        ]
                    ]
                },
                IdentitySource: [
                    '$request.header.x-auth-token',
                    '$context.identity.sourceIp'
              ],
              Name: 'http-api-http-lambda-authorizer'
            }
        },
        httpapihttpapistackhttpapihttpapiauthorizer75CF2ED6PermissionB6ED44F2: {
            Type: 'AWS::Lambda::Permission',
            Properties: {
                Action: 'lambda:InvokeFunction',
                FunctionName: { 'Fn::GetAtt': [ 'httpapiauthorizerfn8B4D1E1C', 'Arn' ] },
                Principal: 'apigateway.amazonaws.com',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':execute-api:us-west-2:12344:',
                            { Ref: 'httpapihttpapi5E89BCFA' },
                            '/authorizers/',
                            { Ref: 'httpapihttpapiauthorizer9218F2F9' }
                        ]
                    ]
                }
            }
        },
        httpapihttpapiDefaultStage2FC5FDEF: {
            Type: 'AWS::ApiGatewayV2::Stage',
            Properties: {
                ApiId: { Ref: 'httpapihttpapi5E89BCFA' },
              AutoDeploy: true,
              StageName: '$default'
            }
        },
        distributionoriginrequestpolicyF5975AB2: {
            Type: 'AWS::CloudFront::OriginRequestPolicy',
            Properties: {
                OriginRequestPolicyConfig: {
                    CookiesConfig: { CookieBehavior: 'all' },
                    HeadersConfig: {
                        HeaderBehavior: 'allViewerAndWhitelistCloudFront',
                        Headers: [ 'CloudFront-Viewer-Address' ]
                    },
                    Name: 'distribution-origin-request-policy',
                    QueryStringsConfig: { QueryStringBehavior: 'all' }
                }
            }
        },
        distributioncfdistD32B15FD: {
            Type: 'AWS::CloudFront::Distribution',
            Properties: {
                DistributionConfig: {
                    Aliases: [ 'foo.bar.com' ],
                    Comment: 'distribution-cf-dist',
                    DefaultCacheBehavior: {
                        AllowedMethods: [
                            'GET',     'HEAD',
                            'OPTIONS', 'PUT',
                            'PATCH',   'POST',
                            'DELETE'
                        ],
                        CachePolicyId: '4135ea2d-6df8-44a3-9df3-4b5a84be39ad',
                        Compress: true,
                        FunctionAssociations: [],
                        OriginRequestPolicyId: { Ref: 'distributionoriginrequestpolicyF5975AB2' },
                        ResponseHeadersPolicyId: '67f7725c-6f97-4210-82d7-5512b31e9d03',
                        TargetOriginId: 'stackdistributioncfdistOrigin19DF8816C',
                        ViewerProtocolPolicy: 'redirect-to-https'
                    },
                    Enabled: true,
                    HttpVersion: 'http2',
                    IPV6Enabled: true,
                    Origins: [
                        {
                            ConnectionAttempts: 1,
                            CustomOriginConfig: {
                                OriginKeepaliveTimeout: 5,
                                OriginProtocolPolicy: 'https-only',
                                OriginReadTimeout: 30,
                                OriginSSLProtocols: [ 'TLSv1.2' ]
                            },
                            DomainName: {
                                'Fn::Select': [
                                    2,
                                    {
                                        'Fn::Split': [
                                            '/',
                                            {
                                                'Fn::Join': [
                                                    '',
                                                    [
                                                        'https://',
                                                        { Ref: 'httpapihttpapi5E89BCFA' },
                                                        '.execute-api.us-west-2.',
                                                        { Ref: 'AWS::URLSuffix' },
                                                        '/'
                                                    ]
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            },
                            Id: 'stackdistributioncfdistOrigin19DF8816C',
                            OriginCustomHeaders: [
                                {
                                    HeaderName: 'x-auth-token',
                                    HeaderValue: {
                                        'Fn::Join': [
                                            '',
                                            [
                                                '{{resolve:secretsmanager:arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':secretsmanager:us-west-2:12344:secret:secrets-secrets/environment:SecretString:AUTHORIZER_TOKEN::}}'
                                            ]
                                        ]
                                    }
                                }
                            ]
                        }
                    ],
                    PriceClass: 'PriceClass_100',
                    ViewerCertificate: {
                        AcmCertificateArn: { Ref: 'certfoobarcom430629AB' },
                        MinimumProtocolVersion: 'TLSv1.2_2019',
                        SslSupportMethod: 'sni-only'
                    }
                }
            }
        }
    }
}