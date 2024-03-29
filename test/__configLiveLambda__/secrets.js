const common = require('./_common');
const {ConfigEnvironments} = require("../../src/config/config-definitions");

module.exports = {
    Name: `${common.Name}-secrets`,
    College: common.College,
    Environment: ConfigEnvironments.SDLC,
    Version: "0.0.0",
    Parameters: {
        secrets: []
    }
}
