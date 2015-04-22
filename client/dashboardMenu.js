Template.dashboardMenu.helpers({
    routes: function() {
        return distUR.DashboardRoutes;
    },
    activeClass: function(route) {
        var cr = Router.current();
        var url = cr.url;
        if (url.startsWith("http://") || url.startsWith("https://")) {
            url = "/";
        }
        return url === route.path ? "active" : "";
    }
});