"use strict";

/* global Meteor,check,distUR,HTTP,Mongo,Async,_ */

var jwt = Meteor.npmRequire("jsonwebtoken");
var jwtVerify = Async.wrap(jwt, "verify");

Meteor.methods({
    loginWithGithubAccount: function (username, password) {
        check(username, String);
        check(password, String);
        function notFounError() {
            throw new Meteor.Error("not-found", "Github User Not Found", "Github user " + username + " is not registered in distUR.net service. Please go to https://distUR.net, and register your account.");
        }
        var user = Meteor.users.findOne({ "services.github.username": username }, { _id: 1, "services.github.id": 1 });
        if (!user) {
            notFounError();
        }
        try {
            var result = HTTP.get("https://api.github.com/user", {
                auth: username + ":" + password,
                headers: {
                    "User-Agent": "distUR.net DEV"
                }
            });
            if (result.data.id !== user.services.github.id) {
                notFounError();
            }
            this.setUserId(user._id);
            return jwt.sign(user._id, process.env.TOKEN_SECRET || "distUR.net Debug");
        }
        catch (e) {
            console.log("Github login error: ", e.stack); // TODO: Log
            if (e.response && (e.response.statusCode === 401 || e.response.statusCode === 404)) {
                throw new Meteor.Error("unauthenticated", "Invalid Github Credentials", "Authentication failed, please review your Github credentials.");
            }
            else {
                throw new Meteor.Error("github-error", "Unknown Github Authentication Error", "Authentication failed bacause of an unknown Gihub error. Please retry later.");
            }
        }
    },
    distUrLogin: function (token) {
        check(token, String);
        try {
            var _id = jwtVerify(token, process.env.TOKEN_SECRET || "distUR.net Debug");
            if (_.isString(_id) && Meteor.users.findOne({ _id: _id}, { _id: 1 })) {
                this.setUserId(_id);
                return;
            }
        }
        catch (e) {
            console.log(e.stack); // TODO: Log
        }
        throw new Meteor.Error("unauthenticated", "Invalid Token");
    }
});
