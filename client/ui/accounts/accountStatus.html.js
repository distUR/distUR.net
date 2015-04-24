"use strict";

/* global Template,_,Meteor,ReactiveVar,Package,Tracker,distUR,Promise */

var toMB = function (bytes) {
    return (bytes / 1024 / 1024).toFixed(2);
};

Template.accountStatus.helpers({
    title: function () {
        return _.capitalize(this.id);
    },
    icon: function () {
        return "fa-" + this.id;
    },
    class: function () {
        return Template.instance().accountData.get() ? "primary" : "default";
    },
    accountData: function () {
        return Template.instance().accountData.get();
    },
    loading: function () {
        return Template.instance().loading.get();
    },
    quotaInfo: function () {
        var ad = Template.instance().accountData.get();
        if (ad && ad.accountInfo && ad.accountInfo.quota_info) {
            return {
                freeMB: toMB(ad.accountInfo.quota_info.quota - ad.accountInfo.quota_info.normal),
                availableMB: toMB(ad.accountInfo.quota_info.quota)
            };
        }
    },
    link: function () {
        var ad = Template.instance().accountData.get();
        if (ad) {
            switch (this.id) {
                case "github":
                    return "https://github.com/" + ad.username;
                case "dropbox":
                    return "https://www.dropbox.com/account#profile";
            }
        }
        return null;
    },
    canDisconnect: function () {
        var num = Template.instance().connectedProvidersCount.get();
        return _.isNumber(num) && num > 1;
    },
    canSignOut: function () {
        var num = Template.instance().connectedProvidersCount.get();
        return _.isNumber(num) && num === 1;
    }
});

Template.accountStatus.events({
    "click .sign-in": function () {
        var method = "loginWith" + _.capitalize(this.id);
        if (_.isFunction(Meteor[method])) {
            Meteor[method]();
        }
    },
    "click .connect": function () {
        var tmpl = Template.instance();

        function cb () {
            tmpl.connectDep.changed();
        }

        switch (this.id) {
            case "dropbox":
                Meteor.connectWith(Package["gcampax:dropbox-oauth"].DropboxOAuth, cb);
                return;
            default:
                Meteor.connectWith(this.id, cb);
                return;
        }
    }
});

Template.accountStatus.onCreated(function () {
    var self = this;
    self.accountData = new ReactiveVar(null);
    self.loading = new ReactiveVar(true);
    self.connectedProvidersCount = new ReactiveVar(null);

    // Static dependency, all status boxes needs to change.
    // TODO: Move it somewhere else (distur.deps?)
    self.connectDep = (Template.accountStatus.connectDep || (Template.accountStatus.connectDep = new Tracker.Dependency()));

    self.autorun(function () {
        self.connectDep.depend();
        self.accountData.set(null);
        self.loading.set(true);
        var getAD = distUR.call("getAccountData", self.data.id)
            .then(function (result) {
                self.accountData.set(result);
            });
        var userID = Meteor.userId();
        var getNum;
        if (userID) {
            getNum = distUR.call("getNumberOfConnectedProviders", userID)
                .then(function (result) {
                    self.connectedProvidersCount.set(result);
                });
        }
        else {
            getNum = Promise.resolve();
        }
        Promise.all([getAD, getNum])
            .catch(function (err) {
                console.log(err); // TODO: Do something with errors
            })
            .finally(function () {
                self.loading.set(false);
            });
    });
});
