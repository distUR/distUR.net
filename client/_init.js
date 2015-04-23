// Connector plugin patch:
Meteor.connectWith = function (service, options, callback) {
    // Support a callback without options
    if (!callback && typeof options === "function") {
        callback = options;
        options = null;
    }
    var connectCredentialRequestCompleteCallback = Accounts.oauth.connectCredentialRequestCompleteHandler(callback);
    var Service = typeof service === "string" ? Package[service][makePascalCased(service)] : service;
    Service.requestCredential(options, connectCredentialRequestCompleteCallback);
};

distUR.call = Promise.promisify(Meteor.call, Meteor);