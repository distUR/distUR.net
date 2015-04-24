"use strict";

/* global Meteor,check,distUR,HTTP */

Meteor.methods({
    getAccountData: function(providerID, userID) {
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
            var info = result.services[providerID];
            if (info) {
                var accessToken = info.accessToken;
                if (providerID === "dropbox") {
                    try {
                        var httpResult = HTTP.get("https://api.dropbox.com/1/account/info", {
                            headers: {
                                Authorization: "Bearer " + accessToken
                            }
                        });
                        if (httpResult.statusCode === 200) {
                            var dbUserInfo = EJSON.parse(httpResult.content);
                            info.quotaInfo = {
                                availableMB: (dbUserInfo.quota_info.quota / 1024 / 1024).toFixed(2),
                                freeMB: ((dbUserInfo.quota_info.quota - dbUserInfo.quota_info.normal) / 1024 / 1024).toFixed(2)
                            };
                        }
                    }
                    catch (err) {
                        console.log(err); // TODO: Do something with errors
                    }
                }
                delete info.accessToken;
                return info;
            }
        }
        return null;
    }
});