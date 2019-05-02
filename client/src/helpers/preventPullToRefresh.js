export function preventPullToRefreshs() {
  const element = 'html'
  let prevent = false;

  document.querySelector(element).addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) { return; }

    let scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    prevent = (scrollY === 0);
  });

  document.querySelector(element).addEventListener('touchmove', function(e){
    if (prevent) {
      prevent = false;
      e.preventDefault();
    }
  });
}

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
