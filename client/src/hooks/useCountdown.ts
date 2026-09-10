import { useEffect, useState } from 'react';
import { formatCountdown, isPast } from '../utils/file';

export const useCountdown = (target: string): { label: string; complete: boolean } => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [target]);

  return { label: formatCountdown(target, now), complete: isPast(target, now) };
};
