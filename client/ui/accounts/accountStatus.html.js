"use strict";

/* global Template,_,Meteor,ReactiveVar,distUR,Package,Tracker */

Template.accountStatus.helpers({
    title: function() {
        return _.capitalize(this.id);
    },
    icon: function() {
        return "fa-" + this.id;
    },
    class: function() {
        return Template.instance().accountData.get() ? "primary" : "default";
    },
    accountData: function() {
        return Template.instance().accountData.get();
    },
    loading: function() {
        return Template.instance().loading.get();
    },
    link: function() {
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
    }
});

Template.accountStatus.events({
    "click .sign-in": function() {
        var method = "loginWith" + _.capitalize(this.id);
        if (_.isFunction(Meteor[method])) {
            Meteor[method]();
        }
    },
    "click .connect": function() {
        var tmpl = Template.instance();
        function cb() {
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

Template.accountStatus.onCreated(function() {
    var self = this;
    self.accountData = new ReactiveVar(null);
    self.loading = new ReactiveVar(true);
    self.connectDep = new Tracker.Dependency();
    self.autorun(function() {
        self.connectDep.depend();
        self.accountData.set(null);
        self.loading.set(true);
        distUR.call("getAccountData", self.data.id)
            .then(function(result) {
                self.accountData.set(result);
            },
            function(err) {
                console.log(err); // TODO: Do something with errors
            })
            .finally(function() {
                self.loading.set(false);
            });
    });
});
