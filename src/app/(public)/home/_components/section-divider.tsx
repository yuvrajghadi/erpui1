'use client';
import { motion } from 'framer-motion';

export default function SectionDivider() {
  // Arrow animation variants (horizontal wiggle)
  const arrowVariants = {
    animate: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? [0, 8, 0] : [0, -8, 0],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.6,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: dir === 'right' ? 0.15 : 0,
      },
    }),
  };

  // Right arrow ">" shape as two lines
  const RightArrow = () => (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        margin: '0 3px',
        opacity: 0.7,
        filter: 'drop-shadow(0 0 2px #1677ff88)',
        cursor: 'default',
      }}
      variants={arrowVariants}
      animate="animate"
      custom="right"
    >
      <line x1="5" y1="4" x2="13" y2="9" />
      <line x1="5" y1="14" x2="13" y2="9" />
    </motion.svg>
  );

  // Left arrow "<" shape as two lines
  const LeftArrow = () => (
    <motion.svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        margin: '0 3px',
        opacity: 0.7,
        filter: 'drop-shadow(0 0 2px #1677ff88)',
        cursor: 'default',
      }}
      variants={arrowVariants}
      animate="animate"
      custom="left"
    >
      <line x1="13" y1="4" x2="5" y2="9" />
      <line x1="13" y1="14" x2="5" y2="9" />
    </motion.svg>
  );

  return (
    <motion.div
      style={{
        width: '100%',
        padding: '28px 0',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: 'spring', stiffness: 70, damping: 22 }}
      aria-hidden="true"
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          position: 'relative',
        }}
      >
        {/* Left gradient line */}
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, #444 40%, #444 60%, transparent 100%)',
            opacity: 0.44,
          }}
        />
        {/* Left arrows (all ">") */}
        {[...Array(4)].map((_, i) => (
          <RightArrow key={`left-arrow-${i}`} />
        ))}
        {/* Center glowing dot with pulse */}
        <motion.div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1677ff 0%, #22d3ee 100%)',
            boxShadow: '0 0 12px 2px #1677ff55',
            margin: '0 10px',
            opacity: 0.94,
          }}
          animate={{
            scale: [1, 1.18, 1],
            boxShadow: [
              '0 0 12px 2px #1677ff55',
              '0 0 22px 6px #22d3ee77',
              '0 0 12px 2px #1677ff55',
            ],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        />
        {/* Right arrows (all "<") */}
        {[...Array(4)].map((_, i) => (
          <LeftArrow key={`right-arrow-${i}`} />
        ))}
        {/* Right gradient line */}
        <div
          style={{
            flex: 1,
            height: 1,
            background:
              'linear-gradient(90deg, transparent 0%, #444 40%, #444 60%, transparent 100%)',
            opacity: 0.44,
          }}
        />
      </div>
    </motion.div>
  );
}
