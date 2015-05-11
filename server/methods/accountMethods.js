"use strict";

/* global Meteor,check,distUR,HTTP,EJSON,moment */

var shouldReload = function (updatedAt) {
    var reloadMinutes = 10;
    return moment.duration(moment().diff(updatedAt)).asMinutes() > reloadMinutes;
};

Meteor.methods({
    getAccountData: function (providerID, userID) {
        check(providerID, String);

        this.unblock();

        var fid = "services." + providerID;
        var select = {};
        select[fid] = 1;
        var result;
        if (userID) {
            result = Meteor.users.findOne(userID, { fields: select });
        }
        else {
            result = Meteor.user();
        }
        if (result && result.services) {
            userID = result._id;
            var info = result.services[providerID];
            if (info) {
                var accessToken = info.accessToken;
                info.accountInfo = Meteor.call("_loadAccountInfo", providerID, userID, accessToken);
                delete info.accessToken;
                return info;
            }
        }
        return null;
    },
    _loadAccountInfo: function (providerID, userID, accessToken) {
        switch (providerID) {
            case "dropbox":
                return Meteor.call("_loadDropboxAccountInfo", providerID, userID, accessToken);
            default :
                return undefined;
        }
    },
    _loadDropboxAccountInfo: function (providerID, userID, accessToken) {
        var Dropbox = Meteor.npmRequire("dropbox");
        var coll = distUR.collections.AccountInfo;
        var data = coll.findOne(userID, { fields: { dropbox: 1 } });
        if (!data || !data.dropbox || shouldReload(data.dropbox.updatedAt)) {
            try {
                var client = new Dropbox.Client({token: accessToken});
                var getAccountInfo = Async.wrap(client, "getAccountInfo");
                var dropboxUserInfo = getAccountInfo();
                data = {
                    name: dropboxUserInfo.name,
                    uid: dropboxUserInfo.uid,
                    countryCode: dropboxUserInfo.countryCode,
                    email: dropboxUserInfo.email,
                    publicAppUrl: dropboxUserInfo.publicAppUrl,
                    quota: dropboxUserInfo.quota,
                    usedQuota: dropboxUserInfo.usedQuota,
                    privateBytes: dropboxUserInfo.privateBytes,
                    sharedBytes: dropboxUserInfo.sharedBytes,
                    updatedAt: new Date()
                };
                coll.upsert(
                    userID,
                    {
                        $set: {
                            dropbox: data
                        }
                    });
                return data;

            }
            catch (err) {
                console.log(err); // TODO: Do something with errors
            }
            return data ? data.dropbox : undefined;
        }
        else {
            return data.dropbox;
        }
    },
    getNumberOfConnectedProviders: function (userID) {
        var result = Meteor.users.findOne(userID,
            {
                fields: {
                    "services.github.id": 1,
                    "services.dropbox.id": 1
                }
            });
        if (result && result.services) {
            var count = 0;
            if (result.services.github) {
                count++;
            }
            if (result.services.dropbox) {
                count++;
            }
            return count;
        }
        return 0;
    },
    getConnectedStorageProviderNames: function() {
        var currentUser = Meteor.user();
        if (!currentUser) {
            throw distUR.errors.unauthorized;
        }
        return [ "dropbox" ]; // It maybe contains new providers on the future.
    },
    getStorageAccessToken: function(providerName) {
        var currentUser = Meteor.user();
        if (!currentUser) {
            throw distUR.errors.unauthorized;
        }
        if (providerName === "dropbox") {
            return currentUser.services.dropbox.accessToken;
        }
        throw new Meteor.Error("not-found", "Provider Not Found", "User ha no connection to storage provider: " + providerName);
    }
});