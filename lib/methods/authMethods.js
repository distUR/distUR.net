"use strict";

/* global Meteor,check,distUR,HTTP,EJSON,Mongo */

var jwt = Meteor.npmRequire("jsonwebtoken");

Meteor.methods({
    loginWithGithubAccount: function (username, password) {
        check(username, String);
        check(password, String);
        this.unblock();
        function notFounError() {
            throw new Meteor.Error("not-found", "Github User Not Found", "Github user " + username + "is not registered in distUR.net service. Please go to https://distUR.net, and register your account.");
        }
        var user = Meteor.users.findOne({ "services.github.username": username }, { _id: 1, "services.github.id": 1 });
        if (!user) {
            notFounError();
        }
        try {
            var result = HTTP.get("https://api.github.com/user", {
                auth: username + ":" + password
            });
            if (result.id !== user.services.github.id) {
                notFounError();
            }
            this.setUserId(user._id);
            // TODO: Return jwt token (with user's _id in it)
        }
        catch (e) {
            if (e.response && e.response.statusCode === 401) {
                throw new Meteor.Error("unauthorized", "Invalid Github Credentials", "Authentication failed, please review your Github credentials.");
            }
            else {
                throw new Meteor.Error("github-error", "Unknown Github Authentication Error", "Authentication failed bacause of an unknown Gihub error. Please retry later.");
            }
        }
    },
    distUrLogin: function (token) {
    }
});
