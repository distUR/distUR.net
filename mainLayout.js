if (Meteor.isClient) {

    Template.mainLayout.rendered = function () {
        // skider.js

        $.fn.jFlow = function (options) {
            var opts = $.extend({}, $.fn.jFlow.defaults, options);
            var randNum = Math.floor(Math.random() * 11);
            var jFC = opts.controller;
            var jFS = opts.slideWrapper;
            var jSel = opts.selectedWrapper;

            var cur = 0;
            var timer;
            var maxi = $(jFC).length - 1;
            var autoMove = opts.next;
            var displayDuration = 7500;

            // sliding function
            var slide = function (dur, i) {
                $(opts.slides).children().css({
                    overflow: "hidden"
                });
                $(opts.slides + " iframe").hide().addClass("temp_hide");
                $(opts.slides).animate({
                        marginLeft: "-" + (i * $(opts.slides).find(":first-child").width() + "px")
                    },
                    opts.duration * (dur),
                    opts.easing,
                    function () {
                        $(opts.slides).fadeIn('200');
                        $(opts.slides).children().css({
                            overflow: "hidden"
                        });
                        $(".temp_hide").show();
                    }
                );

            }
            $(this).find(jFC).each(function (i) {
                $(this).click(function () {
                    dotimer();
                    if ($(opts.slides).is(":not(:animated)")) {
                        $(jFC).removeClass(jSel);
                        $(this).addClass(jSel);
                        if (opts.direction == 'right') { //direction edit for controller
                            that = maxi - i;
                        } else {
                            that = i;
                        }
                        var dur = Math.abs(cur - that);
                        slide(dur, that);
                        cur = that;
                    }
                });
            });

            $(opts.slides).before('<div id="' + jFS.substring(1, jFS.length) + '"></div>').appendTo(jFS);

            $(opts.slides).find("div").each(function () {
                $(this).before('<div class="jFlowSlideContainer"></div>').appendTo($(this).prev());
            });

            //direction settings
            if (opts.direction == 'right') {
                cur = maxi; //starting from last slide
                autoMove = opts.prev; //changing the auto-scroll direction
                $(opts.slides).children().each(function (e) { //inverting the slide order
                    if (e > 0) {
                        var child = $(this).detach();
                        $(opts.slides).prepend(child);
                    }
                });
            }


            //initialize the controller
            $(jFC).eq(cur).addClass(jSel);

            var resize = function (x) {
                $(jFS).css({
                    position: "relative",
                    width: opts.width,
                    height: opts.height,
                    overflow: "hidden"
                });
                //opts.slides or #mySlides container
                $(opts.slides).css({
                    position: "relative",
                    width: $(jFS).width() * $(jFC).length + "px",
                    height: $(jFS).height() + "px",
                    overflow: "hidden"
                });
                // jFlowSlideContainer
                $(opts.slides).children().css({
                    position: "relative",
                    width: $(jFS).width() + "px",
                    height: $(jFS).height() + "px",
                    "float": "left",
                    overflow: "hidden"
                });

                $(opts.slides).css({
                    marginLeft: "-" + (cur * $(opts.slides).find(":eq(0)").width() + "px")
                });
            }

            // sets initial size
            resize();

            // resets size
            $(window).resize(function () {
                resize();
            });

            $(opts.prev).click(function () {
                dotimer();
                doprev();

            });

            $(opts.next).click(function () {
                dotimer();
                donext();

            });

            var doprev = function (x) {
                if ($(opts.slides).is(":not(:animated)")) {
                    var dur = 1;
                    if (cur > 0)
                        cur--;
                    else {
                        cur = maxi;
                        dur = cur;
                    }
                    $(jFC).removeClass(jSel);
                    slide(dur, cur);
                    $(jFC).eq(cur).addClass(jSel);
                }
            }

            var donext = function (x) {
                if ($(opts.slides).is(":not(:animated)")) {
                    var dur = 1;
                    if (cur < maxi)
                        cur++;
                    else {
                        cur = 0;
                        dur = maxi;
                    }
                    $(jFC).removeClass(jSel);
                    //$(jFS).fadeOut("fast");
                    slide(dur, cur);
                    //$(jFS).fadeIn("fast");
                    $(jFC).eq(cur).addClass(jSel);
                }
            }

            var dotimer = function (x) {
                if ((opts.auto) == true) {
                    if (timer != null)
                        clearInterval(timer);

                    timer = setInterval(function () {
                        $(autoMove).click();
                    }, displayDuration);
                }
            }

            dotimer();
        };

        $.fn.jFlow.defaults = {
            controller: ".jFlowControl", // must be class, use . sign
            slideWrapper: "#jFlowSlide", // must be id, use # sign
            selectedWrapper: "jFlowSelected",  // just pure text, no sign
            auto: false,
            direction: 'left', //'left' (default) or 'right'
            easing: "swing",
            duration: 400,
            width: "100%",
            prev: ".jFlowPrev", // must be class, use . sign
            next: ".jFlowNext" // must be class, use . sign
        };

// superfish.js

        $.fn.superfish = function (op) {

            var sf = $.fn.superfish,
                c = sf.c,
                $arrow = $(['<span class="', c.arrowClass, '"> &#187;</span>'].join('')),
                over = function () {
                    var $$ = $(this), menu = getMenu($$);
                    clearTimeout(menu.sfTimer);
                    $$.showSuperfishUl().siblings().hideSuperfishUl();
                },
                out = function () {
                    var $$ = $(this), menu = getMenu($$), o = sf.op;
                    clearTimeout(menu.sfTimer);
                    menu.sfTimer = setTimeout(function () {
                        o.retainPath = ($.inArray($$[0], o.$path) > -1);
                        $$.hideSuperfishUl();
                        if (o.$path.length && $$.parents(['li.', o.hoverClass].join('')).length < 1) {over.call(o.$path);}
                    }, o.delay);
                },
                getMenu = function ($menu) {
                    var menu = $menu.parents(['ul.', c.menuClass, ':first'].join(''))[0];
                    sf.op = sf.o[menu.serial];
                    return menu;
                },
                addArrow = function ($a) { $a.addClass(c.anchorClass).append($arrow.clone()); };

            return this.each(function () {
                var s = this.serial = sf.o.length;
                var o = $.extend({}, sf.defaults, op);
                o.$path = $('li.' + o.pathClass, this).slice(0, o.pathLevels).each(function () {
                    $(this).addClass([o.hoverClass, c.bcClass].join(' '))
                        .filter('li:has(ul)').removeClass(o.pathClass);
                });
                sf.o[s] = sf.op = o;

                $('li:has(ul)', this)[($.fn.hoverIntent && !o.disableHI) ? 'hoverIntent' : 'hover'](over, out).each(function () {
                    if (o.autoArrows) addArrow($('>a:first-child', this));
                })
                    .not('.' + c.bcClass)
                    .hideSuperfishUl();

                var $a = $('a', this);
                $a.each(function (i) {
                    var $li = $a.eq(i).parents('li');
                    $a.eq(i).focus(function () {over.call($li);}).blur(function () {out.call($li);});
                });
                o.onInit.call(this);

            }).each(function () {
                var menuClasses = [c.menuClass];
                $(this).addClass(menuClasses.join(' '));
            });
        };

        var sf = $.fn.superfish;
        sf.o = [];
        sf.op = {};
        sf.c = {
            bcClass: 'sf-breadcrumb',
            menuClass: 'sf-js-enabled',
            anchorClass: 'sf-with-ul',
            arrowClass: 'sf-sub-indicator',
            shadowClass: 'sf-shadow'
        };
        sf.defaults = {
            hoverClass: 'sfHover',
            pathClass: 'overideThisToUse',
            pathLevels: 1,
            delay: 800,
            animation: { opacity: 'show' },
            speed: 'normal',
            autoArrows: true,
            dropShadows: true,
            disableHI: false,		// true disables hoverIntent detection
            onInit: function () {}, // callback functions
            onBeforeShow: function () {},
            onShow: function () {},
            onHide: function () {}
        };

        $.fn.extend({
            hideSuperfishUl: function () {
                var o = sf.op,
                    not = (o.retainPath === true) ? o.$path : '';
                o.retainPath = false;
                var $ul = $(['li.', o.hoverClass].join(''), this).add(this).not(not).removeClass(o.hoverClass)
                    .find('>ul').hide().css('visibility', 'hidden');
                o.onHide.call($ul);
                return this;
            },
            showSuperfishUl: function () {
                var o = sf.op,
                    sh = sf.c.shadowClass + '-off',
                    $ul = this.addClass(o.hoverClass)
                        .find('>ul:hidden').css('visibility', 'visible');
                o.onBeforeShow.call($ul);
                $ul.animate(o.animation, o.speed, function () {
                    o.onShow.call($ul);
                });
                return this;
            }
        });

// custom.js

        if ($("#slides-container").length > 0) {
            $("#myController").jFlow({
                slides: "#slides",
                controller: ".jFlowControl", // must be class, use . sign
                slideWrapper: "#jFlowSlide", // must be id, use # sign
                selectedWrapper: "jFlowSelected",  // just pure text, no sign
                easing: "swing",
                width: "auto",
                auto: true, // set to false to disable auto-slide
                height: "315px",
                duration: 600,
                prev: ".jFlowPrev", // must be class, use . sign
                next: ".jFlowNext" // must be class, use . sign
            });
        }

        $('ul.dropdown').superfish({
            autoArrows: true
        });
    }

}