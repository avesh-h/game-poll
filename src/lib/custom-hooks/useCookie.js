import { useState, useCallback } from 'react';

import Cookies from 'js-cookie';

export default function useCookie(name, defaultValue) {
  const [value, setValue] = useState(() => {
    if (defaultValue) {
      Cookies.set(name, defaultValue);
      return defaultValue;
    } else {
      const cookie = Cookies.get(name);
      return cookie;
    }
  });

  const updateCookie = useCallback(
    (newValue, options) => {
      Cookies.set(name, newValue, options);
      setValue(newValue);
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    Cookies.remove(name);
    setValue(null);
  }, [name]);

  return [value, updateCookie, deleteCookie];
}
