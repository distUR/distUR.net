Router.configure({
    layoutTemplate: "dashboard"
});

Router.route("/", function() {
    this.render("home");
});