"use strict";

/* global Meteor,check,distUR,HTTP,Mongo,Async,_ */

Meteor.methods({
    nativeModuleFilesUpdated: function(providerName, nativeModuleInfos) {
        check(providerName, String);
        check(nativeModuleInfos, Array);
        var currentUserId = Meteor.userId();
        if (!currentUserId) {
            throw distUR.errors.unauthorized;
        }
        var connectedProviderNames = Meteor.call("getConnectedStorageProviderNames");
        if (!_.contains(connectedProviderNames, providerName)) {
            throw distUR.errors.providerNotFound(providerName);
        }
        this.unblock();
        _.forEach(nativeModuleInfos, function (nativeModuleInfo) {
            var _id = currentUserId + ":" + nativeModuleInfo.rootPath;
            var update = {
                $set: {
                    userId: currentUserId
                }
            };
            distUR.collections.Binaries.upsert(_id, update);
        });
    }
});