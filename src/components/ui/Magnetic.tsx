'use client';

import React, { useRef, useState, ReactElement, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function Magnetic({ children, strength = 15, className = "" }: { children: ReactElement; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Very snappy spring for tactile feel
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    setIsTouch(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Scale distance by strength
    x.set((middleX / width) * strength);
    y.set((middleY / height) * strength);
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
