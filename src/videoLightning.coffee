((document) ->
  dom = document

  # SETUP
  videoLightning = (obj) =>
    noElErr = -> console.error('VideoLightning was initialized without elements.'); return
    optEls = obj.elements || obj.element
    return noElErr() unless optEls
    rawEls = []; els = []
    pushRawEls = (e) ->
      if _isStr(e) then rawEls.push(el: e, opts: null)
      else el = _topKeyOfObj(e); rawEls.push(el: el, opts: e[el] || null)
    if _isAry(optEls) then (pushRawEls(e) for e in optEls) else pushRawEls(optEls)
    for el in rawEls
      if (domEls = _getEl(el.el))
        if _isElAry(domEls) then (els.push(el: de, opts: el.opts) for de in domEls)
        else els.push(el: domEls, opts: el.opts)
    return noElErr() if els.length == 0
    settings = obj.settings || {}
    (@vlData.instances.push(new VideoLightning(el, settings))) for el in els when el
    _initYTAPI()
    return

  # VideoLightning Class
  class VideoLightning
    constructor: (@elObj, opts) ->
      @opts = _extObj({}, opts)
      @inst = _randar()
      @el = @elObj.el
      @buildOpts()
      @buildEls()
      @cover() if _boolify(@opts.cover, false)
      @regEvents()

    buildOpts: =>
      remap = [['backdrop_color','bdColor'],['backdrop_opacity','bdOpacity'],['ease_in','fadeIn'],
               ['ease_out','fadeOut'],['glow_color','glowColor'],['start_time','startTime'],['z_index','zIndex'],
               ['rick_roll','rickRoll'],['iv_load_policy','ivLoadPolicy']]
      _extObj(@opts, @elObj.opts)
      elDataSet = @el.dataset || []
      if elDataSet.length == 0
        (v = @el.getAttribute("data-video-#{k}"); if v then elDataSet[k] = v) for k in ['id', 'width', 'height']
      normalize = (k, v) => @opts[k.replace(/^video(.)(.*)/, (a, b, c)-> b.toLowerCase() + c)] = v
      normalize(k, v) for k, v of elDataSet
      @opts.width = if @opts.width then parseInt(@opts.width, 10) else 640
      @opts.height = if @opts.height then parseInt(@opts.height, 10) else 390
      @opts.id ?= 'y-dQw4w9WgXcQ'
      if @opts.id.match(/^v/) then (@vendor = 'vimeo'; @vm = true)
      else if @opts.id.match(/^f/) then (@vendor = 'iframe'; @ifr = true)
      else (@vendor = 'youtube'; @yt = true)
      window.vlData[@vendor] = true
      @id = @opts.id.replace(/([vyf]-)/i, '')
      (@opts[key[1]] ?= @opts[key[0]]) for key in remap

    buildEls: =>
      (@target = dom.createElement('span')).className = 'video-target'
      @el.parentNode.insertBefore(@target, @el)
      @target.appendChild(@el)
      bdc = _cc(_val(@opts.bdColor, '#ddd'))
      bdo = _val(@opts.bdOpacity, 0.6)
      bdbg = "background: rgba(#{bdc.r}, #{bdc.g}, #{bdc.b}, #{bdo});"
      fdim = "width: #{@opts.width}px; height: #{@opts.height}px;"
      fmar = "margin-top: -#{@opts.height/2}px; margin-left: -#{@opts.width/2}px;"
      fglo = "box-shadow: 0px 0px #{g = _val(@opts.glow, 20)}px #{g / 5}px #{_fullHex(_val(@opts.glowColor, '#000'))};"
      wrapCss = if _boolify(@opts.popover, false) then _wrapCssP(@opts.width, @opts.height) else _wrapCss
      xCss = "background: #{_fullHex(_val(@opts.xBgColor, '#000'))}; color: #{_fullHex(_val(@opts.xColor, '#fff'))};
         border: #{_val(@opts.xBorder, 'none')}; box-sizing: border-box;"
      frameCss = "background: #{_fullHex(_val(@opts.frameColor, '#000'))}; border: #{_val(@opts.frameBorder, 'none')};
         box-sizing: border-box;"
      @target.insertAdjacentHTML 'beforeend', _domStr(
        tag: 'div'
        attrs:
          id: "wrap_#{@inst}"
          class: 'video-wrapper'
          style: "#{wrapCss} #{bdbg} z-index: #{_val(@opts.zIndex, 2100)}; opacity: 0;"
        children: [
          tag: 'div'
          attrs:
            class: 'video-frame'
            style: "#{_frameCss} #{fdim} #{fmar} #{fglo}"
          children: [
            tag: 'div'
            attrs: {class: 'video'}
            children: [
              tag: 'div'
              inner: '&times;'
              attrs:
                id: "close_#{@inst}"
                class: 'video-close'
                style: "float: right; margin-right: -34px; #{fglo} #{xCss} padding: 0 10px 0 12px; font-size: 25px;"
            ,
              tag: 'iframe' #"#{if @yt then 'div' else 'iframe'}"
              attrs:
                type: 'text/html'
                id: "iframe_#{@inst}"
                class: 'video-iframe'
                style: "position: absolute; top: 0; left: 0; #{frameCss}"
            ]
          ]
        ]
      )
      @wrapper = dom.getElementById("wrap_#{@inst}")
      @iframe = dom.getElementById("iframe_#{@inst}")
      @close = dom.getElementById("close_#{@inst}")

    popoverPos: =>
      pos = _gravity(@target, @opts.width, @opts.height, @opts.fluidity)
      @wrapper.style.left = "#{pos.x}px"
      @wrapper.style.top = "#{pos.y}px"

    resize: =>
      unless window.vlData.throttle
        @popoverPos()
        if @opts.throttle
          window.vlData.throttle = true
          throttleOff = -> window.vlData.throttle = false
          setTimeout(throttleOff, @opts.throttle)

    regEvents: =>
      @target.style.cursor = 'pointer'
      @target.addEventListener('mouseup', @clicked, false)
      if _boolify(@opts.popover, false)
        window.addEventListener('resize', @resize, false)
        window.addEventListener('scroll', @resize, false)
        window.addEventListener('orientationchange', @resize, false)
        if @opts.peek
          @target.addEventListener('mouseenter', @hovered, false)
          @target.addEventListener('mouseleave', @hovered, false)

    clicked: (e) =>
      return @peek(false, true) if @peeking
      return if (e.buttons && e.buttons != 1) || (e.which && e.which != 1) || (e.button && e.button != 1)
      return if @playing then @stop() else @play()

    hovered: (e) =>
      @peek() if e.type == 'mouseenter' && !@playing
      @peek(@peeking) if e.type == 'mouseleave' && @playing

    peek: (close = false, pin = false) =>
      return if !@peeking && @playing
      @close.innerHTML = if close || pin then '&times;' else '&#94;'
      @peeking = !!!(close || pin)
      return if close then @stop() else if pin then null else @play()

    play: =>
      @popoverPos() if _boolify(@opts.popover, false)
      @show()
      if @ifr
        _setSrc(@iframe,
          url: encodeURI(@id)
          attrs:
            width: @opts.width
            height: @opts.height
            frameBorder: 0
        )
      else if @ready && !@playing && @iframe.src != 'about:blank'
        @ytPlay() if @yt
        @vmPlay() if @vm
      else if !@playing
        @initPlayerVM() if @vm
        @initPlayerYT() if @yt
      @playing = true
      window.clearTimeout(@clearAfter) if @clearAfter
      return

    stop: (fade = 0) =>
      return if _boolify(@opts.rickRoll, false)
      @hide(fade)
      if @ready
        @ytStop() if @yt
        @vmStop() if @vm
      else
        @clear()
      @playing = false
      @clearAfter = window.setTimeout(@clear, (_val(@opts.unloadAfter) || 45) * 1000) if _boolify(@opts.unload, true)
      return

    clear: => @iframe.src = 'about:blank'; return

    show: => _fadeIn(@wrapper, _val(@opts.fadeIn, 300)); return

    hide: (fade = 0) => _fadeOut(@wrapper, _val(@opts.fadeOut, fade)); return

    cover: => if @yt then @coverYT(); return

    initPlayerYT: =>
      _setSrc(@iframe,
        url: "#{location.protocol}//www.youtube.com/embed/#{@id}"
        params:
          enablejsapi: 1
          autoplay: _bitify(@opts.autoplay, 1)
          autohide: _val(@opts.autohide, 2)
          cc_load_policy: _val(@opts.ccLoadPolicy, 0)
          color: _val(@opts.color, null)
          controls: _val(@opts.controls, 2)
          disablekb: _val(@opts.disablekb, 0)
          end: _val(@opts.endTime, null)
          fs: _val(@opts.fs, 1)
          hl: _val(@opts.hl, 'en')
          iv_load_policy: _val(@opts.ivLoadPolicy, 1)
          list: _val(@opts.list, null)
          listType: _val(@opts.listType, null)
          loop: _val(@opts.loop, 0)
          modestbranding: _val(@opts.modestbranding, 0)
          origin: encodeURIComponent(_val(@opts.origin, "#{location.protocol}//#{location.host}"))
          playerapiid: @inst
          playlist: _val(@opts.playlist, null)
          playsinline: _val(@opts.playsinline, 0)
          rel: _val(@opts.rel, 0)
          showinfo: _val(@opts.showinfo, 1)
          start: _val(@opts.startTime, 0)
          theme: _val(@opts.theme, null)
        attrs:
          width: @opts.width
          height: @opts.height
          frameBorder: 0
      )
      @iframe.setAttribute('allowFullScreen', '')
      @setYTPlayer() if window.vlData.ytAPIReady

    setYTPlayer: =>
      ready = => @ready = true
      @ytPlayer ?= new YT.Player("iframe_#{@inst}", {
        events:
          onReady: ready
          onStateChange: @ytState
      })

    ytPlay: => @ytPlayer.playVideo()

    ytStop: =>
      _ytReset(@ytPlayer, @opts.startTime)
      @ytPlayer.stopVideo()
      @ytPlayer.clearVideo()

    ytState: (e) => @stop(_val(@opts.fadeOut, 1000)) if e.data == 0 && _boolify(@opts.autoclose, true)

    coverYT: => @ytCover = _coverEl(@target, "//img.youtube.com/vi/#{@id}/hqdefault.jpg"); return

    initPlayerVM: =>
      _setSrc(@iframe,
        url: "#{location.protocol}//player.vimeo.com/video/#{@id}"
        params:
          autoplay: _bitify(@opts.autoplay, 1)
          loop: _val(@opts.loop, 0)
          title: _val(@opts.showinfo, 1)
          byline: _val(@opts.byline, 1)
          portrait: _val(@opts.portrait, 1)
          color: _prepHex(_val(@opts.color, '#00adef'))
          api: 1
          player_id: @inst
        attrs:
          width: @opts.width
          height: @opts.height
          frameBorder: 0
      )
      @iframe.setAttribute('allowFullScreen', '')
      window.addEventListener('message', @vmListen, false)
      @vmPlayer ?= @iframe

    vmListen: (msg) =>
      data = JSON.parse(msg.data)
      return unless data.player_id == @inst
      switch data.event
        when 'ready'
          @ready = true
          _postToVM(@vmPlayer, @id, 'addEventListener', 'finish')
        when 'finish' then @stop(1000)
      return

    vmPlay: => _postToVM(@vmPlayer, @id, 'play'); return

    vmStop: => _postToVM(@vmPlayer, @id, 'pause'); return

  # HELPERS
  _val = (p, d) -> return if p in [false, 'false', 0, '0'] then p else p || d
  _bitify = (p, d) -> return if p in [false, 'false', 0, '0'] then 0 else if p in [true, 'true', '1', 1] then 1 else d
  _boolify = (p, d) -> return if p in [false, 'false', 0, '0'] then false else !!p || d
  _domStr = (o) ->
    attrs = ''; children = '';
    ((attrs += ' ' + k + '="' + v + '"') for k, v of o.attrs) if o.attrs
    ((children += if _isObj(c) then _domStr(c) else c) for c in o.children) if o.children
    return '<' + o.tag + attrs + '>' + (o.inner || children) + '</' + o.tag + '>'
  _setSrc = (el, o) ->
    src = "#{o.url}?"
    ((src += "&#{k}=#{v}") for k, v of o.params when v != null)
    el.src = src.replace(/&/, '')
    (el[k] = v) for k, v of o.attrs
  _extObj = (baseObj, extObj) -> (baseObj[k] = v) for k, v of extObj; return baseObj
  _isStr = (obj) -> return typeof obj == 'string'
  _isAry = (obj) -> return obj instanceof Array
  _isElAry = (obj) -> return obj instanceof HTMLCollection
  _isObj = (obj) -> return obj != null && typeof obj == 'object'
  _topKeyOfObj = (obj) -> return k for k, v of obj
  _getEl = (el) ->
    els = if el.charAt(0) == '#' then dom.getElementById(el.substr(1)) else dom.getElementsByClassName(el.substr(1))
    return if _isAry(els) && els.length == 0 then null else els
  _randar = -> (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).substring(0, 16)
  _prepHex = (hex) -> hex = hex.replace(/^#/, ''); return if hex.length == 3 then "#{hex}#{hex}" else hex
  _fullHex = (hex) -> return if hex == 'transparent' then hex else "#" + _prepHex(hex)
  _cc = (hex) ->
    r: parseInt((_prepHex(hex)).substring(0, 2), 16)
    g: parseInt((_prepHex(hex)).substring(2, 4), 16)
    b: parseInt((_prepHex(hex)).substring(4, 6), 16)
  _wrapCss = 'display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; right: 0; bottom: 0; left: 0;'
  _wrapCssP = (w, h) -> "display: none; position: fixed; width: #{w}px; height: #{h}px;"
  _frameCss = 'position: absolute; top: 50%; left: 50%; background: #000000;'
  _fadeCss = (el, t) -> el.style.transition = el.style.mozTransition = el.style.webkitTransition = "opacity #{t}ms ease"
  _fadeIn = (el, t) ->
    _fadeCss(el, t)
    el.style.display = 'block'
    applyFade = -> el.style.opacity = 1
    setTimeout(applyFade, 20)
  _fadeOut = (el, t) ->
    _fadeCss(el, t)
    el.style.opacity = 0
    applyFade = -> el.style.display = 'none'
    setTimeout(applyFade, t)
  _initYTAPI = ->
    return if dom.getElementById('ytScript')
    scriptA = dom.getElementsByTagName('script')[0]
    vFuncs = document.createElement('script')
    vFuncs.innerHTML = 'function onYouTubeIframeAPIReady() {vlData.ytReady()};'
    scriptA.parentNode.insertBefore(vFuncs, scriptA)
    vScript = document.createElement('script')
    vScript.id = 'ytScript'
    vScript.async = true
    vScript.src = "#{location.protocol}//www.youtube.com/iframe_api"
    vFuncs.parentNode.insertBefore(vScript, vFuncs.nextSibling)
    return
  _ytReset = (p, s = 0) -> if (p.getDuration() - 3) < p.getCurrentTime() then p.pauseVideo(); p.seekTo(s, false); return
  _postToVM = (player, id, k, v = null) ->
    data = if v then {method: k, value: v} else {method: k}
    player.contentWindow.postMessage(JSON.stringify(data), "#{location.protocol}//player.vimeo.com/video/#{id}")
  _coverEl = (target, src) ->
    cover = dom.createElement('img')
    cover.className = 'video-cover'
    cover.src = src
    target.appendChild(cover)
    return cover
  _testEl = () ->
    unless (test = document.getElementById('vl-size-test'))
      test = document.createElement("div")
      test.id = 'vl-size-test'
      test.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;"
      document.body.appendChild(test)
    width: test.offsetWidth
    height: test.offsetHeight
  _gravity = (el, width, height, fluidity = 30) ->
    coords = el.getBoundingClientRect()
    center = x: (page_width = _testEl().width) / 2, y: (page_height = _testEl().height) / 2
    box_center = x: width / 2, y: height / 2
    points = []
    for x in [coords.left..(coords.right + width)] by fluidity
      points.push([x - width, coords.top - height])
      points.push([x - width, coords.bottom])
    for y in [coords.top..(coords.bottom + height)] by fluidity
      points.push([coords.left - width, y - height])
      points.push([coords.right, y - height])
    sort = (a, b) ->
      for ary in [[a, obja = {}], [b, objb = {}]]
        x = ary[0][0]
        y = ary[0][1]
        ary[1].diffx = if (dax = (x + box_center.x)) > center.x then dax - center.x else center.x - dax
        ary[1].diffy = if (day = (y + box_center.y)) > center.y then day - center.y else center.y - day
        ary[1].diff = ary[1].diffx + ary[1].diffy
        if x < 0 || x + width > page_width then ary[1].diff += 10000
        if y < 0 || y + height > page_height then ary[1].diff += 10000
      obja.diff - objb.diff
    points.sort(sort)
    x: parseInt((if (x = points[0][0]) < 0 || x + width > page_width then center.x - box_center.x else x), 10)
    y: parseInt((if (y = points[0][1]) < 0 || y + height > page_height then center.y - box_center.y else y), 10)

  # INIT
  @videoLightning = videoLightning
  @vlData = {}
  @vlData.instances = []
  @vlData.ytReady = () => @vlData.ytAPIReady = true
  @vlData.youtube = @vlData.vimeo = false

  if typeof $ != 'undefined'
    $.fn.jqueryVideoLightning = (options) ->
      @each ->
        unless $.data(this, 'plugin_jqueryVideoLightning')
          inst = new VideoLightning({el: this, opts: options})
          vlData.instances.push(inst)
          $.data(this, 'plugin_jqueryVideoLightning', inst)
        return
      _initYTAPI()

) document
