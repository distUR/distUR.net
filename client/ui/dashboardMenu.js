Template.dashboardMenu.helpers({
    routes: function() {
        return distUR.DashboardRoutes;
    },
    activeClass: function() {
        var cr = Router.current();
        var url = cr.url;
        if (!url.startsWith("/")) {
            url = "/";
        }
        return url === this.path ? "active" : "";
    }
});