if (Meteor.isClient) {

    Template.body.events({
        "click .c-gh": function () {
            if (Meteor.user()) {
                Meteor.connectWith("github");
            }
        },
        "click .c-db": function () {
            if (Meteor.user()) {
                Meteor.connectWith(Package["gcampax:dropbox-oauth"]["DropboxOAuth"]);
            }
        }
    });

    // counter starts at 0
    Session.setDefault("counter", 0);

    Template.hello.helpers({
        counter: function () {
            return Session.get("counter");
        }
    });

    Template.hello.events({
        "click button": function () {
            // increment the counter when button is clicked
            Session.set("counter", Session.get("counter") + 1);
        }
    });

    Meteor.connectWith = function (service, options, callback) {
        // Support a callback without options
        if (!callback && typeof options === "function") {
            callback = options;
            options = null;
        }
        var connectCredentialRequestCompleteCallback = Accounts.oauth.connectCredentialRequestCompleteHandler(callback);
        var Service = typeof service === "string" ? Package[service][makePascalCased(service)] : service;
        Service.requestCredential(options, connectCredentialRequestCompleteCallback);
    };
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        // code to run on server at startup
    });
}
