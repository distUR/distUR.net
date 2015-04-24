"use strict";

/* global Template,_,Router,distUR */

Template.dashboardHeading.helpers({
    title: function() {
        var cr = Router.current();
        var route = cr.data();
        var mainRoute, subRoute;
        if (route.parent) {
            mainRoute = route.parent;
            subRoute = route;
        }
        else {
            mainRoute = route;
            subRoute = null;
        }
        var result = {
            main: "",
            sub: ""
        };
        if (mainRoute) {
            result.main = mainRoute.title;
            if (subRoute) {
                result.sub = subRoute.title;
            }
        }
        return result;
    }
});
