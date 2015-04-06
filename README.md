natural scroll
==============


Objects in real life never stop or start moving instantly. Having this
in mind, `natural scroll` performs the viewport scrolling to the
desired position programmatically when there is such a need (for
instance, by selecting a menu item pointing to a section).

As it name states, `natural scroll` performs the scrolling animation
smoothly and naturally: it starts and finishes the movement with zero
speed and acceleration. If then a running animation has not yet
completed, but a new scrolling target is specified, `natural scroll`
calculates the new animation frames so that the starting speed and
acceleration correspond to the current frame of the running
animation. Nevertheless, such calculations do not increase the overall
scrolling time: the animation is pretty fast, so that users will not
probably notice the magic at all. But good design should not be
noticed: it simply makes scrolling comfortable and predictable for a
user.


You can see how `natural scroll` works on the following web-pages
(click the menu items there and carefully watch how scrolling is
performed):

- [Home page of the intence project](http://asvd.github.io/intence);

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

You can also provide the third argument which is an animation time (in
msec, 600 by default), but I would not change it.

Have fun!


