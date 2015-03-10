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
    constructor: (@elObj, @settings) ->
      @inst = _randar()
      @el = @elObj.el
      console.log(@el)
      @buildOpts()
      @buildEls()

    buildOpts: => _extObj(@settings, @elObj.opts)

    buildEls: =>
      (@wrapper = dom.createElement('span')).className = 'video-wrapper'
      @wrapper.innerHTML = _domStr(
        tag: 'div',
        attrs: {class: 'video-frame'},
        children: [
          tag: 'div',
          attrs: {class: 'video'},
          children: [
            tag: 'iframe',
            attrs: {id: @inst, class: 'video-iframe'}
          ]
        ])
      @el.parentNode.insertBefore(@wrapper, @el)
      @wrapper.appendChild(@el)


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

  # INIT
  this.videoLightning = videoLightning
) document
