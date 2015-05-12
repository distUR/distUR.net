"use strict";

/* global Meteor,check,distUR,HTTP,Mongo,Async,_ */

Meteor.methods({
    nativeModuleFilesUpdated: function(providerName, nativeModuleInfos) {
        check(providerName, String);
        check(nativeModuleInfos, Array);
        var currentUser = Meteor.user();
        if (!currentUser) {
            throw distUR.errors.unauthorized;
        }
        var provider = currentUser.services[providerName];
        if (!provider) {
            throw distUR.errors.providerNotFound(providerName);
        }
        this.unblock();
        _.forEach(nativeModuleInfos, function (nativeModuleInfo) {
            var _id = currentUser._id + ":" + nativeModuleInfo.rootPath;
            var update = {
                $set: {
                    _id: _id,
                    userId: currentUser._id,
                    createdAt: new Date(),
                    package: nativeModuleInfo.package,
                    os: nativeModuleInfo.os,
                    runtime: nativeModuleInfo.runtime,
                    storage: {
                        provider: providerName,
                        id: provider.id,
                        rootPath: nativeModuleInfo.rootPath,
                        files: nativeModuleInfo.files
                    }
                }
            };
            distUR.collections.Binaries.upsert(_id, update);
        });
    }
});