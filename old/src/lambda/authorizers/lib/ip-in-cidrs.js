const logger = require('./logger');

// https://tech.mybuilder.com/determining-if-an-ipv4-address-is-within-a-cidr-range-in-javascript/
const ip4ToInt = ip =>
    ip.split('.').reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;

const isIp4InCidr = ip => cidr => {
    const [range, bits = 32] = cidr.split('/');
    const mask = ~(2 ** (32 - bits) - 1);
    return (ip4ToInt(ip) & mask) === (ip4ToInt(range) & mask);
};

const isIp4InCidrs = (ip, cidrs) => cidrs.some(isIp4InCidr(ip));

exports.sourceIpMatches = function (event) {
    const ips = (process.env.AUTHORIZER_SUBNETS ?? '').split(',').filter(n => n);
    logger.log('IPs', ips);
    if (ips.length === 0) {
        return true;
    }
    return isIp4InCidrs(event['requestContext']['identity']['sourceIp'], ips);
}