const f = require('./testfuncdata');
const {ConfigEnvironments} = require("../../src/config/config-definitions");

module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        testFuncParam: f('foo')
    }
}