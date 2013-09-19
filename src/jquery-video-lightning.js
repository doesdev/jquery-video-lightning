(function($, window, document, undefined) {

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
            glow_color: "#fff"
        };

    function JQVideoLightning ( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    JQVideoLightning.prototype = {
        init: function () {
            var target, target_wrapper;
            target = $(this.element);
            target_wrapper = target.wrap("<span class='video-target'></span>").parent(".video-target");
            target_wrapper.css( "cursor", "pointer" );

            function callPlayer() {
                $(this.player(target, target_wrapper, $(this).settings));
            }

            target_wrapper.on( "click", $.proxy(callPlayer, this));
        },

        player: function ( target, target_wrapper, settings ) {
            var id, video_autohide, video_autoplay, video_byline, video_color, video_controls, video_height, video_id, video_iv_load_policy, video_loop, video_modestbranding, video_playlist, video_portrait, video_related, video_showinfo, video_start_time, video_theme, video_vendor, video_width, vimeo_player, youtube_player, ease_in, glow, glow_color, backdrop_color, backdrop_opacity, red, green, blue, effect_in, display_ratio;

            function colorConverter(hex){
                red = parseInt((prepHex(hex)).substring(0,2),16);
                blue = parseInt((prepHex(hex)).substring(2,4),16);
                green = parseInt((prepHex(hex)).substring(4,6),16);
                return {
                    red: red,
                    blue: blue,
                    green: green
                };
            }

            function fullHex(hex){
                hex = "#" + prepHex(hex);
                return hex;
            }

            function prepHex(hex){
                hex = (hex.charAt(0)=="#") ? hex.split("#")[1]:hex;
                if (hex.length == 3){
                    hex = hex + hex;
                }
                return hex;
            }

            settings = this.settings;

            if (target_wrapper.find(".video-wrapper").is(':visible')) {
                target_wrapper.find(".video").remove();
                target_wrapper.find(".video-wrapper").hide((settings.easeOut));
                target_wrapper.find(".video-wrapper").remove();
                return $(this).destroy;
            } else {
                id = (typeof target.data("videoId") === 'undefined') ? settings.id : target.data("videoId");
                video_vendor = id.split("-")[0];
                if ((video_vendor === "v") || (video_vendor === "V")) {
                    video_vendor = "Vimeo";
                } else {
                    video_vendor = "Youtube";
                }
                video_id = id.split("-")[1]; // Youtube: "y-XbTtgr8J8uU" Vimeo: "v-32187194"
                video_width = target.data("videoWidth") || settings.width; // Y&V: video width in px
                video_height = target.data("videoHeight") || settings.height; // Y&V: video height in px
                display_ratio = parseInt(video_height) / parseInt(video_width);
                if (parseInt(video_width) > $(document).width() - 20) {
                    video_width = $(document).width() - 20 + "px";
                    video_height = display_ratio * parseInt(video_width) + "px";
                }
                video_autoplay = target.data("videoAutoplay") || settings.autoplay; // Y&V: start playback immediately (0,1)
                video_autohide = target.data("videoAutohide") || settings.autohide; // Y: auto hide controls after video load (0,1,2)
                video_controls = target.data("videoControls") || settings.controls; // Y: display controls (0,1,2)
                video_iv_load_policy = target.data("videoIvLoadPolicy") || settings.iv_load_policy; // Y: display annotations (1,3)
                video_loop = target.data("videoLoop") || settings.loop; // Y&V: loop video playback (0,1)
                video_modestbranding = target.data("videoModestbranding") || settings.modestbranding; // Y: hide large Youtube logo (0,1)
                video_playlist = target.data("videoPlaylist") || settings.playlist; // Y: comma-separated list of video IDs to play
                video_related = target.data("videoRelated") || settings.related; // Y: show related videos when playback id finished (0,1)
                video_showinfo = target.data("videoShowinfo") || settings.showinfo; // Y: display title, uploader (0,1)  V: display title (0,1)
                video_start_time = target.data("videoStartTime") || settings.start_time; // Y: playback start position in seconds (ex. "132" starts at 2mins, 12secs)
                video_theme = target.data("videoTheme") || settings.theme; // Y: player theme ("dark","light")
                if (video_vendor == "Vimeo"){
                    video_color = target.data("videoColor") || prepHex(settings.color); // V: player controls color (hex code minus the "#", default is "00adef")
                } else {
                    video_color = target.data("videoColor") || settings.color; // Y: player controls color ("red","white")
                }
                video_byline = target.data("videoByline") || settings.byline; // V: display byline (0,1)
                video_portrait = target.data("videoPortrait") || settings.portrait; // V: display user's portrait (0,1)
                youtube_player = $("<iframe src=\"https://www.youtube.com/embed/" + video_id + "?autoplay=" + video_autoplay + "&autohide=" + video_autohide + "&controls=" + video_controls + "&iv_load_policy=" + video_iv_load_policy + "&loop=" + video_loop + "&modestbranding=" + video_modestbranding + "&playlist=" + video_playlist + "&rel=" + video_related + "&showinfo=" + video_showinfo + "&start=" + video_start_time + "&theme=" + video_theme + "&color=" + video_color + "\" width=\"" + video_width + "\" height=\"" + video_height + "\" frameborder=\"0\" allowfullscreen></iframe>");
                vimeo_player = $("<iframe src=\"http://player.vimeo.com/video/" + video_id + "?autoplay=" + video_autoplay + "&loop=" + video_loop + "&title=" + video_showinfo + "&byline=" + video_byline + "&portrait=" + video_portrait + "&color=" + video_color + "\" width=\"" + video_width + "\" height=\"" + video_height + "\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
                effect_in = settings.effect_in;
                ease_in = settings.ease_in;
                glow = settings.glow;
                glow_color = settings.glow_color;
                backdrop_color = settings.backdrop_color;
                backdrop_opacity = settings.backdrop_opacity;

                target_wrapper.append('<div class="video-wrapper"><div class="video-frame"><div class="video"></div></div></div>');
                target_wrapper.find(".video-wrapper").css({
                    backgroundColor: "rgba(" + colorConverter(backdrop_color).red + "," + colorConverter(backdrop_color).blue + "," + colorConverter(backdrop_color).green + "," + backdrop_opacity + ")"
                });
                target_wrapper.find(".video-frame").css({
                    width:  video_width,
                    height: video_height,
                    marginTop: '-' + ((video_height.split("p")[0])/2) + 'px',
                    marginLeft: '-' + ((video_width.split("p")[0])/2) + 'px',
                    boxShadow: '0px 0px ' + glow + 'px ' + (glow/5) + 'px ' + fullHex(glow_color)
                });
                target_wrapper.find(".video-wrapper")[effect_in](ease_in);
                if (video_vendor === "Vimeo") {
                    return target_wrapper.find(".video").append(vimeo_player);
                } else {
                    return target_wrapper.find(".video").append(youtube_player);
                }
            }
        },

        destroy: function () {
            $(this).off();
            $(this).removeData();
        }
    };

    $.fn[ pluginName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + pluginName ) ) {
                $.data( this, "plugin_" + pluginName, new JQVideoLightning( this, options ) );
            }
        });
    };

    return this;

})( jQuery, window, document );