
natural scroll
==============

Objects in real life never stop or start moving instantly. Having this
in mind, `natural scroll` performs the viewport scrolling smoothly and
naturally: it starts and finishes the movement with zero speed and
acceleration. If another scrolling target is specified while currently
running animation has not yet finished, `natural scroll` recalculates
the remaining animation frames, so that the scrolling still continues
smoothly, but reaches the new destination. The animation does not look
slower, it just feels *better*. The user may not even notice the magic
at all, but a good design should not be noticed. For him the scrolling
becomes natural, comfortable and predictable.

You can see how `natural scroll` works on the following web-pages
(click the menu items there and carefully watch how the page is
scrolled):

- [Home page of the intence project](http://asvd.github.io/intence)

- [Demo page](http://asvd.github.io/viewport/) for the
  [viewport.js](https://github.com/asvd/viewport) library

`natural scroll` is a micro library (only 735 bytes minified!) with no
dependencies written in vanilla javascript - which means it works
anywhere.


### Usage

Download the
[distribution](https://github.com/asvd/naturalScroll/releases/download/v0.1.0/naturalScroll-0.1.0.tar.gz),
unpack it and load the `naturalScroll.js` in a preferable way (that is
an UMD module):

```html
<script src="naturalScroll.js"></script>
```


Invoke the provided methods to scroll a viewport to the desired
position:

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


