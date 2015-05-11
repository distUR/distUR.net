"use strict";

/* global distUR,Mongo,Meteor,SimpleSchema,_ */

var BaseAccountInfo = {
    updatedAt: {
        type: Date,
        optional: false
    }
};

var makeAccountInfoSchema = function (def) {
    return new SimpleSchema(_.extend(def, BaseAccountInfo));
};

distUR.schemas.DropboxAccountInfo = makeAccountInfoSchema({
    name: {
        type: String,
        optional: false
    },
    uid: {
        type: Number,
        optional: false
    },
    countryCode: {
        type: String,
        optional: true
    },
    email: {
        type: String,
        optional: false
    },
    publicAppUrl: {
        type: String,
        optional: true
    },
    quota: {
        type: Number,
        optional: false
    },
    usedQuota: {
        type: Number,
        optional: false
    },
    privateBytes: {
        type: Number,
        optional: false
    },
    sharedBytes: {
        type: Number,
        optional: false
    }
});

distUR.schemas.AccountInfo = new SimpleSchema({
    dropbox: {
        type: distUR.schemas.DropboxAccountInfo,
        optional: true
    }
});

distUR.collections.AccountInfo = new Mongo.Collection("accountInfo");
distUR.collections.AccountInfo.attachSchema(distUR.schemas.AccountInfo);