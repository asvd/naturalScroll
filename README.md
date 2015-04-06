natural scroll
==============


Objects in real life never stop or start moving instantly. Having this
in mind, `natural scroll` performs the viewport scrolling to the
desired position if there is a need to perform it programmatically
(for instance, by selecting a menu item pointing to a section).

As it name states, `natural scroll` performs the scrolling animation
smoothly and naturally: it starts and finishes the movement with zero
speed and acceleration. If then a new scrolling target is specified,
while the previous scrolling animation has not yet completed, the new
animation is calculated so that it starts with the speed and
acceleration of the current frame of the running
animation. Nevertheless, such calculations do not increase the overall
scrolling time: the animation is pretty fast, so that users will not
probably notice the magic at all. But good design should not be
noticed, it will simply make scrolling comfortable and predictable for
a user.


You can see how `natural scroll` works on the following web-pages by
clicking the menu items:

- [Home page of intence project](http://asvd.github.io/intence);

- [Demo page](http://asvd.github.io/viewport/) for the
  [viewport.js](https://github.com/asvd/viewport) library.


`natural scroll` is a small library (1337 bytes minified) with no
dependencies written in vanilla javascript - which means it works
anywhere.

### Usage


Download the
[distribution](https://github.com/asvd/naturalScroll/releases/download/v0.0.1/naturalScroll-0.0.1.tar.gz),
unpack it and load the `naturalScroll.js` in a preferable way (that is an
UMD module):

```html
<script src="naturalScroll.js"></script>
```

Invoke the given methods to scroll a viewport to the desired position:

```js
var viewport = document.getElementById('myViewport');
var positionTop = 1000;
var positionLeft = 500;

naturalScroll.scrollTop(viewport, positionTop);
naturalScroll.scrollLeft(viewport, positionLeft);
```

The methods also support providing a third argument which is an
animation time (in msec, 600 by default), but I would not change it.

Have fun!

