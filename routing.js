distUR.DashboardRoutes = [
    {
        path: "/",
        template: "dashboard",
        icon: "fa fa-fw fa-dashboard",
        title: "Dashboard",
        nav: true
    },
    {
        path: "/test",
        template: "test",
        icon: "fa fa-fw fa-file",
        title: "Test",
        nav: true,
        items: [
            {
                path: "/test/test01",
                template: "test01",
                icon: "fa fa-fw fa-table",
                title: "Test 01",
                nav: true
            },
            {
                path: "/test/test02",
                template: "test02",
                icon: "fa fa-fw fa-bar-chart-o",
                title: "Test 02",
                nav: true
            }
        ]
    }
];

Router.configure({
    layoutTemplate: "dashboardLayout"
});

distUR.DashboardRoutes.forEach(function(route) {
    Router.route(route.path, function() {
        this.render(route.template);
    });
    if (route.items) {
        route.items.forEach(function(subRoute) {
            Router.route(subRoute.path, function() {
                this.render(subRoute.template);
            });
        });
    }
});