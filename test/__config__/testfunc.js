const f = require('./testfuncdata');
const {ConfigEnvironments} = require("../../src/config");

module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        testFuncParam: f('foo')
    }
}