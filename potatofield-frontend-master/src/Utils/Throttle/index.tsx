import { useCallback } from 'react';
import { throttle, DebouncedFunc, ThrottleSettings } from 'lodash';

const useThrottle = <T extends (...args: any[]) => any> (
  callback: T,
  delay: number,
  options?: ThrottleSettings,
): DebouncedFunc<T> => {
  const throttledFunction = useCallback(
    throttle(callback, delay, options),
    [delay, callback, options],
  );
  return throttledFunction;
};

export default useThrottle;
