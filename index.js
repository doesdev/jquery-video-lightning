(function (document) {
  const dom = document

  // SETUP
  const videoLightning = obj => {
    let el
    const noElErr = function () { console.error('VideoLightning was initialized without elements.') }
    const optEls = obj.elements || obj.element
    if (!optEls) { return noElErr() }
    const rawEls = []; const els = []
    const pushRawEls = function (e) {
      if (_isStr(e)) {
        return rawEls.push({ el: e, opts: null })
      } else { const el = _topKeyOfObj(e); return rawEls.push({ el, opts: e[el] || null }) }
    }
    if (_isAry(optEls)) { for (const e of Array.from(optEls)) { pushRawEls(e) } } else { pushRawEls(optEls) }
    for (el of Array.from(rawEls)) {
      var domEls
      if ((domEls = _getEl(el.el))) {
        if (_isElAry(domEls)) {
          for (const de of Array.from(domEls)) { els.push({ el: de, opts: el.opts }) }
        } else { els.push({ el: domEls, opts: el.opts }) }
      }
    }
    if (els.length === 0) { return noElErr() }
    const settings = obj.settings || {}
    for (el of Array.from(els)) { if (el) { this.vlData.instances.push(new VideoLightning(el, settings)) } }
    _initYTAPI()
  }

  // VideoLightning Class
  class VideoLightning {
    constructor (elObj, opts) {
      this.buildOpts = this.buildOpts.bind(this)
      this.buildEls = this.buildEls.bind(this)
      this.popoverPos = this.popoverPos.bind(this)
      this.resize = this.resize.bind(this)
      this.regEvents = this.regEvents.bind(this)
      this.clicked = this.clicked.bind(this)
      this.hovered = this.hovered.bind(this)
      this.peek = this.peek.bind(this)
      this.play = this.play.bind(this)
      this.stop = this.stop.bind(this)
      this.clear = this.clear.bind(this)
      this.show = this.show.bind(this)
      this.hide = this.hide.bind(this)
      this.cover = this.cover.bind(this)
      this.initPlayerYT = this.initPlayerYT.bind(this)
      this.setYTPlayer = this.setYTPlayer.bind(this)
      this.ytPlay = this.ytPlay.bind(this)
      this.ytStop = this.ytStop.bind(this)
      this.ytState = this.ytState.bind(this)
      this.coverYT = this.coverYT.bind(this)
      this.initPlayerVM = this.initPlayerVM.bind(this)
      this.vmListen = this.vmListen.bind(this)
      this.vmPlay = this.vmPlay.bind(this)
      this.vmStop = this.vmStop.bind(this)
      this.elObj = elObj
      this.opts = _extObj({}, opts)
      this.inst = _randar()
      this.el = this.elObj.el
      this.buildOpts()
      this.buildEls()
      if (_boolify(this.opts.cover, false)) { this.cover() }
      this.regEvents()
    }

    buildOpts () {
      let k, v
      const remap = [['backdrop_color', 'bdColor'], ['backdrop_opacity', 'bdOpacity'], ['ease_in', 'fadeIn'],
        ['ease_out', 'fadeOut'], ['glow_color', 'glowColor'], ['start_time', 'startTime'], ['z_index', 'zIndex'],
        ['rick_roll', 'rickRoll'], ['iv_load_policy', 'ivLoadPolicy']]
      _extObj(this.opts, this.elObj.opts)
      const elDataSet = this.el.dataset || []
      if (elDataSet.length === 0) {
        for (k of ['id', 'width', 'height']) { v = this.el.getAttribute(`data-video-${k}`); if (v) { elDataSet[k] = v } }
      }
      const normalize = (k, v) => { return this.opts[k.replace(/^video(.)(.*)/, (a, b, c) => b.toLowerCase() + c)] = v }
      for (k in elDataSet) { v = elDataSet[k]; normalize(k, v) }
      this.opts.width = this.opts.width ? parseInt(this.opts.width, 10) : 640
      this.opts.height = this.opts.height ? parseInt(this.opts.height, 10) : 390
      const display_ratio = this.opts.height / this.opts.width
      if (!this.opts.fullscreenAllowed && (this.opts.width > (window.innerWidth - 90))) {
        this.opts.width = window.innerWidth - 90
        this.opts.height = Math.round(display_ratio * this.opts.width)
      }
      if (this.opts.id == null) { this.opts.id = 'y-dQw4w9WgXcQ' }
      if (this.opts.id.match(/^v/)) {
        this.vendor = 'vimeo'; this.vm = true
      } else if (this.opts.id.match(/^f/)) {
        this.vendor = 'iframe'; this.ifr = true
      } else { this.vendor = 'youtube'; this.yt = true }
      window.vlData[this.vendor] = true
      this.id = this.opts.id.replace(/([vyf]-)/i, '')
      return Array.from(remap).map((key) => (this.opts[key[1]] != null ? this.opts[key[1]] : (this.opts[key[1]] = this.opts[key[0]])))
    }

    buildEls () {
      let g;
      (this.target = dom.createElement('span')).className = 'video-target'
      this.el.parentNode.insertBefore(this.target, this.el)
      this.target.appendChild(this.el)
      const bdc = _cc(_val(this.opts.bdColor, '#ddd'))
      const bdo = _val(this.opts.bdOpacity, 0.6)
      const bdbg = `background: rgba(${bdc.r}, ${bdc.g}, ${bdc.b}, ${bdo});`
      const fdim = `width: ${this.opts.width}px; height: ${this.opts.height}px;`
      const fmar = `margin-top: -${this.opts.height / 2}px; margin-left: -${this.opts.width / 2}px;`
      const fglo = `box-shadow: 0px 0px ${(g = _val(this.opts.glow, 20))}px ${g / 5}px ${_fullHex(_val(this.opts.glowColor, '#000'))};`
      const wrapCss = _boolify(this.opts.popover, false) ? _wrapCssP(this.opts.width, this.opts.height) : _wrapCss
      const xCss = `background: ${_fullHex(_val(this.opts.xBgColor, '#000'))}; color: ${_fullHex(_val(this.opts.xColor, '#fff'))}; \
border: ${_val(this.opts.xBorder, 'none')}; box-sizing: border-box;`
      const frameCss = `background: ${_fullHex(_val(this.opts.frameColor, '#000'))}; border: ${_val(this.opts.frameBorder, 'none')}; \
box-sizing: border-box;`
      this.target.insertAdjacentHTML('beforeend', _domStr({
        tag: 'div',
        attrs: {
          id: `wrap_${this.inst}`,
          class: 'video-wrapper',
          style: `${wrapCss} ${bdbg} z-index: ${_val(this.opts.zIndex, 2100)}; opacity: 0;`
        },
        children: [{
          tag: 'div',
          attrs: {
            class: 'video-frame',
            style: `${_frameCss} ${fdim} ${fmar} ${fglo}`
          },
          children: [{
            tag: 'div',
            attrs: { class: 'video' },
            children: [{
              tag: 'div',
              inner: '&times;',
              attrs: {
                id: `close_${this.inst}`,
                class: 'video-close',
                style: `float: right; margin-right: -34px; ${fglo} ${xCss} padding: 0 10px 0 12px; font-size: 25px;`
              }
            },
            {
              tag: 'iframe', // "#{if @yt then 'div' else 'iframe'}"
              attrs: {
                type: 'text/html',
                id: `iframe_${this.inst}`,
                class: 'video-iframe',
                style: `position: absolute; top: 0; left: 0; ${frameCss}`
              }
            }
            ]
          }
          ]
        }
        ]
      })
      )
      this.wrapper = dom.getElementById(`wrap_${this.inst}`)
      this.iframe = dom.getElementById(`iframe_${this.inst}`)
      return this.close = dom.getElementById(`close_${this.inst}`)
    }

    popoverPos () {
      const pos = _gravity(this.target, this.opts.width, this.opts.height, this.opts.fluidity)
      this.wrapper.style.left = `${pos.x}px`
      return this.wrapper.style.top = `${pos.y}px`
    }

    resize () {
      if (!window.vlData.throttle) {
        this.popoverPos()
        if (this.opts.throttle) {
          window.vlData.throttle = true
          const throttleOff = () => window.vlData.throttle = false
          return setTimeout(throttleOff, this.opts.throttle)
        }
      }
    }

    regEvents () {
      this.target.style.cursor = 'pointer'
      this.target.addEventListener('mouseup', this.clicked, false)
      if (_boolify(this.opts.popover, false)) {
        window.addEventListener('resize', this.resize, false)
        window.addEventListener('scroll', this.resize, false)
        window.addEventListener('orientationchange', this.resize, false)
        if (this.opts.peek) {
          this.target.addEventListener('mouseenter', this.hovered, false)
          return this.target.addEventListener('mouseleave', this.hovered, false)
        }
      }
    }

    clicked (e) {
      if (this.peeking) { return this.peek(false, true) }
      if ((e.buttons && (e.buttons !== 1)) || (e.which && (e.which !== 1)) || (e.button && (e.button !== 1))) { return }
      if (this.playing) { return this.stop() } else { return this.play() }
    }

    hovered (e) {
      if ((e.type === 'mouseenter') && !this.playing) { this.peek() }
      if ((e.type === 'mouseleave') && this.playing) { return this.peek(this.peeking) }
    }

    peek (close, pin) {
      if (close == null) { close = false }
      if (pin == null) { pin = false }
      if (!this.peeking && this.playing) { return }
      this.close.innerHTML = close || pin ? '&times;' : '&#94;'
      this.peeking = !close || pin
      if (close) { return this.stop() } else if (pin) { return null } else { return this.play() }
    }

    play () {
      if (_boolify(this.opts.popover, false)) { this.popoverPos() }
      this.show()
      if (this.ifr) {
        _setSrc(this.iframe, {
          url: encodeURI(this.id),
          attrs: {
            width: this.opts.width,
            height: this.opts.height,
            frameBorder: 0
          }
        }
        )
      } else if (this.ready && !this.playing && (this.iframe.src !== 'about:blank')) {
        if (this.yt) { this.ytPlay() }
        if (this.vm) { this.vmPlay() }
      } else if (!this.playing) {
        if (this.vm) { this.initPlayerVM() }
        if (this.yt) { this.initPlayerYT() }
      }
      this.playing = true
      if (this.clearAfter) { window.clearTimeout(this.clearAfter) }
    }

    stop (fade) {
      if (fade == null) { fade = 0 }
      if (_boolify(this.opts.rickRoll, false)) { return }
      this.hide(fade)
      if (this.ready) {
        if (this.yt) { this.ytStop() }
        if (this.vm) { this.vmStop() }
      } else {
        this.clear()
      }
      this.playing = false
      if (_boolify(this.opts.unload, true)) { this.clearAfter = window.setTimeout(this.clear, (_val(this.opts.unloadAfter) || 45) * 1000) }
    }

    clear () { this.iframe.src = 'about:blank' }

    show () { _fadeIn(this.wrapper, _val(this.opts.fadeIn, 300)) }

    hide (fade) { if (fade == null) { fade = 0 } _fadeOut(this.wrapper, _val(this.opts.fadeOut, fade)) }

    cover () { if (this.yt) { this.coverYT() } }

    initPlayerYT () {
      this.iframe.setAttribute('allowFullScreen', '')
      _setSrc(this.iframe, {
        url: `https://www.youtube.com/embed/${this.id}`,
        params: {
          enablejsapi: 1,
          autoplay: _bitify(this.opts.autoplay, 1),
          autohide: _val(this.opts.autohide, 2),
          cc_load_policy: _val(this.opts.ccLoadPolicy, 0),
          color: _val(this.opts.color, null),
          controls: _val(this.opts.controls, 2),
          disablekb: _val(this.opts.disablekb, 0),
          end: _val(this.opts.endTime, null),
          fs: _val(this.opts.fs, 1),
          hl: _val(this.opts.hl, 'en'),
          iv_load_policy: _val(this.opts.ivLoadPolicy, 1),
          list: _val(this.opts.list, null),
          listType: _val(this.opts.listType, null),
          loop: _val(this.opts.loop, 0),
          modestbranding: _val(this.opts.modestbranding, 0),
          origin: encodeURIComponent(_val(this.opts.origin, `${location.protocol}//${location.host}`)),
          playerapiid: this.inst,
          playlist: _val(this.opts.playlist, null),
          playsinline: _val(this.opts.playsinline, 0),
          rel: _val(this.opts.rel, 0),
          showinfo: _val(this.opts.showinfo, 1),
          start: _val(this.opts.startTime, 0),
          theme: _val(this.opts.theme, null)
        },
        attrs: {
          width: this.opts.width,
          height: this.opts.height,
          frameBorder: 0
        }
      }
      )
      if (window.vlData.ytAPIReady) { return this.setYTPlayer() }
    }

    setYTPlayer () {
      const ready = () => { return this.ready = true }
      return this.ytPlayer != null ? this.ytPlayer : (this.ytPlayer = new YT.Player(`iframe_${this.inst}`, {
        events: {
          onReady: ready,
          onStateChange: this.ytState
        }
      }))
    }

    ytPlay () { return this.ytPlayer.playVideo() }

    ytStop () {
      _ytReset(this.ytPlayer, this.opts.startTime)
      this.ytPlayer.stopVideo()
      this.ytPlayer.clearVideo()
      if (this.opts.startTime) { this.clear() }
    }

    ytState (e) { if ((e.data === 0) && _boolify(this.opts.autoclose, true)) { return this.stop(_val(this.opts.fadeOut, 1000)) } }

    coverYT () { this.ytCover = _coverEl(this.target, `//img.youtube.com/vi/${this.id}/hqdefault.jpg`) }

    initPlayerVM () {
      this.iframe.setAttribute('allowFullScreen', '')
      _setSrc(this.iframe, {
        url: `https://player.vimeo.com/video/${this.id}`,
        params: {
          autoplay: _bitify(this.opts.autoplay, 1),
          loop: _val(this.opts.loop, 0),
          title: _val(this.opts.showinfo, 1),
          byline: _val(this.opts.byline, 1),
          portrait: _val(this.opts.portrait, 1),
          color: _prepHex(_val(this.opts.color, '#00adef')),
          api: 1,
          player_id: this.inst
        },
        attrs: {
          width: this.opts.width,
          height: this.opts.height,
          frameBorder: 0
        }
      }
      )
      window.addEventListener('message', this.vmListen, false)
      return this.vmPlayer != null ? this.vmPlayer : (this.vmPlayer = this.iframe)
    }

    vmListen (msg) {
      const data = JSON.parse(msg.data)
      if (data.player_id !== this.inst) { return }
      switch (data.event) {
        case 'ready':
          this.ready = true
          _postToVM(this.vmPlayer, this.id, 'addEventListener', 'finish')
          break
        case 'finish': this.stop(1000); break
      }
    }

    vmPlay () { _postToVM(this.vmPlayer, this.id, 'play') }

    vmStop () {
      _postToVM(this.vmPlayer, this.id, 'pause')
      if (this.opts.startTime) { this.clear() }
    }
  }

  // HELPERS
  var _val = function (p, d) { if ([false, 'false', 0, '0'].includes(p)) { return p } else { return p || d } }
  var _bitify = function (p, d) { if ([false, 'false', 0, '0'].includes(p)) { return 0 } else if ([true, 'true', '1', 1].includes(p)) { return 1 } else { return d } }
  var _boolify = function (p, d) { if ([false, 'false', 0, '0'].includes(p)) { return false } else { return !!p || d } }
  var _domStr = function (o) {
    let attrs = ''; let children = ''
    if (o.attrs) { for (const k in o.attrs) { const v = o.attrs[k]; attrs += ` ${k}="${v}"` } }
    if (o.children) { for (const c of Array.from(o.children)) { children += _isObj(c) ? _domStr(c) : c } }
    return `<${o.tag}${attrs}>${o.inner || children}</${o.tag}>`
  }
  var _setSrc = function (el, o) {
    let k, v
    let src = `${o.url}?`
    for (k in o.params) { v = o.params[k]; if (v !== null) { src += `&${k}=${v}` } }
    el.src = src.replace(/&/, '')
    return (() => {
      const result = []
      for (k in o.attrs) {
        v = o.attrs[k]
        result.push((el[k] = v))
      }
      return result
    })()
  }
  var _extObj = function (baseObj, extObj) { for (const k in extObj) { const v = extObj[k]; baseObj[k] = v } return baseObj }
  var _isStr = obj => typeof obj === 'string'
  var _isAry = obj => obj instanceof Array
  var _isElAry = obj => obj instanceof HTMLCollection || obj instanceof NodeList
  var _isObj = obj => (obj !== null) && (typeof obj === 'object')
  var _topKeyOfObj = function (obj) { for (const k in obj) { const v = obj[k]; return k } }
  var _getEl = function (el) {
    const els = el.charAt(0) === '#' ? dom.getElementById(el.substr(1)) : dom.getElementsByClassName(el.substr(1))
    if (_isAry(els) && (els.length === 0)) { return null } else { return els }
  }
  var _randar = () => (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).substring(0, 16)
  var _prepHex = function (hex) { hex = hex.replace(/^#/, ''); if (hex.length === 3) { return `${hex}${hex}` } else { return hex } }
  var _fullHex = function (hex) { if (hex === 'transparent') { return hex } else { return `#${_prepHex(hex)}` } }
  var _cc = hex =>
    ({
      r: parseInt((_prepHex(hex)).substring(0, 2), 16),
      g: parseInt((_prepHex(hex)).substring(2, 4), 16),
      b: parseInt((_prepHex(hex)).substring(4, 6), 16)
    })

  var _wrapCss = 'display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; right: 0; bottom: 0; left: 0;'
  var _wrapCssP = (w, h) => `display: none; position: fixed; width: ${w}px; height: ${h}px;`
  var _frameCss = 'position: absolute; top: 50%; left: 50%; background: #000000;'
  const _fadeCss = (el, t) => el.style.transition = (el.style.mozTransition = (el.style.webkitTransition = `opacity ${t}ms ease`))
  var _fadeIn = function (el, t) {
    _fadeCss(el, t)
    el.style.display = 'block'
    const applyFade = () => el.style.opacity = 1
    return setTimeout(applyFade, 20)
  }
  var _fadeOut = function (el, t) {
    _fadeCss(el, t)
    el.style.opacity = 0
    const applyFade = () => el.style.display = 'none'
    return setTimeout(applyFade, t)
  }
  var _initYTAPI = function () {
    if (dom.getElementById('ytScript')) { return }
    const scriptA = dom.getElementsByTagName('script')[0]
    const vFuncs = document.createElement('script')
    vFuncs.innerHTML = 'function onYouTubeIframeAPIReady() {vlData.ytReady()};'
    scriptA.parentNode.insertBefore(vFuncs, scriptA)
    const vScript = document.createElement('script')
    vScript.id = 'ytScript'
    vScript.async = true
    vScript.src = 'https://www.youtube.com/iframe_api'
    vFuncs.parentNode.insertBefore(vScript, vFuncs.nextSibling)
  }
  var _ytReset = function (p, s) { if (s == null) { s = 0 } if ((p.getDuration() - 3) < p.getCurrentTime()) { p.pauseVideo(); p.seekTo(s, false) } }
  var _postToVM = function (player, id, k, v = null) {
    const data = v ? { method: k, value: v } : { method: k }
    return player.contentWindow.postMessage(JSON.stringify(data), `https://player.vimeo.com/video/${id}`)
  }
  var _coverEl = function (target, src) {
    const cover = dom.createElement('img')
    cover.className = 'video-cover'
    cover.src = src
    target.appendChild(cover)
    return cover
  }
  const _testEl = function () {
    let test
    if (!(test = document.getElementById('vl-size-test'))) {
      test = document.createElement('div')
      test.id = 'vl-size-test'
      test.style.cssText = 'position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;'
      document.body.appendChild(test)
    }
    return {
      width: test.offsetWidth,
      height: test.offsetHeight
    }
  }
  var _gravity = function (el, width, height, fluidity) {
    let page_height, page_width, x, y
    let asc, end, i, step
    let asc1, end1, j, step1
    if (fluidity == null) { fluidity = 30 }
    const coords = el.getBoundingClientRect()
    const center = { x: (page_width = _testEl().width) / 2, y: (page_height = _testEl().height) / 2 }
    const box_center = { x: width / 2, y: height / 2 }
    const points = []
    for (i = coords.left, x = i, end = coords.right + width, step = fluidity, asc = step > 0; asc ? i <= end : i >= end; i += step, x = i) {
      points.push([x - width, coords.top - height])
      points.push([x - width, coords.bottom])
    }
    for (j = coords.top, y = j, end1 = coords.bottom + height, step1 = fluidity, asc1 = step1 > 0; asc1 ? j <= end1 : j >= end1; j += step1, y = j) {
      points.push([coords.left - width, y - height])
      points.push([coords.right, y - height])
    }
    const sort = function (a, b) {
      let obja, objb
      for (const ary of [[a, (obja = {})], [b, (objb = {})]]) {
        var dax, day
        x = ary[0][0]
        y = ary[0][1]
        ary[1].diffx = (dax = (x + box_center.x)) > center.x ? dax - center.x : center.x - dax
        ary[1].diffy = (day = (y + box_center.y)) > center.y ? day - center.y : center.y - day
        ary[1].diff = ary[1].diffx + ary[1].diffy
        if ((x < 0) || ((x + width) > page_width)) { ary[1].diff += 10000 }
        if ((y < 0) || ((y + height) > page_height)) { ary[1].diff += 10000 }
      }
      return obja.diff - objb.diff
    }
    points.sort(sort)
    return {
      x: parseInt((((x = points[0][0]) < 0) || ((x + width) > page_width) ? center.x - box_center.x : x), 10),
      y: parseInt((((y = points[0][1]) < 0) || ((y + height) > page_height) ? center.y - box_center.y : y), 10)
    }
  }

  // INIT
  this.videoLightning = videoLightning
  this.vlData = {}
  this.vlData.instances = []
  this.vlData.ytReady = () => { return this.vlData.ytAPIReady = true }
  this.vlData.youtube = (this.vlData.vimeo = false)

  var _$ = window.$ || document.$
  if (typeof _$ !== 'undefined') {
    _$.fn.jqueryVideoLightning = function (options) {
      this.each(function () {
        if (!_$.data(this, 'plugin_jqueryVideoLightning')) {
          const inst = new VideoLightning({ el: this, opts: options })
          vlData.instances.push(inst)
          _$.data(this, 'plugin_jqueryVideoLightning', inst)
        }
      })
      return _initYTAPI()
    }

    return _$.fn.jqueryVideoLightnin
  }
})(document)
