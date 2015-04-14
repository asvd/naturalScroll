/**
 * @fileoverview naturalScroll - scrolls an viewport naturally
 * @version 0.2.0
 * 
 * @license MIT, see http://github.com/asvd/naturalScroll
 * @copyright 2015 asvd <heliosframework@gmail.com> 
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.naturalScroll = {}));
    }
}(this, function (exports) {
    var allAnimations = [
        [],  // vertical scrolling animations, one for an element
        []   // horizontal animations
    ];

    // for better compression
    var scrollTop = 'scrollTop';
    var scrollLeft = 'scrollLeft';

    // returns scrollTop() if argument is given, scrollLeft() otherwise
    var genScroll = function(top) {

        // exported method
        return function(elem, target, time) {
            elem = elem.scroller || elem;  // needed for intence
            time = time || 600;

            // all animations for the particular direction
            var dirAnimations = allAnimations[top?0:1];
            var prop = top ? scrollTop : scrollLeft;

            var animation,
                tick,
                i = 0,
                f0 = elem[prop],  // current coordinate
                f1 = 0,           // current speed
                f2 = 0;           // current acceleration

            // searching for the element's animation
            for (;i < dirAnimations.length; i++) {
                animation = (dirAnimations[i].e == elem) ?
                    dirAnimations[i] : animation;
            }

            if (animation) {
                // taking speed and acceleration from running animation
                f1 = animation.f[1];
                f2 = animation.f[2];
            } else {
                // generating a new animation which contains:
                // .e - element on which the animation is performed
                // .f - current animation frame data
                // .n - remaining frames number
                // .t - animation end timestamp
                dirAnimations.push(animation = {e : elem});
            }

            animation.t = (new Date).getTime()+time;

            // total number of frames (most will be dropped though)
            var fnum = animation.n = time;
            var fnum2 = fnum * fnum;
            var fnum3 = fnum2 * fnum;
            var f0_target = f0-target;

            // calculating initial frame
            animation.f = [
                f0,  // coordinate
                f1,  // speed
                f2,  // acceleration

                // these magic formulae came from outer space
                - ( 9 * f2 * fnum2 +
                    (36 * f1 -9 * f2) * fnum -
                    36 * f1 +
                    60 * f0_target
                ) / (fnum3 - fnum),

                6 * ( 6 * f2 * fnum2 +
                      (32 * f1 -6 * f2) * fnum -
                      32 * f1 +
                      60 * f0_target
                ) / fnum / ( fnum3 + 2 * fnum2 - fnum - 2 ),
                    
                - 60 * ( f2 * fnum2 +
                         (6 * f1 - f2) * fnum -
                         6 * f1 +
                         12 * f0_target
                ) / fnum / (
                    fnum2*fnum2  + 5*(fnum3 + fnum2-fnum) - 6 
                )
            ];

            // creating the timeout function
            // and invoking it to apply the first frame instantly
            // (if the animation is already running, another timeout
            // is launched along with the existing, which is not a
            // problem, since we are already spam with this function
            // every msec)
            (tick = function(i) {
                 while (
                     // frames are not over
                     animation.n &&
                     // current frame is not yet reached
                     animation.n > animation.t - (new Date).getTime()
                 ) {
                     // calculating the next frame (i+1 means i>=0)
                     for (i = 4; i+1;) {
                         animation.f[i] += animation.f[i--+1];
                     }

                     animation.n--;
                 }

                 elem[prop] = animation.f[0];

                 if (animation.n) {
                     // scheduling the next frame
                     setTimeout(tick, 1);
                 } else {
                     // stopping animation
                     animation.r = animation.f[1] = animation.f[2] = 0;
                 }
            })();
        }
    }

    exports[scrollTop] = genScroll(
        exports[scrollLeft] = genScroll()
    );
}));

