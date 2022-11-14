/*
Hook, jolla voidaan toteuttaa elementin pohjassa painaminen.
*/
export default function useLongPress() {
  return (callback) => {
    let timeout;
    let preventClick = false;

    function start() {
      timeout = setTimeout(() => {
        preventClick = true;
        callback();
      }, 600);
    }

    function clear() {
      timeout && clearTimeout(timeout);
      preventClick = false;
    }

    function clickCaptureHandler(e) {
      if (preventClick) {
        e.stopPropagation();
        preventClick = false;
      }
    }

    return {
      onMouseDown: start,
      onTouchStart: start,
      onMouseUp: clear,
      onMouseLeave: clear,
      onTouchMove: clear,
      onTouchEnd: clear,
      onClickCapture: clickCaptureHandler,
    };
  };
}
