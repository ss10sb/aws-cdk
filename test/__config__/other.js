const {ConfigEnvironments} = require("../../src/config/config-definitions");
module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        otherParam: "foo"
    }
}