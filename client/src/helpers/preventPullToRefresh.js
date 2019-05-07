export default function preventPullToRefresh() {
    let touchStartHandler,
        touchMoveHandler,
        touchPoint;

    // Only needed for touch events on chrome.
    if ((window.chrome || navigator.userAgent.match("CriOS"))
        && "ontouchstart" in document.documentElement) {

        touchStartHandler = function(e) {
            // Only need to handle single-touch cases
            touchPoint = e.touches.length === 1 ? e.touches[0].clientY : null;
        };

        touchMoveHandler = function(e) {
            var newTouchPoint;

            // Only need to handle single-touch cases
            if (e.touches.length !== 1) {
                touchPoint = null;

                return;
            }

            // We only need to defaultPrevent when scrolling up
            newTouchPoint = e.touches[0].clientY;
            if (newTouchPoint > touchPoint) {
                e.preventDefault();
            }
            touchPoint = newTouchPoint;
        };

        document.addEventListener("touchstart", touchStartHandler, {
            passive: false
        });

        document.addEventListener("touchmove", touchMoveHandler, {
            passive: false
        });

    }
};
