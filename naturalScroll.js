/**
 * @fileoverview naturalScroll - scroll smoothly
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
    var TIME = 600;

    // better compression
    var Math_ = Math;
    var length = 'length';

    var allFrames = [[],[]];
    
    // generates vertical scroller if first argument is given,
    // horizontal otherwise
    var scroller = function(top) {
        var prop = top ? 'scrollTop' : 'scrollLeft';
        var dirFrames = allFrames[top?0:1];

        return function(elem, target, time) {
            elem = elem.scroller || elem;
            time = time || TIME;
            var elFrames, i;
            for (i = 0; i < dirFrames[length]; i++) {
                if (dirFrames[i][0] == elem) {
                    elFrames = dirFrames[i];
                }
            }

   // TODO remove nested array
            if (!elFrames) {
                elFrames = [
                    elem,             // element to scroll
                    [[0,0,0,0,0,0]],  // list of frames
                    0,                // frame index
                    0                 // interval
                ];

                dirFrames.push(elFrames);
            }

            var frames = elFrames[1];
            var idx = elFrames[2];
            var frame = frames[idx];

            frame[0] = elem[prop];

            var f0 = frame[0];
            var f1 = frame[1];
            var f2 = frame[2];

            var fnum = Math_.max(
                5,  // minimal amount of frames
                // prevent animation run slower than the current one
                Math_.min(
                    // normal animation frames number
                    Math_.floor(time / DELAY),
                    Math_.abs(
                        Math_.round(
                            (target - f0) /
                                // last animation speed
                                Math_.abs((f0 - frames[0][0]) / (idx||1))
                        )
                    )
                )
            );

            // calculating frames
            var n2 = fnum * fnum;
            var n3 = n2 * fnum;
            var f0_target = f0-target;
            var lastframe;

            // these magic formulae came from outer space
            frames = elFrames[1] = [[
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

            while (elFrames[2] = fnum--) {
                lastframe = frames[frames[length] - 1];

                frames.push(frame = [0, 0, 0, 0, 0, lastframe[i=5]]);

                for (;i;) {
                    frame[i-1] = frame[i] + lastframe[--i];
                }
            }
            
            elFrames[3] = elFrames[3] || setInterval(function(val) {
                elem[prop] = val = elFrames[1][elFrames[2]++][0];
                if (elFrames[2] == elFrames[1][length]) {
                    clearInterval(elFrames[3]);
                    elFrames[1] = [[val,0,0,0,0, elFrames[3] = elFrames[2] = 0]];
                }
            }, DELAY, elFrames[2]=3);
        }
    }


    exports.scrollTop = scroller(exports.scrollLeft = scroller());
}));

