const common = require('./_common');
const cs = require('./_commonsecrets');
let secrets = [];

secrets.push(...cs.secrets, ...[
    {
        key: 'APP_KEY',
        value: 'base64:prod-abc'
    },
    {
        key: 'APP_URL',
        value: `https://${common.subdomain}.${common.domain}`
    }
]);

module.exports = {
    Parameters: {
        secrets: secrets
    }
}
