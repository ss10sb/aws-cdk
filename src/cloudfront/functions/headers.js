function handler(event) {
    var request = event.request;
    var clientIP = event.viewer.ip;

    request.headers['x-cf-source-ip'] = {value: clientIP};

    return request;
}