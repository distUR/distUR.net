"use strict";

/* global distUR,Router */

distUR.DashboardRoutes = [
    {
        path: "/",
        template: "dashboard",
        icon: "fa fa-fw fa-dashboard",
        title: "Dashboard",
        nav: true
    },
    {
        path: "/accounts",
        template: "accounts",
        icon: "fa fa-fw fa-user-plus",
        title: "Accounts",
        nav: true,
        items: [
            {
                path: "/accounts/github",
                template: "github",
                icon: "fa fa-fw fa-github",
                title: "Github",
                nav: true
            },
            {
                path: "/accounts/dropbox",
                template: "dropbox",
                icon: "fa fa-fw fa-dropbox",
                title: "Dropbox",
                nav: true
            }
        ]
    }
];

Router.configure({
    layoutTemplate: "dashboardLayout"
});

distUR.DashboardRoutes.forEach(function (route) {
    Router.route(route.path, {
        action: function () {
            this.render(route.template);
        },
        data: function () {
            return route;
        }
    });
    if (route.items) {
        route.items.forEach(function (subRoute) {
            subRoute.parent = route;
            Router.route(subRoute.path, {
                action: function () {
                    this.render(subRoute.template);
                },
                data: function () {
                    return subRoute;
                }
            });
        });
    }
});