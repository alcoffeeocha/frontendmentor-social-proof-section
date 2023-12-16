'use strict';

(function () {
  const screenWidth = window.innerWidth;
  const animationsInLargeBreakpoint =
    document.querySelectorAll('[data-anim-l-name]');
  const animations = document.querySelectorAll('[data-anim-name]');
  const onVisibleAnimations = document.querySelectorAll(
    '[data-anim-on-visible]'
  );
  const onVisibleAnimationNames = Array.from(onVisibleAnimations).map(
    (element) => element.dataset.animName
  );
  const parseDelay = function (ms) {
    if (ms == undefined || ms.trim() == '') {
      return 0;
    }
    return parseInt(ms);
  };
  if (screenWidth < 900) {
    animationsInLargeBreakpoint.forEach((element) => {
      element.removeAttribute('data-anim-l-name');
    });
    animations.forEach((element) => {
      const animName = element.dataset.animName;
      if (onVisibleAnimationNames.includes(animName)) {
        // will be handled differently
        return;
      }
      let delay = parseDelay(element.dataset.animDelay);
      let awaitedAnimKey = element.dataset.animWait;
      if (awaitedAnimKey && awaitedAnimKey.trim()) {
        const awaitedAnimKeys = awaitedAnimKey.split('-');
        let name = awaitedAnimKeys[0];
        let key;
        if (awaitedAnimKeys.length == 2) {
          key = awaitedAnimKeys[1];
        }
        const delayers = document.querySelectorAll(
          `[data-anim-name='${name}']`
        );
        if (delayers.length == 0) {
          return;
        }
        let delayer = delayers[0];
        if (delayers.length > 1) {
          delayer = document.querySelector(
            `[data-anim-name='${name}'][data-anim-key='${key}']`
          );
          if (!delayer) {
            return;
          }
        }
        const delayerDelay = parseDelay(delayer.dataset.animDelay);
        setTimeout(function () {
          element.classList.add('animated');
        }, delay + delayerDelay);
        return;
      }
      setTimeout(function () {
        element.classList.add('animated');
      }, delay);
    });
  } else if (screenWidth >= 900) {
    animations.forEach((element) => {
      element.removeAttribute('data-anim-name');
    });
    animationsInLargeBreakpoint.forEach((element) => {
      let delay = parseDelay(element.dataset.animLDelay);
      let awaitedAnimKey = element.dataset.animLWait;
      if (awaitedAnimKey && awaitedAnimKey.trim()) {
        const awaitedAnimKeys = awaitedAnimKey.split('-');
        let name = awaitedAnimKeys[0];
        let key;
        if (awaitedAnimKeys.length == 2) {
          key = awaitedAnimKeys[1];
        }
        const delayers = document.querySelectorAll(
          `[data-anim-l-name='${name}']`
        );
        if (delayers.length == 0) {
          return;
        }
        let delayer = delayers[0];
        if (delayers.length > 1) {
          delayer = document.querySelector(
            `[data-anim-l-name='${name}'][data-anim-l-key='${key}']`
          );
          if (!delayer) {
            return;
          }
        }
        const delayerDelay = parseDelay(delayer.dataset.animLDelay);
        setTimeout(function () {
          element.classList.add('animated-l');
        }, delay + delayerDelay);
        return;
      }
      setTimeout(function () {
        element.classList.add('animated-l');
      }, delay);
    });
  }
  let onVisibleAnimatedCount = 0;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const delay = parseDelay(target.dataset.animDelay);
          setTimeout(() => {
            target.classList.add('animated');
            onVisibleAnimatedCount++;
            if (onVisibleAnimatedCount == onVisibleAnimations.length) {
              observer.disconnect();
            }
          }, delay);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    }
  );
  onVisibleAnimations.forEach((element) => {
    observer.observe(element);
  });
})();
