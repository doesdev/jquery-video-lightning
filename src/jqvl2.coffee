((document) ->
  dom = document

  # SETUP
  videoLightning = (obj) =>
    @vlData.instances = []
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
        (if _isElAry(domEls) then (els.push(el: de, opts: el.opts) for de in domEls) else els.push(el: domEls, el.opts))
    return noElErr() unless els.length > 0
    settings = obj.settings || {}
    (@vlData.instances.push(new VideoLightning(el, settings))) for el in els
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
      @initPlayerVM() if @vm

    buildOpts: =>
      _extObj(@opts, @elObj.opts)
      elDataSet = @el.dataset
      (@opts[k.replace(/^video(.)(.*)/, (a, b, c)-> b.toLowerCase() + c)] = v) for k, v of elDataSet
      @opts.width = if @opts.width then parseInt(@opts.width) else 640
      @opts.height = if @opts.height then parseInt(@opts.height) else 390
      @opts.id ?= 'y-dQw4w9WgXcQ'
      if @opts.id.match(/^v/) then (@vendor = 'vimeo'; @vm = true) else (@vendor = 'youtube'; @yt = true)
      window.vlData[@vendor] = true
      @id = @opts.id.replace(/([vy]-)/i, '')

    buildEls: =>
      (@target = dom.createElement('span')).className = 'video-target'
      @el.parentNode.insertBefore(@target, @el)
      @target.appendChild(@el)
      bdc = _cc(@opts.bdColor || '#ddd')
      bdo = @opts.bdOpacity || 0.6
      bdbg = "background: rgba(#{bdc.r}, #{bdc.g}, #{bdc.b}, #{bdo})};"
      fdim = "width: #{@opts.width}px; height: #{@opts.height}px;"
      fmar = "margin-top: -#{@opts.height/2}px; margin-left: -#{@opts.width/2}px;"
      fglo = "box-shadow: 0px 0px #{@opts.glow||20}px #{(@opts.glow||20) / 5}px #{_fullHex(@opts.glowColor||'#000')};"
      @target.insertAdjacentHTML 'beforeend', _domStr(
        tag: 'div'
        attrs:
          id: "wrap_#{@inst}"
          class: 'video-wrapper'
          style: "#{_wrapCss} #{bdbg} z-index: #{@opts.zIndex||2100}; opacity: 0;"
        children: [
          tag: 'div'
          attrs:
            class: 'video-frame'
            style: "#{_frameCss} #{fdim} #{fmar} #{fglo}"
          children: [
            tag: 'div'
            attrs: {class: 'video'}
            children: [
              tag: "#{if @yt then 'div' else 'iframe'}"
              attrs: {id: "iframe_#{@inst}", class: 'video-iframe'}
            ]
          ]
        ]
      )
      @wrapper = dom.getElementById("wrap_#{@inst}")
      @iframe = dom.getElementById("iframe_#{@inst}")

    regEvents: =>
      @target.style.cursor = 'pointer'
      @target.addEventListener('mouseup', @clicked)
      @target.addEventListener('mouseover', @hovered) if @opts.peek

    clicked: (e) =>
      return if (e.buttons && e.buttons != 1) || (e.which && e.which != 1) || (e.button && e.button != 1)
      return if @playing then @stop() else @play()

    hovered: (e) => return true

    play: =>
      @show()
      if _boolify(@opts.autoplay, true)
        @ytPlay() if @yt
        @vmPlay() if @vm
      @playing = true
      return

    stop: (fade = 0) =>
      @hide(fade)
      @ytStop() if @yt
      @vmStop() if @vm
      @playing = false
      return

    show: => _fadeIn(@wrapper, @opts.fadeIn || 300); return

    hide: (fade = 0) => _fadeOut(@wrapper, @opts.fadeOut || fade); return

    cover: => if @yt then @coverYT(); return

    initPlayerYT: =>
      @ytPlayer = new YT.Player "iframe_#{@inst}", {
        width: @opts.width
        height: @opts.height
        videoId: @id
        playerVars:
          'enablejsapi': 1,
          'autoplay': 0,
          'autohide': _val(@opts.autohide, 2),
          'cc_load_policy': _val(@opts.ccLoadPolicy, 0),
          'color': _val(@opts.color, null),
          'controls': _val(@opts.controls, 2),
          'disablekb': _val(@opts.disablekb, 0),
          'end': _val(@opts.endTime, null),
          'fs': _val(@opts.fs, 1),
          'hl': _val(@opts.hl, 'en'),
          'iv_load_policy': _val(@opts.ivLoadPolicy, 1),
          'list': _val(@opts.list, null),
          'listType': _val(@opts.listType, null),
          'loop': _val(@opts.loop, 0),
          'modestbranding': _val(@opts.modestbranding, 0),
          'origin': _val(@opts.origin, "#{location.protocol}//#{location.host}"),
          'playerapiid': @inst,
          'playlist': _val(@opts.playlist, null),
          'playsinline': _val(@opts.playsinline, 0),
          'rel': _val(@opts.rel, 0),
          'showinfo': _val(@opts.showinfo, 1),
          'start': _val(@opts.startTime, 0),
          'theme': @opts.theme || null
        events:
          'onReady': @regEvents,
          'onStateChange': @ytState
      }

    ytPlay: => @ytPlayer.playVideo()

    ytStop: =>
      _ytReset(@ytPlayer, @opts.startTime)
      @ytPlayer.stopVideo()
      @ytPlayer.clearVideo()

    ytState: (e) => @stop(1000) if e.data == 0 && _boolify(@opts.autoclose, true)

    coverYT: => @ytCover = _coverEl(@target, "//img.youtube.com/vi/#{@id}/hqdefault.jpg"); return

    initPlayerVM: =>
      src =
        "http://player.vimeo.com/video/#{@id}?" +
          "autoplay=0&" +
          "loop=#{@opts.loop || 0}&title=#{@opts.showinfo || 1}&" +
          "byline=#{@opts.byline || 1}&" +
          "portrait=#{@opts.portrait || 1}&" +
          "color=#{_prepHex(@opts.color || '#00adef')}" +
          "api=1&player_id=#{@inst}"
      @iframe.setAttribute('allowFullScreen', '1')
      @iframe.width = @opts.width
      @iframe.height = @opts.height
      @iframe.frameBorder = 0
      @iframe.src = src
      window.addEventListener('message', @vmListen, false)
      @vmPlayer = @iframe

    vmListen: (msg) =>
      data = JSON.parse(msg.data)
      return unless data.player_id == @inst
      switch data.event
        when 'ready'
          @regEvents()
          _postToVM(@vmPlayer, @id, 'addEventListener', 'finish')
        when 'finish' then @stop(1000)
      return

    vmPlay: => _postToVM(@vmPlayer, @id, 'play'); return

    vmStop: => _postToVM(@vmPlayer, @id, 'pause'); return

  # HELPERS
  _val = (p, d) -> return if p in [false, 'false', 0, '0'] then p else p || d
  _boolify = (p, d) -> return if p in [false, 'false', 0, '0'] then false else !!p || d
  _domStr = (o) ->
    attrs = ''; children = '';
    ((attrs += ' ' + k + '="' + v + '"') for k, v of o.attrs) if o.attrs
    ((children += if _isObj(c) then _domStr(c) else c) for c in o.children) if o.children
    return '<' + o.tag + attrs + '>' + children + '</' + o.tag + '>'
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
  _fullHex = (hex) -> return "#" + _prepHex(hex)
  _cc = (hex) ->
    r: parseInt((_prepHex(hex)).substring(0, 2), 16)
    g: parseInt((_prepHex(hex)).substring(2, 4), 16)
    b: parseInt((_prepHex(hex)).substring(4, 6), 16)
  _wrapCss = 'display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; right: 0; bottom: 0; left: 0;'
  _frameCss = 'position: absolute; top: 50%; left: 50%; background: #000000;'
  _fadeCss = (el, t) -> el.style.transition = el.style.mozTransition = el.style.webkitTransition = "opacity #{t}ms ease"
  _fadeIn = (el, t) -> _fadeCss(el, t); el.style.display = 'block'; setTimeout((-> el.style.opacity = 1), 20)
  _fadeOut = (el, t) -> _fadeCss(el, t); el.style.opacity = 0; setTimeout((-> el.style.display = 'none'), t)
  _initYTAPI = ->
    return if dom.getElementById('ytScript')
    scriptA = dom.getElementsByTagName('script')[0]
    vFuncs = document.createElement('script')
    vFuncs.innerHTML = 'function onYouTubeIframeAPIReady() {vlData.ytReady()};'
    scriptA.parentNode.insertBefore(vFuncs, scriptA)
    vScript = document.createElement('script')
    vScript.id = 'ytScript'
    vScript.async = true
    vScript.src = '//www.youtube.com/iframe_api'
    vFuncs.parentNode.insertBefore(vScript, vFuncs.nextSibling)
    return
  _ytReset = (p, s = 0) -> if (p.getDuration() - 3) < p.getCurrentTime() then p.pauseVideo(); p.seekTo(s, false); return
  _postToVM = (player, id, k, v = null) ->
    data = if v then {method: k, value: v} else {method: k}
    player.contentWindow.postMessage(JSON.stringify(data), "http://player.vimeo.com/video/#{id}")
  _coverEl = (target, src) ->
    cover = dom.createElement('img')
    cover.className = 'video-link'
    cover.src = src
    target.appendChild(cover)
    return cover
  _testEl = () ->
    unless (test = document.getElementById('vl-size-test'))
      test = document.createElement("div")
      test.id = 'vl-size-test'
      test.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;"
      document.body.appendChild(test)
    height: test.offsetHeight
    width: test.offsetWidth
  _coords = (el) ->
    rect = el.getBoundingClientRect()
    hl_border = 0
    top: rect.top - hl_border
    right: rect.right + hl_border
    bottom: rect.bottom + hl_border
    left: rect.left - hl_border
    width: rect.width || rect.right - rect.left
    height: rect.height || rect.bottom - rect.top
  _gravity = (coords, height, width) ->
    center = x: (page_width = _testEl().width) / 2, y: (page_height = _testEl().height) / 2
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

  # INIT
  @videoLightning = videoLightning
  @vlData = {}
  @vlData.ytReady = () => i.initPlayerYT() for i in @vlData.instances.filter (i) -> i.vendor == 'youtube'
  @vlData.youtube = @vlData.vimeo = false
) document
