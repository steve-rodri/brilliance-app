export default function preventPullToRefresh() {
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
