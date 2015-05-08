"use strict";

/* global Meteor,Package,Accounts,Promise,distUR */

distUR.call = Promise.promisify(Meteor.call, Meteor);