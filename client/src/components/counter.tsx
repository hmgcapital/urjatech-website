
import { useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface CounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export const Counter = ({
  end,
  duration = 3500,
  prefix = '',
  suffix = '',
  decimals = 0,
}: CounterProps) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      countRef.current = 0;
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Use easeOutExpo for smooth animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        countRef.current = easedProgress * end;
        
        setCount(countRef.current);
        
        if (progress === 1) {
          clearInterval(timer);
        }
      }, 16); // ~60fps
      
      return () => clearInterval(timer);
    }
  }, [inView, end, duration]);

  return (
    <div ref={ref} className="counter">
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </div>
  );
};
