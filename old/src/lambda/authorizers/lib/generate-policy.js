const logger = require('./logger');

function getResourceArn(resource) {
    const tmp = resource.split(':');
    const apiGatewayArnTmp = tmp[5].split('/');
    return tmp[0] + ":" + tmp[1] + ":" + tmp[2] + ":" + tmp[3] + ":" + tmp[4] + ":" + apiGatewayArnTmp[0] + '/*/*';
}

exports.generatePolicy = function (effect, resource) {
    let authResponse = {};

    authResponse.principalId = 'apigateway.amazonaws.com';
    if (effect && resource) {
        let policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        let statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = getResourceArn(resource);
        policyDocument.Statement[0] = statementOne;
        logger.log('Auth', statementOne);
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}

