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
                info.accountInfo = Meteor.call("loadAccountInfo", providerID, userID, accessToken);
                delete info.accessToken;
                return info;
            }
        }
        return null;
    },
    loadAccountInfo: function (providerID, userID, accessToken) {
        switch (providerID) {
            case "dropbox":
                return Meteor.call("loadDropboxAccountInfo", providerID, userID, accessToken);
            default :
                return undefined;
        }
    },
    loadDropboxAccountInfo: function (providerID, userID, accessToken) {
        var coll = distUR.collections.AccountInfo;
        var data = coll.findOne(userID, { fields: { dropbox: 1 } });
        if (!data || !data.dropbox || shouldReload(data.dropbox.updatedAt)) {
            try {
                var httpResult = HTTP.get("https://api.dropbox.com/1/account/info", {
                    headers: {
                        Authorization: "Bearer " + accessToken
                    }
                });
                if (httpResult.statusCode === 200) {
                    var dropboxUserInfo = EJSON.parse(httpResult.content);
                    data = {
                        display_name: dropboxUserInfo.display_name,
                        uid: dropboxUserInfo.uid,
                        locale: dropboxUserInfo.locale,
                        team: dropboxUserInfo.team,
                        quota_info: dropboxUserInfo.quota_info,
                        country: dropboxUserInfo.country,
                        name_details: dropboxUserInfo.name_details,
                        email: dropboxUserInfo.email,
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
    }
});