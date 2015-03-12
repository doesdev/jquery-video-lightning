((document) ->
  dom = document

  # SETUP
  videoLightning = (opts) =>
    @vlData.instances = []
    noElErr = -> console.error('VideoLightning was initialized without elements.'); return
    optEls = opts.elements || opts.element
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
    settings = opts.settings || {}
    (@vlData.instances.push(new VideoLightning(el, settings))) for el in els
    return

  # VideoLightning Class
  class VideoLightning
    constructor: (@elObj, @opts) ->
      @inst = _randar()
      @el = @elObj.el
      @buildOpts()
      @buildEls()
      @initAPI()

    buildOpts: =>
      _extObj(@opts, @elObj.opts)
      elDataSet = @el.dataset
      (@opts[k.replace(/^video(.)(.*)/, (a, b, c)-> b.toLowerCase() + c)] = v) for k, v of elDataSet
      @opts.width ?= 640
      @opts.height ?= 390
      @vendor = if @opts.id.match(/^v/) then "vimeo" else "youtube"
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
              tag: 'iframe'
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

    clicked: => return if @playing then @stop() else @play()

    hovered: (e) => return true

    play: => @show(); @playing = true; return

    stop: => @hide(); @playing = false; return

    show: => _fadeIn(@wrapper, @opts.fadeIn || 300); return

    hide: => _fadeOut(@wrapper, @opts.fadeOut || 0); return

    initAPI: => if @vendor == "youtube" then @initYt()

    initYt: =>
      return if dom.getElementById('ytScript')
      scriptA = dom.getElementsByTagName('script')[0]
      ytrScript = document.createElement('script')
      ytrScript.innerHTML = 'function onYouTubeIframeAPIReady() {vlData.ready()};'
      scriptA.parentNode.insertBefore(ytrScript, scriptA)
      ytScript = document.createElement('script')
      ytScript.id = 'ytScript'
      ytScript.src = "https://www.youtube.com/iframe_api"
      ytrScript.parentNode.insertBefore(ytScript, ytrScript.nextSibling)
      return

  # HELPERS
  _domStr = (o) ->
    attrs = ''; children = '';
    ((attrs += ' ' + k + '="' + v + '"') for k, v of o.attrs) if o.attrs
    ((children += if _isObj(c) then _domStr(c) else c) for c in o.children) if o.children
    return '<' + o.tag + attrs + '>' + children + '</' + o.tag + '>'
  _extObj = (baseObj, extObj) -> (baseObj[k] = v) for k, v of extObj
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

  # INIT
  @videoLightning = videoLightning
  @vlData = {}
  @vlData.ready = () => i.regEvents() for i in @vlData.instances
) document
