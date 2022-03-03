const {SubnetType} = require("aws-cdk-lib/aws-ec2");
const {ConfigEnvironments} = require("../../src/config");
module.exports = {
    Environment: ConfigEnvironments.SDLC,
    Parameters: {
        awsParam: SubnetType.PRIVATE_ISOLATED
    }
}