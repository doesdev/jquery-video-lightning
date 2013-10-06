(function ($, window, document) {

    var pluginName = "jqueryVideoLightning",
        defaults = {
            id: "y-dQw4w9WgXcQ",
            width: "640px",
            height: "390px",
            autoplay: 0,
            autohide: 2,
            controls: 1,
            iv_load_policy: 1,
            loop: 0,
            modestbranding: 0,
            playlist: "",
            related: 0,
            showinfo: 1,
            start_time: 0,
            theme: "dark",
            color: "",
            byline: 1,
            portrait: 1,
            effect_in: "fadeIn",
            ease_in: 300,
            ease_out: 0,
            backdrop_color: "#000",
            backdrop_opacity: 1,
            glow: 0,
            glow_color: "#fff",
            rick_roll: 0,
            cover: 0
        };

    function JQVideoLightning(element, options) {
        this.element = element;
        this.base_settings = $.extend({}, defaults, options);
        this.init();
    }

    JQVideoLightning.prototype = {
        init: function () {
            var target_wrapper, settings, video_id, vendor;
            target_wrapper = $(this.element).wrap("<span class='video-target'></span>").parent(".video-target");
            target_wrapper.css("cursor", "pointer");
            settings = this.settings();
            video_id = settings.videoId.substring(2);
            vendor = (settings.videoId.charAt(0).toLowerCase() === "v") ? "vimeo" : "youtube";
            if ($("style:contains('.video-wrapper')").length < 1) {
                $("<style type='text/css'>" +
                    ".video-wrapper{ " +
                    "display: none; " +
                    "position: fixed; " +
                    "min-width: 100%; " +
                    "min-height: 100%; " +
                    "top: 0; " +
                    "bottom: 0; " +
                    "left: 0; " +
                    "z-index: 21000; " +
                    "} </style>").appendTo("head");
            }

            if (settings.videoCover === 1) {
                this.coverImage(vendor, video_id, target_wrapper);
            }

            function callPlayer() {
                $(this.player(target_wrapper, video_id, vendor));
            }

            target_wrapper.on("click", $.proxy(callPlayer, this));
        },

        player: function (target_wrapper, video_id, vendor) {
            var settings;
            settings = this.settings();

            if (target_wrapper.find(".video-wrapper").is(':visible')) {
                if (settings.videoRickRoll !== 1) {
                    return this.destroy(target_wrapper);
                }
                return;
            }

            target_wrapper.append('<div class="video-wrapper"><div class="video-frame"><div class="video"></div></div></div>');
            target_wrapper.find(".video-wrapper").css({
                backgroundColor: "rgba(" + this.colorConverter(settings.videoBackdropColor).red + "," + this.colorConverter(settings.videoBackdropColor).blue + "," + this.colorConverter(settings.videoBackdropColor).green + "," + settings.videoBackdropOpacity + ")"
            });
            target_wrapper.find(".video-frame").css({
                position: 'absolute',
                top: '50%',
                left: '50%',
                width:  settings.videoWidth,
                height: settings.videoHeight,
                marginTop: '-' + (settings.videoHeight / 2) + 'px',
                marginLeft: '-' + (settings.videoWidth / 2) + 'px',
                boxShadow: '0px 0px ' + settings.videoGlow + 'px ' + (settings.videoGlow / 5) + 'px ' + this.fullHex(settings.videoGlowColor)
            });
            target_wrapper.find(".video-wrapper")[settings.videoEffectIn](settings.videoEaseIn);

            return target_wrapper.find(".video").append(this[vendor + "Player"](settings, video_id));
        },

        settings: function () {
            var target, settings, setting_key, display_ratio;
            target = $(this.element);
            settings = this.base_settings;

            function remapSettings(settings) {
                $.each(settings,
                    $.proxy(function (key, value) {
                        setting_key = "video" +
                            key.toLowerCase().charAt(0).toUpperCase() +
                            key.slice(1).replace(/_([a-z])/g, function (m, w) {
                                return w.toUpperCase();
                            });
                        $(this).data(setting_key, value);
                    }, this)
                );
                return $(this).data();
            }

            settings = target.extend({}, remapSettings(settings), target.data());

            settings.videoWidth = parseInt(settings.videoWidth, 10);
            settings.videoHeight = parseInt(settings.videoHeight, 10);
            display_ratio = settings.videoHeight / settings.videoWidth;

            if (settings.videoWidth > $(document).width() - 30) {
                settings.videoWidth = $(document).width() - 30;
                settings.videoHeight = display_ratio * settings.videoWidth;
            }

            return settings;
        },

        colorConverter: function (hex) {
            var  red, green, blue;

            red = parseInt((this.prepHex(hex)).substring(0, 2), 16);
            blue = parseInt((this.prepHex(hex)).substring(2, 4), 16);
            green = parseInt((this.prepHex(hex)).substring(4, 6), 16);
            return {
                red: red,
                blue: blue,
                green: green
            };
        },

        prepHex: function (hex) {
            hex = (hex.charAt(0) === "#") ? hex.split("#")[1] : hex;
            if (hex.length === 3) {
                hex = hex + hex;
            }
            return hex;
        },

        fullHex: function (hex) {
            hex = "#" + this.prepHex(hex);
            return hex;
        },

        coverImage: function (vendor, video_id, target_wrapper) {
            var vimeo_api_url, youtube_img_url;
            vimeo_api_url = 'http://www.vimeo.com/api/v2/video/' + video_id + '.json?callback=?';
            youtube_img_url = 'http://img.youtube.com/vi/' + video_id + '/hqdefault.jpg';

            if (vendor === "youtube") {
                $("<img class='video-cover'>").attr("src", youtube_img_url).appendTo(target_wrapper);
            } else {
                $.getJSON(vimeo_api_url, {format: "jsonp"})
                    .done(function (data) {
                        $("<img class='video-cover'>").attr("src", data[0].thumbnail_large).appendTo(target_wrapper);
                    });
            }
        },

        youtubePlayer: function (settings, video_id) {
            return $("<iframe src=\"https://www.youtube.com/embed/" + video_id +
                "?autoplay=" + settings.videoAutoplay +
                "&autohide=" + settings.videoAutohide +
                "&controls=" + settings.videoControls +
                "&iv_load_policy=" + settings.videoIvLoadPolicy +
                "&loop=" + settings.videoLoop +
                "&modestbranding=" + settings.videoModestbranding +
                "&playlist=" + settings.videoPlaylist +
                "&rel=" + settings.videoRelated +
                "&showinfo=" + settings.videoShowinfo +
                "&start=" + settings.videoStartTime +
                "&theme=" + settings.videoTheme +
                "&color=" + settings.videoColor +
                "\" width=\"" + settings.videoWidth +
                "\"px height=\"" + settings.videoHeight +
                "\"px frameborder=\"0\" allowfullscreen></iframe>");
        },

        vimeoPlayer: function (settings, video_id) {
            return $("<iframe src=\"http://player.vimeo.com/video/" + video_id +
                "?autoplay=" + settings.videoAutoplay +
                "&loop=" + settings.videoLoop +
                "&title=" + settings.videoShowinfo +
                "&byline=" + settings.videoByline +
                "&portrait=" + settings.videoPortrait +
                "&color=" + this.prepHex(settings.videoColor) +
                "\" width=\"" + settings.videoWidth +
                "\"px height=\"" + settings.videoHeight +
                "\"px frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
        },

        destroy: function (target_wrapper) {
            target_wrapper.find(".video").remove();
            target_wrapper.find(".video-wrapper").hide((this.settings().videoEaseOut));
            target_wrapper.find(".video-wrapper").remove();
            $(this).off();
            $(this).removeData();
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new JQVideoLightning(this, options));
            }
        });
    };

    return this;

})(jQuery, window, document);