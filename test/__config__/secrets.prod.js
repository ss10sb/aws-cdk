const {ConfigEnvironments} = require("../../src/config/config-definitions");
module.exports = {
    Environment: ConfigEnvironments.PROD,
    Parameters: {
        secrets: [
            {
                key: 'FOO',
                value: 'prod'
            }
        ]
    }
}