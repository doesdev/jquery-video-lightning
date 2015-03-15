(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(document) {
    var VideoLightning, dom, videoLightning, _boolify, _cc, _coverEl, _domStr, _extObj, _fadeCss, _fadeIn, _fadeOut, _frameCss, _fullHex, _getEl, _gravity, _initYTAPI, _isAry, _isElAry, _isObj, _isStr, _postToVM, _prepHex, _randar, _testEl, _topKeyOfObj, _val, _wrapCss, _wrapCssP, _ytReset,
      _this = this;
    dom = document;
    videoLightning = function(obj) {
      var de, domEls, e, el, els, noElErr, optEls, pushRawEls, rawEls, settings, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      noElErr = function() {
        console.error('VideoLightning was initialized without elements.');
      };
      optEls = obj.elements || obj.element;
      if (!optEls) {
        return noElErr();
      }
      rawEls = [];
      els = [];
      pushRawEls = function(e) {
        var el;
        if (_isStr(e)) {
          return rawEls.push({
            el: e,
            opts: null
          });
        } else {
          el = _topKeyOfObj(e);
          return rawEls.push({
            el: el,
            opts: e[el] || null
          });
        }
      };
      if (_isAry(optEls)) {
        for (_i = 0, _len = optEls.length; _i < _len; _i++) {
          e = optEls[_i];
          pushRawEls(e);
        }
      } else {
        pushRawEls(optEls);
      }
      for (_j = 0, _len1 = rawEls.length; _j < _len1; _j++) {
        el = rawEls[_j];
        if ((domEls = _getEl(el.el))) {
          if (_isElAry(domEls)) {
            for (_k = 0, _len2 = domEls.length; _k < _len2; _k++) {
              de = domEls[_k];
              els.push({
                el: de,
                opts: el.opts
              });
            }
          } else {
            els.push({
              el: domEls
            }, el.opts);
          }
        }
      }
      if (els.length === 0) {
        return noElErr();
      }
      settings = obj.settings || {};
      for (_l = 0, _len3 = els.length; _l < _len3; _l++) {
        el = els[_l];
        _this.vlData.instances.push(new VideoLightning(el, settings));
      }
      _initYTAPI();
    };
    VideoLightning = (function() {
      function VideoLightning(elObj, opts) {
        this.elObj = elObj;
        this.vmStop = __bind(this.vmStop, this);
        this.vmPlay = __bind(this.vmPlay, this);
        this.vmListen = __bind(this.vmListen, this);
        this.initPlayerVM = __bind(this.initPlayerVM, this);
        this.coverYT = __bind(this.coverYT, this);
        this.ytState = __bind(this.ytState, this);
        this.ytStop = __bind(this.ytStop, this);
        this.ytPlay = __bind(this.ytPlay, this);
        this.initPlayerYT = __bind(this.initPlayerYT, this);
        this.cover = __bind(this.cover, this);
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        this.stop = __bind(this.stop, this);
        this.play = __bind(this.play, this);
        this.peek = __bind(this.peek, this);
        this.hovered = __bind(this.hovered, this);
        this.clicked = __bind(this.clicked, this);
        this.regEvents = __bind(this.regEvents, this);
        this.resize = __bind(this.resize, this);
        this.popoverPos = __bind(this.popoverPos, this);
        this.buildEls = __bind(this.buildEls, this);
        this.buildOpts = __bind(this.buildOpts, this);
        this.opts = _extObj({}, opts);
        this.inst = _randar();
        this.el = this.elObj.el;
        this.buildOpts();
        this.buildEls();
        if (_boolify(this.opts.cover, false)) {
          this.cover();
        }
        if (this.vm) {
          this.initPlayerVM();
        }
      }

      VideoLightning.prototype.buildOpts = function() {
        var elDataSet, k, normalize, v, _base;
        _extObj(this.opts, this.elObj.opts);
        elDataSet = this.el.dataset;
        normalize = function(k, v) {
          return this.opts[k.replace(/^video(.)(.*)/, function(a, b, c) {
            return b.toLowerCase() + c;
          })] = v;
        };
        for (k in elDataSet) {
          v = elDataSet[k];
          normalize(k, v);
        }
        this.opts.width = this.opts.width ? parseInt(this.opts.width, 10) : 640;
        this.opts.height = this.opts.height ? parseInt(this.opts.height, 10) : 390;
        if ((_base = this.opts).id == null) {
          _base.id = 'y-dQw4w9WgXcQ';
        }
        if (this.opts.id.match(/^v/)) {
          this.vendor = 'vimeo';
          this.vm = true;
        } else {
          this.vendor = 'youtube';
          this.yt = true;
        }
        window.vlData[this.vendor] = true;
        return this.id = this.opts.id.replace(/([vy]-)/i, '');
      };

      VideoLightning.prototype.buildEls = function() {
        var bdbg, bdc, bdo, fdim, fglo, fmar, g, wrapCss, xCss;
        (this.target = dom.createElement('span')).className = 'video-target';
        this.el.parentNode.insertBefore(this.target, this.el);
        this.target.appendChild(this.el);
        bdc = _cc(_val(this.opts.bdColor, '#ddd'));
        bdo = _val(this.opts.bdOpacity, 0.6);
        bdbg = "background: rgba(" + bdc.r + ", " + bdc.g + ", " + bdc.b + ", " + bdo + ")};";
        fdim = "width: " + this.opts.width + "px; height: " + this.opts.height + "px;";
        fmar = "margin-top: -" + (this.opts.height / 2) + "px; margin-left: -" + (this.opts.width / 2) + "px;";
        fglo = "box-shadow: 0px 0px " + (g = _val(this.opts.glow, 20)) + "px " + (g / 5) + "px " + (_fullHex(_val(this.opts.glowColor, '#000'))) + ";";
        wrapCss = this.opts.popover ? _wrapCssP(this.opts.width, this.opts.height) : _wrapCss;
        if (this.opts.popover) {
          xCss = "background: " + (_fullHex(_val(this.opts.xBgColor, '#000'))) + "; color: " + (_fullHex(_val(this.opts.xColor, '#fff'))) + ";";
        } else {
          xCss = 'display: none;';
        }
        this.target.insertAdjacentHTML('beforeend', _domStr({
          tag: 'div',
          attrs: {
            id: "wrap_" + this.inst,
            "class": 'video-wrapper',
            style: "" + wrapCss + " " + bdbg + " z-index: " + (_val(this.opts.zIndex, 2100)) + "; opacity: 0;"
          },
          children: [
            {
              tag: 'div',
              attrs: {
                "class": 'video-frame',
                style: "" + _frameCss + " " + fdim + " " + fmar + " " + fglo
              },
              children: [
                {
                  tag: 'div',
                  attrs: {
                    "class": 'video'
                  },
                  children: [
                    {
                      tag: "" + (this.yt ? 'div' : 'iframe'),
                      attrs: {
                        id: "iframe_" + this.inst,
                        "class": 'video-iframe'
                      }
                    }
                  ]
                }
              ]
            }, {
              tag: 'div',
              inner: '&times;',
              attrs: {
                id: "close_" + this.inst,
                "class": 'video-close',
                style: "float: right; margin-right: -34px; " + fglo + " " + xCss + " padding: 0 10px 0 12px; font-size: 25px;"
              }
            }
          ]
        }));
        this.wrapper = dom.getElementById("wrap_" + this.inst);
        this.iframe = dom.getElementById("iframe_" + this.inst);
        return this.close = dom.getElementById("close_" + this.inst);
      };

      VideoLightning.prototype.popoverPos = function() {
        var pos;
        pos = _gravity(this.target, this.opts.width, this.opts.height, this.opts.fluidity);
        this.wrapper.style.left = "" + pos.x + "px";
        return this.wrapper.style.top = "" + pos.y + "px";
      };

      VideoLightning.prototype.resize = function() {
        var throttleOff;
        if (!window.vlData.throttle) {
          this.popoverPos();
          if (this.opts.throttle) {
            window.vlData.throttle = true;
            throttleOff = function() {
              return window.vlData.throttle = false;
            };
            return setTimeout(throttleOff, this.opts.throttle);
          }
        }
      };

      VideoLightning.prototype.regEvents = function() {
        this.target.style.cursor = 'pointer';
        this.target.addEventListener('mouseup', this.clicked, false);
        if (this.opts.popover) {
          window.addEventListener('resize', this.resize, false);
          window.addEventListener('scroll', this.resize, false);
          window.addEventListener('orientationchange', this.resize, false);
          if (this.opts.peek) {
            this.target.addEventListener('mouseenter', this.hovered, false);
            return this.target.addEventListener('mouseleave', this.hovered, false);
          }
        }
      };

      VideoLightning.prototype.clicked = function(e) {
        if (this.peeking) {
          return this.peek(false, true);
        }
        if ((e.buttons && e.buttons !== 1) || (e.which && e.which !== 1) || (e.button && e.button !== 1)) {
          return;
        }
        if (this.playing) {
          return this.stop();
        } else {
          return this.play();
        }
      };

      VideoLightning.prototype.hovered = function(e) {
        if (e.type === 'mouseenter' && !this.playing) {
          this.peek();
        }
        if (e.type === 'mouseleave' && this.playing) {
          return this.peek(this.peeking);
        }
      };

      VideoLightning.prototype.peek = function(close, pin) {
        if (close == null) {
          close = false;
        }
        if (pin == null) {
          pin = false;
        }
        if (!this.peeking && this.playing) {
          return;
        }
        this.close.innerHTML = close || pin ? '&times;' : '&#94;';
        this.peeking = !!!(close || pin);
        if (close) {
          return this.stop();
        } else if (pin) {
          return null;
        } else {
          return this.play();
        }
      };

      VideoLightning.prototype.play = function() {
        if (this.opts.popover) {
          this.popoverPos();
        }
        this.show();
        if (_boolify(this.opts.autoplay, true)) {
          if (this.yt) {
            this.ytPlay();
          }
          if (this.vm) {
            this.vmPlay();
          }
        }
        this.playing = true;
      };

      VideoLightning.prototype.stop = function(fade) {
        if (fade == null) {
          fade = 0;
        }
        this.hide(fade);
        if (this.yt) {
          this.ytStop();
        }
        if (this.vm) {
          this.vmStop();
        }
        this.playing = false;
      };

      VideoLightning.prototype.show = function() {
        _fadeIn(this.wrapper, _val(this.opts.fadeIn, 300));
      };

      VideoLightning.prototype.hide = function(fade) {
        if (fade == null) {
          fade = 0;
        }
        _fadeOut(this.wrapper, _val(this.opts.fadeOut, fade));
      };

      VideoLightning.prototype.cover = function() {
        if (this.yt) {
          this.coverYT();
        }
      };

      VideoLightning.prototype.initPlayerYT = function() {
        return this.ytPlayer = new YT.Player("iframe_" + this.inst, {
          width: this.opts.width,
          height: this.opts.height,
          videoId: this.id,
          playerVars: {
            'enablejsapi': 1,
            'autoplay': 0,
            'autohide': _val(this.opts.autohide, 2),
            'cc_load_policy': _val(this.opts.ccLoadPolicy, 0),
            'color': _val(this.opts.color, null),
            'controls': _val(this.opts.controls, 2),
            'disablekb': _val(this.opts.disablekb, 0),
            'end': _val(this.opts.endTime, null),
            'fs': _val(this.opts.fs, 1),
            'hl': _val(this.opts.hl, 'en'),
            'iv_load_policy': _val(this.opts.ivLoadPolicy, 1),
            'list': _val(this.opts.list, null),
            'listType': _val(this.opts.listType, null),
            'loop': _val(this.opts.loop, 0),
            'modestbranding': _val(this.opts.modestbranding, 0),
            'origin': _val(this.opts.origin, "" + location.protocol + "//" + location.host),
            'playerapiid': this.inst,
            'playlist': _val(this.opts.playlist, null),
            'playsinline': _val(this.opts.playsinline, 0),
            'rel': _val(this.opts.rel, 0),
            'showinfo': _val(this.opts.showinfo, 1),
            'start': _val(this.opts.startTime, 0),
            'theme': _val(this.opts.theme, null)
          },
          events: {
            'onReady': this.regEvents,
            'onStateChange': this.ytState
          }
        });
      };

      VideoLightning.prototype.ytPlay = function() {
        return this.ytPlayer.playVideo();
      };

      VideoLightning.prototype.ytStop = function() {
        _ytReset(this.ytPlayer, this.opts.startTime);
        this.ytPlayer.stopVideo();
        return this.ytPlayer.clearVideo();
      };

      VideoLightning.prototype.ytState = function(e) {
        if (e.data === 0 && _boolify(this.opts.autoclose, true)) {
          return this.stop(_val(this.opts.fadeOut, 1000));
        }
      };

      VideoLightning.prototype.coverYT = function() {
        this.ytCover = _coverEl(this.target, "//img.youtube.com/vi/" + this.id + "/hqdefault.jpg");
      };

      VideoLightning.prototype.initPlayerVM = function() {
        var src;
        src = ("http://player.vimeo.com/video/" + this.id + "?") + "autoplay=0&" + ("loop=" + (_val(this.opts.loop, 0)) + "&title=" + (_val(this.opts.showinfo, 1)) + "&") + ("byline=" + (_val(this.opts.byline, 1)) + "&") + ("portrait=" + (_val(this.opts.portrait, 1)) + "&") + ("color=" + (_prepHex(_val(this.opts.color, '#00adef')))) + ("api=1&player_id=" + this.inst);
        this.iframe.setAttribute('allowFullScreen', '1');
        this.iframe.width = this.opts.width;
        this.iframe.height = this.opts.height;
        this.iframe.frameBorder = 0;
        this.iframe.src = src;
        window.addEventListener('message', this.vmListen, false);
        return this.vmPlayer = this.iframe;
      };

      VideoLightning.prototype.vmListen = function(msg) {
        var data;
        data = JSON.parse(msg.data);
        if (data.player_id !== this.inst) {
          return;
        }
        switch (data.event) {
          case 'ready':
            this.regEvents();
            _postToVM(this.vmPlayer, this.id, 'addEventListener', 'finish');
            break;
          case 'finish':
            this.stop(1000);
        }
      };

      VideoLightning.prototype.vmPlay = function() {
        _postToVM(this.vmPlayer, this.id, 'play');
      };

      VideoLightning.prototype.vmStop = function() {
        _postToVM(this.vmPlayer, this.id, 'pause');
      };

      return VideoLightning;

    })();
    _val = function(p, d) {
      if (p === false || p === 'false' || p === 0 || p === '0') {
        return p;
      } else {
        return p || d;
      }
    };
    _boolify = function(p, d) {
      if (p === false || p === 'false' || p === 0 || p === '0') {
        return false;
      } else {
        return !!p || d;
      }
    };
    _domStr = function(o) {
      var attrs, c, children, k, v, _i, _len, _ref, _ref1;
      attrs = '';
      children = '';
      if (o.attrs) {
        _ref = o.attrs;
        for (k in _ref) {
          v = _ref[k];
          attrs += ' ' + k + '="' + v + '"';
        }
      }
      if (o.children) {
        _ref1 = o.children;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          c = _ref1[_i];
          children += _isObj(c) ? _domStr(c) : c;
        }
      }
      return '<' + o.tag + attrs + '>' + (o.inner || children) + '</' + o.tag + '>';
    };
    _extObj = function(baseObj, extObj) {
      var k, v;
      for (k in extObj) {
        v = extObj[k];
        baseObj[k] = v;
      }
      return baseObj;
    };
    _isStr = function(obj) {
      return typeof obj === 'string';
    };
    _isAry = function(obj) {
      return obj instanceof Array;
    };
    _isElAry = function(obj) {
      return obj instanceof HTMLCollection;
    };
    _isObj = function(obj) {
      return obj !== null && typeof obj === 'object';
    };
    _topKeyOfObj = function(obj) {
      var k, v;
      for (k in obj) {
        v = obj[k];
        return k;
      }
    };
    _getEl = function(el) {
      var els;
      els = el.charAt(0) === '#' ? dom.getElementById(el.substr(1)) : dom.getElementsByClassName(el.substr(1));
      if (_isAry(els) && els.length === 0) {
        return null;
      } else {
        return els;
      }
    };
    _randar = function() {
      return (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).substring(0, 16);
    };
    _prepHex = function(hex) {
      hex = hex.replace(/^#/, '');
      if (hex.length === 3) {
        return "" + hex + hex;
      } else {
        return hex;
      }
    };
    _fullHex = function(hex) {
      return "#" + _prepHex(hex);
    };
    _cc = function(hex) {
      return {
        r: parseInt((_prepHex(hex)).substring(0, 2), 16),
        g: parseInt((_prepHex(hex)).substring(2, 4), 16),
        b: parseInt((_prepHex(hex)).substring(4, 6), 16)
      };
    };
    _wrapCss = 'display: none; position: fixed; min-width: 100%; min-height: 100%; top: 0; right: 0; bottom: 0; left: 0;';
    _wrapCssP = function(w, h) {
      return "display: none; position: fixed; width: " + w + "px; height: " + h + "px;";
    };
    _frameCss = 'position: absolute; top: 50%; left: 50%; background: #000000;';
    _fadeCss = function(el, t) {
      return el.style.transition = el.style.mozTransition = el.style.webkitTransition = "opacity " + t + "ms ease";
    };
    _fadeIn = function(el, t) {
      var applyFade;
      _fadeCss(el, t);
      el.style.display = 'block';
      applyFade = function() {
        return el.style.opacity = 1;
      };
      return setTimeout(applyFade, 20);
    };
    _fadeOut = function(el, t) {
      var applyFade;
      _fadeCss(el, t);
      el.style.opacity = 0;
      applyFade = function() {
        return el.style.display = 'none';
      };
      return setTimeout(applyFade, t);
    };
    _initYTAPI = function() {
      var scriptA, vFuncs, vScript;
      if (dom.getElementById('ytScript')) {
        return;
      }
      scriptA = dom.getElementsByTagName('script')[0];
      vFuncs = document.createElement('script');
      vFuncs.innerHTML = 'function onYouTubeIframeAPIReady() {vlData.ytReady()};';
      scriptA.parentNode.insertBefore(vFuncs, scriptA);
      vScript = document.createElement('script');
      vScript.id = 'ytScript';
      vScript.async = true;
      vScript.src = '//www.youtube.com/iframe_api';
      vFuncs.parentNode.insertBefore(vScript, vFuncs.nextSibling);
    };
    _ytReset = function(p, s) {
      if (s == null) {
        s = 0;
      }
      if ((p.getDuration() - 3) < p.getCurrentTime()) {
        p.pauseVideo();
        p.seekTo(s, false);
      }
    };
    _postToVM = function(player, id, k, v) {
      var data;
      if (v == null) {
        v = null;
      }
      data = v ? {
        method: k,
        value: v
      } : {
        method: k
      };
      return player.contentWindow.postMessage(JSON.stringify(data), "http://player.vimeo.com/video/" + id);
    };
    _coverEl = function(target, src) {
      var cover;
      cover = dom.createElement('img');
      cover.className = 'video-link';
      cover.src = src;
      target.appendChild(cover);
      return cover;
    };
    _testEl = function() {
      var test;
      if (!(test = document.getElementById('vl-size-test'))) {
        test = document.createElement("div");
        test.id = 'vl-size-test';
        test.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;visibility:hidden;";
        document.body.appendChild(test);
      }
      return {
        width: test.offsetWidth,
        height: test.offsetHeight
      };
    };
    _gravity = function(el, width, height, fluidity) {
      var box_center, center, coords, page_height, page_width, points, sort, x, y, _i, _j, _ref, _ref1, _ref2, _ref3;
      if (fluidity == null) {
        fluidity = 30;
      }
      coords = el.getBoundingClientRect();
      center = {
        x: (page_width = _testEl().width) / 2,
        y: (page_height = _testEl().height) / 2
      };
      box_center = {
        x: width / 2,
        y: height / 2
      };
      points = [];
      for (x = _i = _ref = coords.left, _ref1 = coords.right + width; fluidity > 0 ? _i <= _ref1 : _i >= _ref1; x = _i += fluidity) {
        points.push([x - width, coords.top - height]);
        points.push([x - width, coords.bottom]);
      }
      for (y = _j = _ref2 = coords.top, _ref3 = coords.bottom + height; fluidity > 0 ? _j <= _ref3 : _j >= _ref3; y = _j += fluidity) {
        points.push([coords.left - width, y - height]);
        points.push([coords.right, y - height]);
      }
      sort = function(a, b) {
        var ary, dax, day, obja, objb, _k, _len, _ref4;
        _ref4 = [[a, obja = {}], [b, objb = {}]];
        for (_k = 0, _len = _ref4.length; _k < _len; _k++) {
          ary = _ref4[_k];
          x = ary[0][0];
          y = ary[0][1];
          ary[1].diffx = (dax = x + box_center.x) > center.x ? dax - center.x : center.x - dax;
          ary[1].diffy = (day = y + box_center.y) > center.y ? day - center.y : center.y - day;
          ary[1].diff = ary[1].diffx + ary[1].diffy;
          if (x < 0 || x + width > page_width) {
            ary[1].diff += 10000;
          }
          if (y < 0 || y + height > page_height) {
            ary[1].diff += 10000;
          }
        }
        return obja.diff - objb.diff;
      };
      points.sort(sort);
      return {
        x: parseInt(((x = points[0][0]) < 0 || x + width > page_width ? center.x - box_center.x : x), 10),
        y: parseInt(((y = points[0][1]) < 0 || y + height > page_height ? center.y - box_center.y : y), 10)
      };
    };
    this.videoLightning = videoLightning;
    this.vlData = {};
    this.vlData.instances = [];
    this.vlData.ytReady = function() {
      var i, _i, _len, _ref, _results;
      _ref = _this.vlData.instances.filter(function(i) {
        return i.vendor === 'youtube';
      });
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(i.initPlayerYT());
      }
      return _results;
    };
    this.vlData.youtube = this.vlData.vimeo = false;
    if (typeof $ !== 'undefined') {
      return $.fn.jqueryVideoLightning = function(options) {
        this.each(function() {
          var inst;
          if (!$.data(this, 'plugin_jqueryVideoLightning')) {
            inst = new VideoLightning({
              el: this,
              opts: options
            });
            vlData.instances.push(inst);
            $.data(this, 'plugin_jqueryVideoLightning', inst);
          }
        });
        return _initYTAPI();
      };
    }
  })(document);

}).call(this);
