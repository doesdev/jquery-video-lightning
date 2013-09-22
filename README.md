![alt text](http://musocrat.github.io/jquery-video-lightning/images/JqueryVideoLightningIcon45.png "jQuery Video Lightning Logo") jQuery Video Lightning 
======================

Simple jQuery plugin that turns any element into a lightbox link for Youtube and Vimeo videos.

### Table of Contents
- [Why](#why)    
- [How](#how)    
- [Demos](#demos)    
- [Docs](#docs)
  - [Getting Started](#getting-started)    
  - [Passing in Options](#passing-in-options)    
  - [Available Options](#available-options)
- [ToDo](#todo)           
- [Contributing](#contributing)        

Why?
----
Lots of reasons. The main one, and the reason we built it, is for quick video explainers in the appropriate places. This little plugin bootstraps getting those helpful little videos in place.

How?
----
Simple. Add the js and css to your project (along with jQuery), add the appropriate data atrributes like so `data-video-id="y-XbTtgr8J8uU"`, then initialize on the target and enjoy your video lightbox enhanced element!

Demos
----
Check the [GH Project Page](http://musocrat.github.io/jquery-video-lightning/) for demos.

Docs
----

### Getting Started
**i.**   Add stylesheet in head
```html
<link rel="stylesheet" href="stylesheets/jquery-video-lightning-page.css">
```
**ii.**  Add script where you desire *(bottom of body is recommended)*
```html
<script src="javascripts/jquery-video-lightning.js"></script>
```
**iii.** Add vendor prefixed video id to target element *(i.e. Youtube:* `data-video-id="y-PKffm2uI4dk"`, *Vimeo:* `data-video-id="v-29749357"`)
```html
<span class="video-link" data-video-id="y-PKffm2uI4dk">Youtube</span>
```
**iv.**  Initialize it on the desired elements with any options you please *(options can also be passed as data attributes)*
```html
<script>
    $(function() {
        $(".video-link").jqueryVideoLightning({
            autoplay: 1,
            color: "white"
        });
    });
</script>
```

### Passing in Options
Options can be passed in either of two ways. They can be passed in the initialization like so:
```javascript
$(function() {
    $(".video-link").jqueryVideoLightning({
        width: "1280px",
        height: "720px",
        autoplay: 1
    });
});
```
Or they can be passed as data attributes: *(Note that data attributes are all prefixed with `data-video` and underscored options should be dashed instead in data attributes. So `start_time` becomes `data-video-start-time`)*
```html
<div class="video-link" data-video-id="y-PKffm2uI4dk" data-video-width="1280px" data-video-height="720px" data-video-autoplay="1" ></div>
```

### Available Options
jQuery Video Lightning exposes all available basic API options for both Youtube and Vimeo. There are also a number of effect and behavior options that are available or will soon be added. The following is the current list of available options.

- **width** *(default="640px")*
	Y&V: video width in px
- **height** *(default="390px")*
	Y&V: video height in px
- **autoplay** *(default=0)*
	Y&V: start playback immediately (0,1)
- **autohide** *(default=2)*
	Y: auto hide controls after video load (0,1,2)
- **controls** *(default=1)*
	Y: display controls (0,1,2)
- **iv_load_policy** *(default=1)*
	Y: display annotations (1,3)
- **loop** *(default=0)*
	Y&V: loop video playback (0,1)
- **modestbranding** *(default=0)*
	Y: hide large Youtube logo (0,1)
- **playlist** *(default="")*
	Y: comma-separated list of video IDs to play
- **related** *(default=0)*
	Y: show related videos when playback id finished (0,1)
- **showinfo** *(default=1)*
	Y: display title, uploader (0,1)  V: display title (0,1)
- **start_time** *(default=0)*
	Y: playback start position in seconds (ex. "132" starts at 2mins, 12secs)
- **theme** *(default="dark")*
	Y: player theme ("dark","light")
- **color** *(default="")*
	Y: player controls color ("red","white") V: player controls color (hex code default is "#00adef")
- **byline** *(default=1)*
	V: display byline (0,1)
- **portrait** *(default=1)*
	V: display user's portrait (0,1)
- **ease_in** *(default=300)*
	Time in ms of lightbox fade in
- **ease_out** *(default=1)*
	Time in ms of lightbox fade out
- **backdrop_color** *(default="#000")*
	Color of page overlay
- **backdrop_opacity** *(default=1)*
	Opacity of page overlay
- **glow** *(default=0)*
	Glow around video frame
- **glow_color** *(default="#fff")*
	Glow color around video frame

ToDo
----
1. Add popover option in addition to lightbox
2. Add auto close option

Contributing
----
1. Fork it
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Added some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request


----
author: Andrew Carpenter, on behalf of the [musocrat](http://www.musocrat.com) team
