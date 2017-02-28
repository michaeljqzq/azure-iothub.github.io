function getOptionsFromConnectionString(connectionString) {
    connectionString = connectionString.replace(/\s/g, '').split(';');
    var connectionObject = {};
    var options = {}
    connectionString.forEach(function(item) {
        item = item.split('=');
        connectionObject[item[0]] = item[1];
    });

    options.host = connectionObject.HostName;
    options.port = 443;
    options.clientId = connectionObject.DeviceId;
    options.username = connectionObject.HostName + '/' + connectionObject.DeviceId + '/DeviceClientType=azure-iot-device%2F1.1.2&api-version=2016-11-14';
    options.password = getSaSToken(connectionObject);
    return options;
}

function getSaSToken(connectionObject) {
    var sr = encodeUriComponentStrict(connectionObject.HostName + '/devices/' + connectionObject.DeviceId);
    var se = Math.round(new Date().getTime() / 1000) + 24 * 3600;
    var StringToSign = sr + '\n' + se;
    var SharedKey = connectionObject.SharedAccessKey;
    var sig = encodeUriComponentStrict(CryptoJS.HmacSHA256(StringToSign, CryptoJS.enc.Base64.parse(SharedKey)).toString(CryptoJS.enc.Base64));
    return 'SharedAccessSignature sr=' + sr + '&sig=' + sig + '&se=' + se;
}

function encodeUriComponentStrict(str) {
    // this stricter version of encodeURIComponent is a recommendation straight out of the MDN docs, see:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#Description
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}