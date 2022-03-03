const {ConfigEnvironments} = require("../../src/config");
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