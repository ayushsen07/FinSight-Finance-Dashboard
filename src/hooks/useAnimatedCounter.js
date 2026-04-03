import { useState, useEffect, useRef } from 'react';

/**
 * Animate a number from 0 to target value on mount.
 * @param {number} target – The final value
 * @param {number} duration – Animation duration in ms (default 1200)
 */
export function useAnimatedCounter(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    // Reset on target change
    setValue(0);
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo for a smooth deceleration
      const eased = 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
}
