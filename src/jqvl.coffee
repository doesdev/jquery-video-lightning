(($, window, document) ->
  pluginName = "jqueryVideoLightning"
  defaults =
    id: "y-dQw4w9WgXcQ"
    width: "640px"
    height: "390px"
    autoplay: 0
    autohide: 2
    controls: 1
    iv_load_policy: 1
    loop: 0
    modestbranding: 0
    playlist: ""
    related: 0
    showinfo: 1
    start_time: 0
    theme: "dark"
    color: ""
    byline: 1
    portrait: 1
    effect_in: "fadeIn"
    ease_in: 300
    ease_out: 0
    z_index: 21000
    backdrop_color: "#000"
    backdrop_opacity: 1
    glow: 0
    glow_color: "#fff"
    rick_roll: 0
    cover: 0
    popover: 0
    popover_x: "auto"
    popover_y: "auto"
    peek: 0

  class JQVideoLightning
    constructor: (element, options) ->
      @element = element
      @target = $(@element)
      if @target.parent(".video-target").length > 0
        @target_wrapper = @target.parent(".video-target")
      else
        @target_wrapper = @target.wrap("<span class='video-target'></span>").parent(".video-target")
      @base_settings = $.extend({}, defaults, options)
      @settings = @getSettings()
      @vendor = if @settings.videoId.charAt(0).toLowerCase() == "v" then "vimeo" else "youtube"
      @video_id = @settings.videoId.substring(2)
      @init()

    init: =>
      @target_wrapper.css("cursor", "pointer")
      if $("style:contains('.video-wrapper')").length < 1
        styles = "
          <style type='text/css'>
            .video-wrapper{
              display: none;
              position: fixed;
              min-width: 100%;
              min-height: 100%;
              top: 0;
              bottom: 0;
              left: 0;
              z-index: #{@settings.videoZIndex};
            }
            .video-frame{
              background: #000000;
            }
          </style>
        "
        $(styles).appendTo("head")
      @coverImage(@vendor, @video_id, @target_wrapper) if @settings.videoCover == 1
      @target_wrapper.on "click", => @player()
      if @settings.videoPeek == 1
        @target_wrapper.on 'mouseenter', => @player()
        @target_wrapper.on 'mouseleave', => @player()
      if @settings.videoPopover == 1
        $(document).on "scroll mousewheel DOMMouseScroll MozMousePixelScroll", => @popoverPosition()
        $(window).on 'resize', => @popoverPosition()

    player: =>
      if @target_wrapper.find('.video-frame').is(':visible') || @target_wrapper.find('.video-wrapper').is(':visible')
        @destroy() unless @settings.videoRickRoll == 1
        return
      if @settings.videoPopover == 1
        divs = '<div class="video-frame"><div class="video"></div></div>'
        @target_wrapper.append(divs)
        @video_frame = @target_wrapper.find('.video-frame')
        video_wrapper = @video_frame
        @video_frame.css({position: 'fixed'})
        @popover()
      else
        divs = '<div class="video-wrapper"><div class="video-frame"><div class="video"></div></div></div>'
        @target_wrapper.append(divs)
        vBdColor = @colorConverter(@settings.videoBackdropColor)
        @video_frame = @target_wrapper.find('.video-frame')
        video_wrapper = @target_wrapper.find('.video-wrapper')
        video_wrapper.css
          backgroundColor: "rgba(#{vBdColor.red},#{vBdColor.blue},#{vBdColor.green},#{@settings.videoBackdropOpacity})"
        @video_frame.css
          position: 'absolute'
          top: @settings.videoFrameTop
          left: @settings.videoFrameLeft

      @video_frame.css
        width: "#{@settings.videoWidth}px"
        height: "#{@settings.videoHeight}px"
        marginTop: @settings.videoFrameMarginTop
        marginLeft: @settings.videoFrameMarginLeft
        boxShadow: "0px 0px #{@settings.videoGlow}px #{@settings.videoGlow / 5}px #{@fullHex(@settings.videoGlowColor)}"

      video_wrapper[@settings.videoEffectIn](@settings.videoEaseIn)
      @target_wrapper.find('.video').append(@["#{@vendor}Player"]())

    getSettings: =>
      remapSettings = (settings) ->
        $.each(settings, (key, value) =>
          setting_key = "video" + key.toLowerCase().charAt(0).toUpperCase() +
            key.slice(1).replace(/_([a-z])/g, (m, w) -> w.toUpperCase())
          $(this).data(setting_key, value))
        $(this).data()
      settings = @base_settings
      settings = @target.extend({}, remapSettings(settings), @target.data())
      settings.videoWidth = parseInt(settings.videoWidth, 10)
      settings.videoHeight = parseInt(settings.videoHeight, 10)
      display_ratio = settings.videoHeight / settings.videoWidth
      if settings.videoWidth > $(window).width() - 30
        settings.videoWidth = $(window).width() - 30
        settings.videoHeight = Math.round(display_ratio * settings.videoWidth)
      settings.videoFrameTop = '50%'
      settings.videoFrameLeft = '50%'
      settings.videoFrameMarginTop = "-#{settings.videoHeight / 2}px"
      settings.videoFrameMarginLeft = "-#{settings.videoWidth / 2}px"
      settings

    popover: =>
      @settings.videoFrameMarginTop = 0
      @settings.videoFrameMarginLeft = 0
      @popoverPosition()

    popoverPosition: =>
      return unless @video_frame
      screen = testEl()
      coord = coords(@element)
      gravitate = gravity(coord, @settings.videoHeight, @settings.videoWidth)
      center = true if !gravitate.x || !gravitate.y
      y = if center then (screen.height / 2) - (@settings.videoHeight / 2) else gravitate.y
      x = if center then (screen.width / 2) - (@settings.videoWidth / 2) else gravitate.x
      @settings.videoFrameTop = "#{y}px"
      @settings.videoFrameLeft = "#{x}px"
      @video_frame.animate({
        top: @settings.videoFrameTop
        left: @settings.videoFrameLeft},{
        duration: 100
        easing: "linear"
        queue: false
      })

    colorConverter: (hex) =>
      red = parseInt((@prepHex(hex)).substring(0, 2), 16)
      blue = parseInt((@prepHex(hex)).substring(2, 4), 16)
      green = parseInt((@prepHex(hex)).substring(4, 6), 16)
      red: red
      blue: blue
      green: green

    prepHex: (hex) =>
      hex = (if (hex.charAt(0) is "#") then hex.split("#")[1] else hex)
      hex = hex + hex if hex.length is 3
      hex

    fullHex: (hex) =>
      hex = "#" + @prepHex(hex)
      hex

    coverImage: (vendor, video_id, @target_wrapper) =>
      vimeo_api_url = "http://www.vimeo.com/api/v2/video/#{video_id}.json?callback=?"
      youtube_img_url = "http://img.youtube.com/vi/#{video_id}/hqdefault.jpg"
      if vendor is "youtube"
        $("<img class='video-cover'>").attr("src", youtube_img_url).appendTo(@target_wrapper)
      else
        $.getJSON(vimeo_api_url,
          format: "jsonp"
        ).done (data) ->
          $("<img class='video-cover'>").attr("src", data[0].thumbnail_large).appendTo(@target_wrapper)

    youtubePlayer: =>
      params = "width='#{@settings.videoWidth}' height='#{@settings.videoHeight}' frameborder='0' allowfullscreen"
      url =
        "https://www.youtube.com/embed/#{@video_id}?" +
          "autoplay=#{@settings.videoAutoplay}&" +
          "autohide=#{@settings.videoAutohide}&" +
          "controls=#{@settings.videoControls}&" +
          "iv_load_policy=#{@settings.videoIvLoadPolicy}&" +
          "loop=#{@settings.videoLoop}&" +
          "modestbranding=#{@settings.videoModestbranding}&" +
          "playlist=#{@settings.videoPlaylist}&" +
          "rel=#{@settings.videoRelated}&" +
          "showinfo=#{@settings.videoShowinfo}&" +
          "start=#{@settings.videoStartTime}&" +
          "theme=#{@settings.videoTheme}&" +
          "color=#{@prepHex(@settings.videoColor)}"
      $("<iframe src='#{url}' #{params}></iframe>")

    vimeoPlayer: =>
      params = "width='#{@settings.videoWidth}' height='#{@settings.videoHeight}' frameborder='0' allowfullscreen"
      url =
        "http://player.vimeo.com/video/#{@video_id}?" +
          "autoplay=#{@settings.videoAutoplay}&" +
          "loop=#{@settings.videoLoop}&title=#{@settings.videoShowinfo}&" +
          "byline=#{@settings.videoByline}&" +
          "portrait=#{@settings.videoPortrait}&" +
          "color=#{@prepHex(@settings.videoColor)}"
      $("<iframe src='#{url}' #{params}></iframe>")

    destroy: () =>
      @target_wrapper.find(".video-wrapper").hide(@getSettings().videoEaseOut)
      setTimeout (=>
        @target_wrapper.find(".video").remove()
        @target_wrapper.find(".video-frame").remove()
        @target_wrapper.find(".video-wrapper").remove()
        $(this).off()
        $(this).removeData()
      ), @getSettings().videoEaseOut

  # Helper functions
  testEl = () ->
    unless (test = document.getElementById('jqvl-size-test'))
      test = document.createElement("div")
      test.id = 'jqvl-size-test'
      test.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;"
      document.body.appendChild(test)
    height: test.offsetHeight
    width: test.offsetWidth

  coords = (el) ->
    rect = el.getBoundingClientRect()
    hl_border = 0
    top: rect.top - hl_border
    right: rect.right + hl_border
    bottom: rect.bottom + hl_border
    left: rect.left - hl_border
    width: rect.width || rect.right - rect.left
    height: rect.height || rect.bottom - rect.top

  # Gravitate to center
  gravity = (coords, height, width) ->
    center = x: (page_width = testEl().width) / 2, y: (page_height = testEl().height) / 2
    box_center = x: width / 2, y: height / 2
    points = []

    for x in [coords.left..(coords.right + width)] by 30
      points.push([x - width, coords.top - height])
      points.push([x - width, coords.bottom])

    for y in [coords.top..(coords.bottom + height)] by 30
      points.push([coords.left - width, y - height])
      points.push([coords.right, y - height])

    sort = (a, b) ->
      for ary in [[a, obja = {}], [b, objb = {}]]
        x = ary[0][0]
        y = ary[0][1]
        ary[1].diffx = if (dax = (x + box_center.x)) > center.x then dax - center.x else center.x - dax
        ary[1].diffy = if (day = (y + box_center.y)) > center.y then day - center.y else center.y - day
        ary[1].diff = ary[1].diffx + ary[1].diffy
        if x < 0 || x + width > page_width then ary[1].diff =+ 10000
        if y < 0 || y + height > page_height then ary[1].diff =+ 10000
      obja.diff - objb.diff

    points.sort(sort)
    x: if (x = points[0][0]) < 0 || x + width > page_width then null else x
    y: if (y = points[0][1]) < 0 || y + height > page_height then null else y

  $.fn[pluginName] = (options) ->
    @each ->
      $.data this, "plugin_#{pluginName}", new JQVideoLightning(this, options) unless $.data(this, "plugin_#{pluginName}")
      return

  this
) jQuery, window, document
