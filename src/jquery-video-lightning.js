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
            effectIn: "fadeIn",
            easeIn: 300,
            easeOut: 0,
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
            var void_target, void_elements, target, target_class;
            void_elements = [ "AREA", "BASE", "BR", "COL", "COMMAND", "EMBED", "HR", "IMG", "INPUT", "KEYGEN", "LINK", "META", "PARAM", "SOURCE", "TRACK", "WBR" ];
            void_target = 0;
            target_class = ".video-target";

            $(this.element).css( "cursor", "pointer" );

            if (($.inArray($(this.element).prop('tagName'), void_elements)) == -1) {
                target = $(this.element);
                target.addClass("video-target");
            }
            else {
                $("body").append('<div class="video-target">' + '</div>');
                target = $(target_class);
                void_target = 1;
            }

            function callPlayer() {
                $(this.player(target, $(this).settings), void_target);
            }

            $(this.element).on( "click", $.proxy(callPlayer, this));
        },

        player: function ( target, settings, void_target ) {
            var id, video_autohide, video_autoplay, video_byline, video_color, video_controls, video_height, video_id, video_iv_load_policy, video_loop, video_modestbranding, video_playlist, video_portrait, video_related, video_showinfo, video_start_time, video_theme, video_vendor, video_width, vimeo_player, youtube_player, ease_in, glow, glow_color, backdrop_color, backdrop_opacity, red, green, blue;

            if (target.find(".video-wrapper").is(':visible')) {
                target.find(".video").remove();
                target.find(".video-wrapper").hide(((this.settings).easeOut));
                target.find(".video-wrapper").remove();
                if (void_target == 1){target.remove()}
                return $(this).destroy;
            } else {
                id = (typeof target.data("videoId") === 'undefined') ? (this.settings).id : target.data("videoId");
                video_vendor = id.split("-")[0];
                if ((video_vendor === "v") || (video_vendor === "V")) {
                    video_vendor = "Vimeo";
                } else {
                    video_vendor = "Youtube";
                }
                video_id = id.split("-")[1]; // Youtube: "y-XbTtgr8J8uU" Vimeo: "v-32187194"
                video_width = target.data("videoWidth") || (this.settings).width; // Y&V: video width in px
                video_height = target.data("videoHeight") || (this.settings).height; // Y&V: video height in px
                video_autoplay = target.data("videoAutoplay") || (this.settings).autoplay; // Y&V: start playback immediately (0,1)
                video_autohide = target.data("videoAutohide") || (this.settings).autohide; // Y: auto hide controls after video load (0,1,2)
                video_controls = target.data("videoControls") || (this.settings).controls; // Y: display controls (0,1,2)
                video_iv_load_policy = target.data("videoIvLoadPolicy") || (this.settings).iv_load_policy; // Y: display annotations (1,3)
                video_loop = target.data("videoLoop") || (this.settings).loop; // Y&V: loop video playback (0,1)
                video_modestbranding = target.data("videoModestbranding") || (this.settings).modestbranding; // Y: hide large Youtube logo (0,1)
                video_playlist = target.data("videoPlaylist") || (this.settings).playlist; // Y: comma-separated list of video IDs to play
                video_related = target.data("videoRelated") || (this.settings).related; // Y: show related videos when playback id finished (0,1)
                video_showinfo = target.data("videoShowinfo") || (this.settings).showinfo; // Y: display title, uploader (0,1)  V: display title (0,1)
                video_start_time = target.data("videoStartTime") || (this.settings).start_time; // Y: playback start position in seconds (ex. "132" starts at 2mins, 12secs)
                video_theme = target.data("videoTheme") || (this.settings).theme; // Y: player theme ("dark","light")
                if (video_vendor == "Vimeo"){
                    video_color = target.data("videoColor") || prepHex((this.settings).color); // V: player controls color (hex code minus the "#", default is "00adef")
                } else {
                    video_color = target.data("videoColor") || (this.settings).color; // Y: player controls color ("red","white")
                }
                video_byline = target.data("videoByline") || (this.settings).byline; // V: display byline (0,1)
                video_portrait = target.data("videoPortrait") || (this.settings).portrait; // V: display user's portrait (0,1)
                youtube_player = $("<embed src=\"https://www.youtube.com/embed/" + video_id + "?autoplay=" + video_autoplay + "&autohide=" + video_autohide + "&controls=" + video_controls + "&iv_load_policy=" + video_iv_load_policy + "&loop=" + video_loop + "&modestbranding=" + video_modestbranding + "&playlist=" + video_playlist + "&rel=" + video_related + "&showinfo=" + video_showinfo + "&start=" + video_start_time + "&theme=" + video_theme + "&color=" + video_color + "\" width=\"" + video_width + "\" height=\"" + video_height + "\" frameborder=\"0\" allowfullscreen></embed>");
                vimeo_player = $("<iframe src=\"http://player.vimeo.com/video/" + video_id + "?autoplay=" + video_autoplay + "&loop=" + video_loop + "&title=" + video_showinfo + "&byline=" + video_byline + "&portrait=" + video_portrait + "&color=" + video_color + "\" width=\"" + video_width + "\" height=\"" + video_height + "\" frameborder=\"0\" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>");
                ease_in = (this.settings).ease_in;
                glow = (this.settings).glow;
                glow_color = (this.settings).glow_color;
                backdrop_color = (this.settings).backdrop_color;
                backdrop_opacity = (this.settings).backdrop_opacity;

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

                target.append('<div class="video-wrapper"><div class="video-frame"><div class="video"></div></div></div>');
                target.find(".video-wrapper").css({
                    backgroundColor: "rgba(" + colorConverter(backdrop_color).red + "," + colorConverter(backdrop_color).blue + "," + colorConverter(backdrop_color).green + "," + backdrop_opacity + ")"
                });
                target.find(".video-frame").css({
                    width:  video_width,
                    height: video_height,
                    marginTop: '-' + ((video_height.split("p")[0])/2) + 'px',
                    marginLeft: '-' + ((video_width.split("p")[0])/2) + 'px',
                    boxShadow: '0px 0px ' + glow + 'px ' + (glow/5) + 'px ' + fullHex(glow_color)
                });
                target.find(".video-wrapper").fadeIn(ease_in);
                if (video_vendor === "Vimeo") {
                    return target.find(".video").append(vimeo_player);
                } else {
                    return target.find(".video").append(youtube_player);
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