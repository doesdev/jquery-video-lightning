![alt text](http://musocrat.github.io/jquery-video-lightning/images/JqueryVideoLightningIcon45.png "Video Lightning Logo") Video Lightning [![Build Status](https://travis-ci.org/musocrat/jquery-video-lightning.png)](https://travis-ci.org/musocrat/jquery-video-lightning)   [![Pinkie Pie Approval Status](http://dosowisko.net/pinkiepieapproved.svg)](https://www.youtube.com/watch?v=FULyN9Ai-A0)
======================

Turn any element into a lightbox or popover link for Youtube and Vimeo videos. 

Repo name is for posterity, Video Lightning is standalone so jQuery is optional.

### Table of Contents
- [Why](#why)    
- [How](#how)    
- [Features](#features)
- [Demos](#demos)
- [Docs](#docs)
  - [Getting Started](#getting-started)    
  - [Passing in Options](#passing-in-options)    
  - [Available Options](#available-options)
- [Changes](#changes)
- [Alternate Builds](#alternate-builds)
- [Contributing](#contributing)        

Why?
----
Lots of reasons. The main one, and the reason we built it, is for quick video explainers in the appropriate places. This little plugin bootstraps getting those helpful little videos in place.

How?
----
Simple. Add the js your project, initialize with target and options and enjoy your video lightbox enhanced element!

Features
----
- Simple access to all embed API options for both providers
- Lots of options to customize and beautify your lightboxes
- Intelligent popover auto positioning gravitates to page center
- Preview videos on hover, pin if you want them to stick around
- Lazy loading of videos prevents slow page load due to video embeds
- Rick Roll with ease (don't pass video id, add rick_roll option to prevent closing)

Demos
----
Check the [GH Project Page](http://musocrat.github.io/jquery-video-lightning/) for demos.

Docs
----

### Getting Started
**i.**  Add script where you desire *(bottom of body is recommended)*

```html
<script src="javascripts/jquery-video-lightning.js"></script>
```

**ii.**  Initialize it on the desired elements with any options you please *(options can also be passed as data attributes)*

#### Native initialization:

```html
<script>
  videoLightning({
    elements: [
      {
        ".video-link": {
          id: "y-PKffm2uI4dk",
          autoplay: true,
          color: "white"
        }
      }
    ]
  });
</script>
```

#### jQuery flavored initialization:

```html
<script>
  $(function() {
    $(".video-link").jqueryVideoLightning({
        id: "y-PKffm2uI4dk",
        autoplay: true,
        color: "white"
    });
  });
</script>
```

Alternatively, for a simple setup you could initialize on a class, set your options globally, and add video id to each el.

 ```html
<div class="video-link" data-video-id="y-PKffm2uI4dk"></div>
<div class="video-link" data-video-id="y-z-D1PJ1cMXs></div>
<script>
  videoLightning({settings: {autoplay: true, color: "white"}, element: ".video-link"});
</script>
```

### Passing in Options
Options can be passed in any of the following three ways. 

#### Options as attributes off the element object (local to element):

```javascript
videoLightning({
  elements: [
    {
      ".video-link": {
        id: "y-PKffm2uI4dk",
        width: 1280,
        height: 720
      }
    }
  ]
});
```

#### Options as attributes of the `setting` object (global, overwritten by local, doesn't apply to jQuery style init):

```javascript
videoLightning({
  settings: {
    autoplay: true,
    width: 1280,
    height: 720
  },
  elements: [
    {
      ".video-link": {
        id: "y-PKffm2uI4dk"
      }
    }
  ]
});
```

#### Options as data attributes: 

*(Note that data attributes are all prefixed with `data-video` and camel cased options should be dashed instead in data attributes. So `startTime` becomes `data-video-start-time`)*   

*IE<10 does not support `dataset` and as such the only backported settings that work with older IE versions are `id`, `width`, and `height`*   

```html
<div class="video-link" data-video-id="y-PKffm2uI4dk" data-video-width="1280" data-video-height="720"></div>
```

### Available Options
Video Lightning exposes all available basic API options for both Youtube and Vimeo. There are also a number of effect, style, and behavior options that are available. The following is the current list of available options.

#### GENERAL OPTIONS

- **id** *(String - default="y-dQw4w9WgXcQ")*  
	Vendor prefixed video id [if Youtube then prefix with y-xxxxx, if Vimeo then v-xxxxx]

- **width** *(Integer - default=640)*  
	Video width in px

- **height** *(Integer - default=390)*  
	Video height in px

- **autoplay** *(Boolean - default=true)*  
	Start playback immediately (true,false)

- **autoclose** *(Boolean - default=true)*  
	Autoclose lightbox / popover once video is complete (true,false)

- **popover** *(Boolean - default=false)*  
	Open in popover instead of lightbox (true,false)

- **peek** *(Boolean - default=false)*  
	Preview video on hover, user can click `^` to pin (true,false)

- **bdColor** *(String [hex] - default="#ddd")*  
	Color of page overlay

- **bdOpacity** *(Decimal [0 to 1] - default=0.6)*  
	Opacity of page overlay

- **frameColor** *(String [hex] - default="#000")*  
	Color of iframe video will fill

- **frameBorder** *(String [border/outline css shorthand] - default="none")*  
	Video iframe border `ex: '3px solid #555'`, *note: will change aspect ratio of video*

- **glow** *(Integer - default=20)*  
	Glow around video frame

- **glowColor** *(String [hex] - default="#000")*  
	Glow color around video frame

- **xBgColor** *(String [hex] - default="#000")*  
	Close icon background color

- **xColor** *(String [hex] - default="#fff")*  
	Close icon `×` color

- **xBorder** *(String [border/outline css shorthand] - default="none")*  
	Close icon box border `ex: '3px solid #555'`

- **fadeIn** *(Integer [ms] - default=300)*  
	Time in ms of lightbox fade in

- **fadeOut** *(Integer [ms] - default=0, 1000)*  
	Time in ms of lightbox fade out [default is 0 if closed manually, 1000 if autoclosed]

- **zIndex** *(Integer - default=2100)*  
	Z-index of page overlay

- **rickRoll** *(Boolean - default=false)*  
	Make video un-closable (true,false)

- **cover** *(Boolean - default=false)*  
	Display cover image (true,false)

- **unload** *(Boolean - default=true)*  
	Unload video iframe X seconds after it is closed

- **unloadAfter** *(Integer [s] - default=45)*  
	Time in seconds to wait after closing before unloading

- **fluidity** *(Integer - default=30)*  
	Number of steps popover should move in on resize events. Lower is smoother, higher is faster

- **throttle** *(Integer [ms] - default=null)*  
	Rate limit resize events. Reduces redraws on resizing, lowers accuracy / smoothness of repositioning

#### VENDOR OPTIONS

Some of Youtube's options are not listed below, but everything on their params page (as of 3/15/15) is available.
[Youtube Params Reference](https://developers.google.com/youtube/player_parameters)

- **autohide** *(default=2)*  
	Y: auto hide controls after video load (0,1,2)

- **controls** *(default=1)*  
	Y: display controls (0,1,2)

- **ivLoadPolicy** *(default=1)*  
	Y: display annotations (1,3)

- **ccLoadPolicy** *(default=null)*  
	Y: display closed captions by default (null,1)

- **loop** *(default=0)*  
	Y&V: loop video playback (0,1)

- **modestbranding** *(default=0)*  
	Y: hide large Youtube logo (0,1)

- **playlist** *(default="")*  
	Y: comma-separated list of video IDs to play (ex. "WkgWvaFrJv8,VZPxHUpdAGw")

- **related** *(default=0)*  
	Y: show related videos when playback is finished (0,1)

- **showinfo** *(default=1)*  
	Y: display title, uploader (0,1)  V: display title (0,1)

- **startTime** *(default=0)*  
	Y: playback start position in seconds (ex. "132" starts at 2mins, 12secs)

- **endTime** *(default=0)*  
	Y: playback end position in seconds (ex. "132" ends at 2mins, 12secs)

- **theme** *(default="dark")*  
	Y: player theme ("dark","light")

- **color** *(default="")*  
	Y: player controls color ("red","white") V: player controls color (hex code default is "#00adef")

- **byline** *(default=1)*  
	V: display byline (0,1)

- **portrait** *(default=1)*  
	V: display user's portrait (0,1)

Changes
----

### Patch [3.0.5]
- [BUGFIX] backport `id`, `width`, and `height` data-attribute specification to work with IE<10
- [BUGFIX] use CSS `border` property for borders instead of `outline` (note, will change aspect ratio if `frameBorder` enabled)

### Patch [3.0.4]
- [FEATURE] added options for iframe background color `frameColor`, iframe border `frameBorder`, close button border `xBorder`

### Patch [3.0.3]
- [BUG FIX] corrects bug preventing initializing on element by id rather than class 
- [FEATURE] by request bare iframe option was added for embedding a webpage in a VL driven iframe
  - usage: set vendor + video id to `'f-{url}'`, for example `'f-http://musocrat.github.io/jquery-video-lightning/'`

### General Updates [3.0]
- complete re-write removing the dependency on jQuery while still supporting jQuery initialization
- using full iframe API's for Youtube and Vimeo for event handling and interaction
- adds option to `autoclose` on video end
- adds `peek` option to preview video on hover with ability to pin popover
- enhanced gravity function improves popover positioning performance and smoothness

### New Options [3.0]
- **peek**
- **autoclose**
- **unload**
- **unloadAfter**
- **fluidity**
- **throttle**
- **xBgColor**
- **xColor**

### Changed Defaults [3.0]
- **bdColor**: '#000' => '#ddd'
- **bdOpacity**: 1.0 => 0.6
- **glow**: 0 => 20
- **glowColor**: '#fff' => '#000'

### Changed Parameters [3.0]
- **width**: (pixel string w/ px suffix) => (pixel integer)
- **height**: (pixel string w/ px suffix) => (pixel integer)
- **autoplay**: (1,0) => (true,false)
- **popover**: (1,0) => (true,false)
- **rickRoll**: (1,0) => (true,false)
- **cover**: (1,0) => (true,false)

### Renamed Options [3.0]
- **backdrop_color** => **bdColor**
- **backdrop_opacity** => **bdOpacity**
- **ease_in** => **fadeIn**
- **ease_out** => **fadeOut**
- **glow_color** => **glowColor**
- **start_time** => **startTime**
- **z_index** => **zIndex**
- **rick_roll** => **rickRoll**
- **iv_load_policy** => **ivLoadPolicy**

### Deprecated Options [3.0]
- **popover_x**
- **popover_y**

Alternate Builds
----
[2.0.1 minified](https://github.com/musocrat/jquery-video-lightning/blob/b0b2218812d4a2f9bd37f9262f7efb227088dc0e/dist/jquery-video-lightning.min.js) (latest jQuery only build) (8.514 kb)  
[2.0.1 Docs](https://github.com/musocrat/jquery-video-lightning/blob/b0b2218812d4a2f9bd37f9262f7efb227088dc0e/README.md)

[1.1.0 minified](https://github.com/musocrat/jquery-video-lightning/blob/87c0b9370dd3ea3ad09a82541ad295a543139e32/dist/jquery-video-lightning.min.js) (pre-popover, lightbox only) (4.646 kb)  
[1.1.0 Docs](https://github.com/musocrat/jquery-video-lightning/blob/736846ef61a9e7f8d0c85f362ab791b19986ce1f/README.md)

Contributing
----
1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Added some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request


----
author: Andrew Carpenter, on behalf of the [musocrat](http://www.musocrat.com) team
