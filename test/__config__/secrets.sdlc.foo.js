const {ConfigEnvironments} = require("../../src/config/config-definitions");
module.exports = {
    Environment: ConfigEnvironments.SDLC,
    NameSuffix: 'foo',
    Parameters: {
        secrets:
            [
                {
                    key: 'FOO',
                    value: 'sdlc.foo'
                },
                {
                    key: 'BAR',
                    value: 'sdlc.bar'
                }
            ]
    }
}