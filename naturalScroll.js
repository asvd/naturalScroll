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


    /**
     * Calculates the animation and uses the provided setter function
     * to apply the animation frame
     * 
     * @param {Function} setter to apply the animation frame
     */
    var Animator = function(setter) {
        this.__setter = setter;
        this.__f = [[0,0,0,0,0,0]];  // frames and diffs
        this.__fIdx = 0;             // current frame number
        this.__interval = null;
    }
    

    /**
     * Animates to the desired position within the given time
     * 
     * @param {Number} target
     * @param {Number} time (msec);
     */
    Animator.prototype.slide = function(target, time) {
        var fnum = Math.floor(time / DELAY);

        // prevent animation run slover than the current one
        if (this.__interval !== null) {
            var start = this.__f[0][0];
            var current = this.__f[this.__fIdx][0];
            var dist = current - start;
            var speed = Math.abs(dist / this.__fIdx);

            if (speed > 0) {
                var newFnum = Math.abs(
                    Math.round((target - current) / speed)
                );

                fnum = Math.max(
                    5, Math.min( fnum, newFnum )
                );
            }
        }

        var frame = this.__f[this.__fIdx];
        this.__f = this.__calculateFrames(
            frame[0], frame[1], frame[2], target, fnum
        );

        this.__fIdx = 0;

        if (!this.__interval) {
            this.__start();
        }
    }


    /**
     * Updates the value changed from outside
     * 
     * @param {Number} value
     */
    Animator.prototype.update = function(value) {
        if (this.__interval === null) {
            this.__f[this.__fIdx][0] = value;
        }
    }


    /**
     * Starts the animation
     */
    Animator.prototype.__start = function() {
        var me = this;

        var tick = function() {
            var val = me.__f[me.__fIdx++][0];
            me.__setter(val);
            
            if (me.__fIdx == me.__f.length) {
                clearInterval(me.__interval);
                me.__interval = null;
                me.__f = [[val,0,0,0,0,0]];
                me.__fIdx = 0;
            }
        }

        this.__interval = setInterval(tick, DELAY);
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
    Animator.prototype.__calculateFrames = function(
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





    var topAnimators = [];
    var leftAnimators = [];


    /**
     * Scrolls the given element to the desired position from top
     * 
     * @param {Element} elem to scroll
     * @param {Number} pos to scroll to
     * @param {Number} time (msec) of animation
     */
    function scrollTop(elem, pos, time) {
        time = time || TIME;
        elem = elem.scroller || elem;

        var animator = null;

        for (var i = 0; i < topAnimators.length; i++) {
            if (topAnimators[i].elem == elem) {
                animator = topAnimators[i];
                break;
            }
        }

        if (!animator) {
            var setter = function(val) {
                elem.scrollTop = val;
            }

            animator = {
                elem : elem,
                animator : new Animator(setter)
            };

            elem.addEventListener(
                'scroll',
                function() {
                    animator.animator.update(elem.scrollTop);
                },
                0
            );

            animator.animator.update(elem.scrollTop);

            topAnimators.push(animator);
        }

        animator.animator.slide(pos, time);
    }


    /**
     * Scrolls the given element to the desired position from left
     * 
     * @param {Element} elem to scroll
     * @param {Number} pos to scroll to
     * @param {Number} time (msec) of animation
     */
    function scrollLeft(elem, pos, time) {
        time = time || TIME;
        elem = elem.scroller || elem;

        var animator = null;

        for (var i = 0; i < leftAnimators.length; i++) {
            if (leftAnimators[i].elem == elem) {
                animator = leftAnimators[i];
                break;
            }
        }

        if (!animator) {
            var setter = function(val) {
                elem.scrollLeft = val;
            }

            animator = {
                elem : elem,
                animator : new Animator(setter)
            };

            elem.addEventListener(
                'scroll',
                function() {
                    animator.animator.update(elem.scrollLeft);
                },
                0
            );
            
            animator.animator.update(elem.scrollLeft);

            leftAnimators.push(animator);
        }

        animator.slide(pos, time);
    }


    exports.scrollTop = scrollTop;
    exports.scrollLeft = scrollLeft;
}));

