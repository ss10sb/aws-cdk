const TestClass = require("./test.class");
const {ConfigEnvironments} = require("../../src/config/config-definitions");

module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        testclass: new TestClass('foo')
    }
}