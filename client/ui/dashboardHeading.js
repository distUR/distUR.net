Template.dashboardHeading.helpers({
    title: function() {
        var cr = Router.current();
        var url = cr.url;
        if (!url.startsWith("/")) {
            url = "/";
        }
        var parts = url.substr(1).split("/");
        var main = "/" + parts[0];
        var isSub = !!parts[1];
        var mainRoute = _.first(_.where(distUR.DashboardRoutes, {path: main}));
        var result = {
            main: "",
            sub: ""
        };
        if (mainRoute) {
            result.main = mainRoute.title;
            if (isSub) {
                var subRoute = _.first(_.where(mainRoute.items, {path: url}));
                if (subRoute) {
                    result.sub = subRoute.title;
                }
            }
        }
        return result;
    }
});
