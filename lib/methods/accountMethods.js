"use strict";

/* global Meteor,check,distUR */

Meteor.methods({
    getAccountData: function(providerID, userID) {
        check(providerID, String);

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
                delete info.accessToken;
                return info;
            }
        }
        return null;
    }
});