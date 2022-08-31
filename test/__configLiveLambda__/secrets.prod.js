const common = require('./_common');
const cs = require('./_commonsecrets');
const {ConfigEnvironments} = require("../../src/config/config-definitions");
let secrets = [];

secrets.push(...cs.secrets, ...[
    {
        key: 'APP_KEY',
        value: 'base64:prod'
    },
    {
        key: 'APP_URL',
        value: `https://${common.subdomain}.${common.domain}`
    }
]);

module.exports = {
    Environment: ConfigEnvironments.PROD,
    Parameters: {
        secrets: secrets
    }
}
