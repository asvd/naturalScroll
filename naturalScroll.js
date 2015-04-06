/**
 * @fileoverview naturalScroll - smoothly scroll
 * @version 0.0.1
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
    var TIME = 600;

    // better compression
    var null_ = null;
    var addEventListener = 'addEventListener';
    var Math_ = Math;

    var scrollTop = 'scrollTop';
    var scrollLeft = 'scrollLeft';


    /**
     * Calculates the animation and uses the provided setter function
     * to apply the animation frame
     * 
     * @param {Function} setter to apply the animation frame
     */
    var Animator = function(setter) {
        var F = [[0,0,0,0,0,0]];  // frames and diffs
        var fIdx = 0;             // current frame number
        var interval = null_;

        
        /**
         * Animates to the desired position within the given time
         * 
         * @param {Number} target
         * @param {Number} time (msec);
         */
        this.s = function(target, time) {
            var fnum = Math.floor(time / DELAY);
            var frame = F[fIdx];

            // prevent animation run slover than the current one
            if (interval !== null_) {
                var start = F[0][0];
                var current = frame[0];
                var dist = current - start;
                var speed = Math_.abs(dist / fIdx);

                if (speed > 0) {
                    var newFnum = Math_.abs(
                        Math_.round((target - current) / speed)
                    );

                    fnum = Math_.max(
                        5, Math_.min( fnum, newFnum )
                    );
                }
            }

            F = calculateFrames(
                frame[0], frame[1], frame[2], target, fnum
            );

            fIdx = 0;

            if (!interval) {
                var tick = function() {
                    var val = F[fIdx++][0];
                    setter(val);
                    
                    if (fIdx == F.length) {
                        clearInterval(interval);
                        interval = null_;
                        F = [[val,0,0,0,0,0]];
                        fIdx = 0;
                    }
                }

                interval = setInterval(tick, DELAY);
            }
        }


        /**
         * Updates the value changed from outside
         * 
         * @param {Number} value
         */
        this.up = function(value) {
            if (interval === null_) {
                F[fIdx][0] = value;
            }
        }


        /**
         * Integer-based calculation of the animation frames spline
         * 
         * @param {Number} f0 current value
         * @param {Number} f1 current first difference
         * @param {Number} f2 current second difference
         * @param {Number} target value at the end
         * @param {Number} fnum number of frames
         */
        var calculateFrames = function(
            f0, f1, f2, target, fnum
        ) {
            var n = fnum;
            var n2 = n * n;
            var n3 = n2 * n;
            var n4 = n3 * n;
            var n5 = n4 * n;

            var f3, f4, f5;

            // these magic formulae came from outer space
            f3 = -( 9 * f2 * n2 +
                    (36 * f1 -9 * f2) * n -
                    36 * f1 +
                    60 * f0 -
                    60 * target
                  ) / (n3 - n);
            
            f4 = ( 36 * f2 * n2 +
                   (192 * f1 -36 * f2) * n -
                   192 * f1 +
                   360 * f0 -
                   360 * target
                 ) / (
                     n4 +
                     2 * n3 -
                     n2 -
                     2 * n
                 );
            
            f5 = -( 60 * f2 * n2 +
                    (360 * f1 -60 * f2) * n -
                    360 * f1 +
                    720 * f0 -
                    720 * target
                  ) / (
                      n5 +
                      5 * n4 +
                      5 * n3 -
                      5 * n2 -
                      6 * n
                  );

            var result = [[f0, f1, f2, f3, f4, f5]];

            var lastframe, frame, i, j;
            for (i = 0; i < fnum; i++) {
                lastframe = result[result.length - 1];

                frame = [0, 0, 0, 0, 0, f5];

                for (j = 4; j >= 0; j--) {
                    frame[j] = frame[j+1] + lastframe[j];
                }

                result.push(frame);
            }

            return result;
        }
        
    }

    // top and left animators intsances
    var animators = {t:[], l:[]};

    /**
     * Returns a function which scrolls the given element to the
     * desired position from top
     * 
     * @param {Boolean} top true to return vertical scrolling function
     * 
     * @returns {Function}
     */
    var scroll = function(top) {
        
        /**
         * Scrolls the given element to the desired position from top
         * 
         * @param {Element} elem to scroll
         * @param {Number} pos to scroll to
         * @param {Number} time (msec) of animation
         */
        return function(elem, pos, time) {
            time = time || TIME;
            elem = elem.scroller || elem;

            var animator = null_;
            var animatorsList = animators[top ? 't':'l'];
            var prop = top ? scrollTop : scrollLeft;

            for (var i = 0; i < animatorsList.length; i++) {
                if (animatorsList[i].elem == elem) {
                    animator = animatorsList[i];
                    break;
                }
            }

            if (!animator) {
                var setter = function(val) {
                    elem[prop] = val;
                }

                animator = {
                    elem : elem,
                    animator : new Animator(setter)
                };

                elem[addEventListener](
                    'scroll',
                    function() {
                        animator.animator.up(elem[prop]);
                    },
                    0
                );
                
                animator.animator.up(elem[prop]);
                animatorsList.push(animator);
            }

            animator.animator.s(pos, time);
        }
    }


    exports[scrollTop] = scroll(true);
    exports[scrollLeft] = scroll(false);
}));

