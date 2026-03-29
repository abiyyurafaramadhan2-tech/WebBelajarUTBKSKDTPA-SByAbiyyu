'use client';
// © 2026 QuizGenius by Abiyyu Rafa Ramadhan
import { motion, useAnimation } from 'framer-motion';
import { useEffect, forwardRef, type ReactNode } from 'react';

interface ShakeWrapperProps {
  children:   ReactNode;
  shouldShake:boolean;
  onShakeEnd?: () => void;
  className?: string;
}

export const ShakeWrapper = forwardRef<HTMLDivElement, ShakeWrapperProps>(
  ({ children, shouldShake, onShakeEnd, className }, ref) => {
    const controls = useAnimation();

    useEffect(() => {
      if (shouldShake) {
        controls
          .start({
            x: [0, -10, 10, -8, 8, -5, 5, 0],
            transition: { duration: 0.5, ease: 'easeInOut' },
          })
          .then(() => onShakeEnd?.());
      }
    }, [shouldShake, controls, onShakeEnd]);

    return (
      <motion.div ref={ref} animate={controls} className={className}>
        {children}
      </motion.div>
    );
  }
);

ShakeWrapper.displayName = 'ShakeWrapper';
