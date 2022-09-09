let logLevel = undefined;

function shouldLog() {
    if (logLevel === undefined) {
        logLevel = process.env.AUTHORIZER_LOG_LEVEL ?? 'NONE';
    }
    return logLevel !== 'NONE';
}

exports.log = function (key, obj) {
    if (shouldLog()) {
        console.debug(key, obj);
    }
}