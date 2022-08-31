const common = require('./_common');
const cs = require('./_commonsecrets');
const {ConfigEnvironments} = require("../../src/config/config-definitions");

let secrets = [];
secrets.push(...cs.secrets, ...[
    {
        key: 'APP_KEY',
        value: 'base64:/sdlc'
    },
    {
        key: 'APP_URL',
        value: `https://${common.subdomain}.sdlc.${common.domain}`
    }
]);

module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        secrets: secrets
    }
}
