'use client';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import React, { useRef } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  magneticPower?: number;
}

export default function MagneticButton({ children, className = '', onClick, magneticPower = 20 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth elastic spring for magnetic pull
  const mouseXSpring = useSpring(x, { stiffness: 80, damping: 20, mass: 0.4 });
  const mouseYSpring = useSpring(y, { stiffness: 80, damping: 20, mass: 0.4 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    // Calculate distance from center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Pull button towards cursor by magneticPower
    x.set(distanceX * (magneticPower / 100));
    y.set(distanceY * (magneticPower / 100));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const hasDisplayClass = /(^|\s)(inline-block|block|inline|flex|inline-flex|grid)(\s|$)/.test(className);
  const displayClass = hasDisplayClass ? '' : 'inline-block ';

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        x: mouseXSpring,
        y: mouseYSpring,
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative ${displayClass}${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
