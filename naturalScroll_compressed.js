/**
 * @fileoverview naturalScroll - scroll smoothly
 * 
 * This is a refactored version of naturalScroll.js for the sake of
 * better compression
 * 
 * @version 0.0.2
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
}(this,
function (exports) {

    var DELAY = 20;

    // better compression
    var Math_ = Math;
    var length = 'length';

    var scroll = 'scroll';
    var scrollTop = scroll+'Top';
    var scrollLeft = scroll+'Left';
    
    // top and left animators intsances
    var animators = [[],[]];


    // function meaning depends on number of arguments

    /**
     * Returns a function which scrolls the given element to the
     * desired position from top
     * 
     * @param {Boolean} top true to return vertical scrolling function
     * 
     * @returns {Function}
     */
    
    /**
     * Calculates the animation and uses the provided setter function
     * to apply the animation frame
     * 
     * @param {Function} setter to apply the animation frame
     * @param {Array} F frames and diffs, should be [[0,0,0,0,0,0]]
     * @param {Number} fIdx number of the frame, should be 0
     * @param {Number} interval
     */
    var gen = function(setter_or_top, F, fIdx, interval) {

        // function behaviour depends on F presence

        /**
         * Animates to the desired position within the given time
         * 
         * @param {Number} target
         * @param {Number} time (msec);
         */

        /**
         * Scrolls the given element to the desired position from top
         * 
         * @param {Element} elem to scroll
         * @param {Number} pos to scroll to
         * @param {Number} time (msec) of animation
         */
        return function(target_or_elem, time_or_pos, time) {
            if (F) {
                // animator
                if (time_or_pos) {
                    // two arguments means slide
                    var frame = F[fIdx];

                    var f0 = frame[0];
                    var f1 = frame[1];
                    var f2 = frame[2];

                    var fnum = Math_.max(
                        5,  // minimal amount of frames
                        // prevent animation run slower than the current one
                        Math_.min(
                            // normal animation frames number
                            Math_.floor(time_or_pos / DELAY),
                            Math_.abs(
                                Math_.round(
                                    (target_or_elem - f0) /
                                        // last animation speed
                                        Math_.abs((f0 - F[0][0]) / (fIdx||1))
                                )
                            )
                        )
                    );

                    // calculating frames
                    var n2 = fnum * fnum;
                    var n3 = n2 * fnum;
                    var f0_target = f0-target_or_elem;

                    var lastframe, frame_, i;

                    // these magic formulae came from outer space
                    F = [[
                        f0,
                        f1,
                        f2,
                        - (9 * f2 * n2 + (36 * f1 -9 * f2) * fnum -
                            36 * f1 +
                            60 * f0_target
                          ) / (n3 - fnum),
                        6 * ( 6 * f2 * n2 + (32 * f1 -6 * f2) * fnum -
                           32 * f1 +
                           60 * f0_target
                         ) / fnum / (
                             n3 +
                             2 * n2 -
                             fnum -
                             2 
                         ),
                        - 60 * ( f2 * n2 + (6 * f1 - f2) * fnum -
                            6 * f1 +
                            12 * f0_target
                          ) / fnum / (
                              n2*n2  +
                              5 * (n3 + n2-fnum) -
                              6 
                          )
                    ]];

                    while (fnum--) {
                        lastframe = F[F[length] - 1];

                        F.push(frame_ = [0, 0, 0, 0, 0, lastframe[5]]);

                        for (i=5;i;) {
                            frame_[i-1] = frame_[i] + lastframe[--i];
                        }
                    }

                    fIdx = 0;

                    interval = interval || setInterval(function(val) {
                        setter_or_top(val = F[fIdx++][0]);
                        if (fIdx == F[length]) {
                            clearInterval(interval);
                            F = [[val,0,0,0,0, interval = fIdx = 0]];
                        }
                    }, DELAY);
                } else if (!interval) {
                    // single argument means update
                    F[fIdx][0] = target_or_elem;
                }
            } else {
                // scroller
                target_or_elem = target_or_elem[scroll+'er'] || target_or_elem;
                time = time || 600;

                var animator, i=0;
                var animatorsList = animators[setter_or_top?0:1];
                var prop = setter_or_top ? scrollTop : scrollLeft;

                for (; i < animatorsList[length];i++) {
                    animator=
                        animatorsList[i].e == target_or_elem ?
                        animatorsList[i]:0;
                }

                if (!animator) {
                    animatorsList.push(animator = {
                        e : target_or_elem,
                        a : gen(
                            function(val) {
                                target_or_elem[prop] = val;
                            },
                            [[0,0,0,0,0,0]],
                            0
                        )
                    });

                    target_or_elem.addEventListener(
                        scroll,
                        function() {
                            animator.a(target_or_elem[prop]);
                        },
                        0
                    );
                    
                    animator.a(target_or_elem[prop]);
                }

                animator.a(time_or_pos, time);
            }
        }
    }


    exports[scrollTop] = gen(
        exports[scrollLeft] = gen()
    );
}));

