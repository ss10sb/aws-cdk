const {ConfigEnvironments} = require("../../src/config");
module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        secrets: [
            {
                key: 'FOO',
                value: 'sdlc'
            }
        ]
    }
}