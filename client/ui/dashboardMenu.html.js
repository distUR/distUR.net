"use strict";

/* global Template,_,Router,distUR,ReactiveVar */

Template.dashboardMenu.helpers({
    routes: function() {
        return Template.instance().visibleRoutes.get();
    },
    activeClass: function() {
        var cr = Router.current();
        var route = cr.data();
        return route.path === this.path ? "active" : "";
    }
});

Template.dashboardMenu.onCreated(function() {
    var self = this;
    self.visibleRoutes = new ReactiveVar([]);
    self.autorun(function() {
        self.visibleRoutes.set(distUR.DashboardRoutes); // TODO: filter by role
    });
});