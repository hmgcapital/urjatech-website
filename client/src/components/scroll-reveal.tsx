
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimationProps } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationProps;
  threshold?: number;
  delay?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  },
  threshold = 0.1,
  delay = 0
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay the animation if specified
          if (delay) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          // Unobserve once visible
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold, delay]);

  return (
    <div ref={ref}>
      <motion.div
        initial={animation.initial}
        animate={isVisible ? animation.animate : animation.initial}
        transition={animation.transition}
      >
        {children}
      </motion.div>
    </div>
  );
};
