"use strict";

/* global Meteor,Package,Accounts,Promise,distUR */

// Connector plugin patch:
Meteor.connectWith = function (service, options, callback) {
    // Support a callback without options
    if (!callback && typeof options === "function") {
        callback = options;
        options = null;
    }
    var makePascalCased = function (word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
    };
    var connectCredentialRequestCompleteCallback = Accounts.oauth.connectCredentialRequestCompleteHandler(callback);
    var Service = typeof service === "string" ? Package[service][makePascalCased(service)] : service;
    Service.requestCredential(options, connectCredentialRequestCompleteCallback);
};

distUR.call = Promise.promisify(Meteor.call, Meteor);