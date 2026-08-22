import { useEffect, useState } from 'react';

/**
 * A drop-in replacement for useState that mirrors its value to localStorage.
 * Supports both normal initial values and lazy initializer functions.
 *
 * Important: callers may pass a function such as getSeedTasks. That function
 * must be executed when no saved value exists; storing the function itself
 * would make the React state a function instead of an array/object and can
 * crash components that expect the state value.
 */
export function useLocalStorage(key, initialValue) {
  const getInitialValue = () =>
    typeof initialValue === 'function' ? initialValue() : initialValue;

  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : getInitialValue();
    } catch (error) {
      console.warn(`useLocalStorage: could not read "${key}"`, error);
      return getInitialValue();
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`useLocalStorage: could not write "${key}"`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
