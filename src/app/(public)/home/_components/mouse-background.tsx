'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function MouseCursor() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(true);

  // Center the circle on the mouse
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Smooth, natural movement
  const springX = useSpring(cursorX, { stiffness: 350, damping: 28 });
  const springY = useSpring(cursorY, { stiffness: 350, damping: 28 });

  useEffect(() => {
    setMounted(true);
    
    // Hide on touch devices
    const handleTouch = () => setShow(false);
    window.addEventListener('touchstart', handleTouch);

    // Mouse move handler
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', move);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [cursorX, cursorY]);

  if (!mounted || !show) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-5 h-5 rounded-full bg-gray-400/70 shadow pointer-events-none z-[9999]"
      style={{
        x: springX,
        y: springY,
        translateX: '-50%',
        translateY: '-50%',
        backdropFilter: 'blur(2px)',
      }}
      aria-hidden
    />
  );
}
