import { useEffect } from 'react';
import { DebounceSettings } from 'lodash';

import useDebounce from '@/Utils/Debounce';

const useScroll = <T extends (delta: number) => any> (props: {
  callback: T,
  target?: Element | Window,
  direction?: 'horizontal' | 'vertical',
  minTouchMove?: number;
  debounce?: number,
  debounceOptions?: DebounceSettings,
}): void => {
  const {
    callback,
    target = window,
    direction = 'vertical',
    minTouchMove = 50,
    debounce,
    debounceOptions,
  } = props;

  let touchStartX = 0;
  let touchStartY = 0;

  const parsedCallback = debounce ? useDebounce(
    callback,
    debounce,
    debounceOptions,
  ) : callback;

  const disableTouchMove = (event: Event) => {
    event.preventDefault();
  };

  const captureWheel = (event: Event) => {
    parsedCallback((event as WheelEvent).deltaY);
  };

  const captureTouchStart = (event: Event) => {
    touchStartX = ((event as TouchEvent).touches[0].pageX);
    touchStartY = ((event as TouchEvent).touches[0].pageY);
  };

  const captureTouchEnd = (event: Event) => {
    const changedX = (event as TouchEvent).changedTouches[0].pageX - touchStartX;
    const changedY = (event as TouchEvent).changedTouches[0].pageY - touchStartY;
    if (Math.abs(changedY) > Math.abs(changedX) && Math.abs(changedY) > minTouchMove && direction === 'vertical') {
      parsedCallback(-changedY);
    } else if (Math.abs(changedY) < Math.abs(changedX) && Math.abs(changedX) > minTouchMove && direction === 'horizontal') {
      parsedCallback(-changedX);
    }
  };

  useEffect(() => {
    target.addEventListener('wheel', captureWheel);
    target.addEventListener('touchstart', captureTouchStart);
    target.addEventListener('touchend', captureTouchEnd);
    if (direction === 'vertical') {
      target.addEventListener('touchmove', disableTouchMove, { passive: false });
    }
    return () => {
      target.removeEventListener('wheel', captureWheel);
      target.removeEventListener('touchstart', captureTouchStart);
      target.removeEventListener('touchend', captureTouchEnd);
      target.removeEventListener('touchmove', disableTouchMove);
    };
  }, [target]);
};

export default useScroll;
