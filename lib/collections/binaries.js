"use strict";

/* global distUR,Mongo,Meteor,SimpleSchema,_ */

distUR.schemas.Binaries = new SimpleSchema({
    userID: {
        type: String,
        optional: false
    },
    createdAt: {
        type: Date,
        optional: false
    },
    package: {
        type: new SimpleSchema({
            name: {
                type: String,
                optional: false
            },
            version: {
                type: String,
                optional: false
            }
        }),
        optional: false
    },
    os: {
        type: new SimpleSchema({
            arch: {
                type: String,
                optional: false
            },
            platform: {
                type: String,
                optional: false
            },
            release: {
                type: String,
                optional: false
            }
        }),
        optional: false
    },
    runtime: {
        type: new SimpleSchema({
            name: {
                type: String,
                optional: false
            },
            version: {
                type: String,
                optional: false
            }
        }),
        optional: false
    },
    storage: {
        type: new SimpleSchema({
            provider: {
                type: String,
                optional: false
            },
            id: {
                type: String,
                optional: false
            },
            rootPath: {
                type: String,
                optional: false
            }
        }),
        optional: false
    },
    files: {
        type: [String],
        optional: false
    }
});

distUR.collections.Binaries = new Mongo.Collection("binaries");
distUR.collections.Binaries.attachSchema(distUR.schemas.Binaries);