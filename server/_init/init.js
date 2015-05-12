"use strict";

/* global distUR,Meteor */

distUR.errors = {
    unauthorized: new Meteor.Error(403, "Unauthorized."),
    providerNotFound: function(providerName) {
        return new Meteor.Error("not-found", "Provider Not Found", "User ha no connection to storage provider: " + providerName);
    }
};