import { useEffect, useState } from 'react';

const getWindowSize = () => ({ width: window.innerWidth, height: window.innerHeight });

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

  useEffect(() => {
    const handler = () => setWindowSize(getWindowSize());

    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);

  return { windowSize };
};
