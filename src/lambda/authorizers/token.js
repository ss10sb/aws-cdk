const genPolicy = require('./lib/generate-policy');
const sourceIp = require('./lib/ip-in-cidrs');
const logger = require('./lib/logger');

exports.handler = function (event, context, callback) {
    logger.log('Event', event);
    const token = event.headers['x-auth-token'] ?? 'INVALID';
    if (token === 'INVALID') {
        logger.log('Token', 'Invalid token');
        callback('Unauthorized');
        return;
    }
    logger.log('Token', process.env.AUTHORIZER_TOKEN);
    if (token === process.env.AUTHORIZER_TOKEN && sourceIp.sourceIpMatches(event)) {
        callback(null, genPolicy.generatePolicy('Allow', event.methodArn));
        return;
    }
    callback(null, genPolicy.generatePolicy('Deny', event.methodArn));
};