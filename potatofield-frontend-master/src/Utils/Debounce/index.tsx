import { useCallback } from 'react';
import { debounce, DebouncedFunc, DebounceSettings } from 'lodash';

const useDebounce = <T extends (...args: any[]) => any> (
  callback: T,
  delay: number,
  options?: DebounceSettings,
): DebouncedFunc<T> => {
  const debouncedFunction = useCallback(
    debounce(callback, delay, options),
    [delay, callback, options],
  );
  return debouncedFunction;
};

export default useDebounce;
