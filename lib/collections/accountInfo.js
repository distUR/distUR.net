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
    "display_name": {
        type: String,
        optional: false
    },
    "uid": {
        type: Number,
        optional: false
    },
    "locale": {
        type: String,
        optional: true
    },
    "team": {
        type: Object,
        optional: true,
        blackbox: true
    },
    "quota_info": {
        type: new SimpleSchema({
            "datastores": {
                type: Number,
                optional: false
            },
            "shared": {
                type: Number,
                optional: false
            },
            "quota": {
                type: Number,
                optional: false
            },
            "normal": {
                type: Number,
                optional: false
            }
        }),
        optional: false
    },
    "country": {
        type: String,
        optional: true
    },
    "name_details": {
        type: new SimpleSchema({
            "familiar_name": {
                type: String,
                optional: true
            },
            "surname": {
                type: String,
                optional: true
            },
            "given_name": {
                type: String,
                optional: true
            }
        }),
        optional: true
    },
    "email": {
        type: String,
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