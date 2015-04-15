
natural scroll
==============

Objects in real life never stop or start moving instantly. Having this
in mind, `natural scroll` performs scrolling smoothly and naturally:
it starts and finishes the movement with zero speed and
acceleration. If another scrolling target is specified during an
animation still running, `natural scroll` recalculates the remaining
animation frames, so that the scrolling continues smoothly and reaches
the new destination. The slowdowns and accelerations do not make the
animation look slower. The scrolling just *feels better*. A user may
not even notice the magic at all, but a good design should not be
noticed. For him the scrolling becomes natural, comfortable and
predictable.

You can see how `natural scroll` works on the following web-pages
(click the menu items there and carefully watch how the page is
scrolled):

- [Home page of the intence project](http://asvd.github.io/intence)

- [Demo page](http://asvd.github.io/viewport/) for the
  [viewport.js](https://github.com/asvd/viewport) library


`natural scroll` has flexible FPS. Which means if a system is too slow
(or a web-page is too overdesigned), `natural scroll` skips some of
the frames, preserving the total time of animation. Therefore the
destination scrolling position is reached on time and users do not
have to wait any longer. Of course on faster systems the animation is
more fluent.

`natural scroll` does not have any dependencies, it is written in
vanilla javascript which means it works anywhere. And it *only costs
752 bytes* of minified code including the UMD-headers!


### Usage

Using `natural scroll` is very simple. Download the
[distribution](https://github.com/asvd/naturalScroll/releases/download/v0.2.0/naturalScroll-0.2.0.tar.gz),
unpack it and load the `naturalScroll.js` module in a preferable way:

```html
<script src="naturalScroll.js"></script>
```


Invoke the following methods to scroll a viewport to the desired
position:

```js
// element to scroll, can be document.body
var viewport = document.getElementById('myViewport');
var positionTop = 1000;
var positionLeft = 500;

naturalScroll.scrollTop(viewport, positionTop);
naturalScroll.scrollLeft(viewport, positionLeft);
```

You can also provide the third argument which is an animation time (in
msec, 600 by default), but I would not change it.

Have fun!



follow me on twitter: https://twitter.com/asvd0

