((document) ->
  dom = document

  # SETUP
  videoLightning = (opts) ->
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
    (new VideoLightning(el, settings)) for el in els
    return

  # VideoLightning Class
  class VideoLightning
    constructor: (@elObj, @opts) ->
      @inst = _randar()
      @el = @elObj.el
      _extObj(@opts, @elObj.opts)
      @buildEls()
      @regEvents()

    buildEls: =>
      (@target = dom.createElement('span')).className = 'video-target'
      @target.style.cursor = 'pointer'
      @el.parentNode.insertBefore(@target, @el)
      @target.appendChild(@el)
      bdc = _cc(@opts.bdColor || '#000')
      bdo = @opts.bdOpacity || 1
      @target.insertAdjacentHTML 'beforeend', _domStr(
        tag: 'div'
        attrs:
          id: "wrap_#{@inst}"
          class: 'video-wrapper'
          style: "#{_wrapCss}; background: rgba(#{bdc.r}, #{bdc.g}, #{bdc.b}, #{bdo})}; z-index: #{@opts.zIndex||2100}"
        children: [
          tag: 'div'
          attrs: {class: 'video-frame', style: 'background:#000000;'}
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

    regEvents: =>
      @target.addEventListener('mouseup', @clicked)
      @target.addEventListener('mouseover', @hovered) if @opts.peek

    clicked: (e) => @show(); return true

    hovered: (e) => return true

    show: => @wrapper.style.display = 'block'; return
    hide: => @wrapper.style.display = 'none'; return

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
  _cc = (hex) ->
    r: parseInt((_prepHex(hex)).substring(0, 2), 16)
    g: parseInt((_prepHex(hex)).substring(2, 4), 16)
    b: parseInt((_prepHex(hex)).substring(4, 6), 16)
  _wrapCss = 'display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; right: 0; bottom: 0; left: 0;'

  # INIT
  this.videoLightning = videoLightning
) document
