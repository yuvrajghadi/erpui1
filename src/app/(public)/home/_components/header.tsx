'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config';

// Enhanced mobile-first responsive design with improved hamburger menu

const Logo = ({ isMobile = false }: { isMobile?: boolean }) => (
  <motion.div whileHover={{ scale: 1.05, rotate: -2 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: isMobile ? '32px' : '36px',
          height: isMobile ? '32px' : '36px',
          background: '#fff',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: isMobile ? '16px' : '18px',
          color: '#000',
        }}
      >
        OG
      </div>
      {/* <span style={{ color: '#fff', fontWeight: 600, fontSize: '20px' }}>
        atomize
      </span> */}
    </div>
  </motion.div>
);

const NavLink = ({ text, href, isMobile = false, onClick }: { 
  text: string, 
  href: string, 
  isMobile?: boolean,
  onClick?: () => void 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsClicked(true);
    
    // Close mobile menu first if provided
    if (onClick) {
      onClick();
    }
    
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Add a small delay for mobile menu to close first
        const scrollDelay = isMobile ? 300 : 0;
        
        setTimeout(() => {
          const headerOffset = isMobile ? 90 : 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          // Enhanced smooth scroll with easing
          const startPosition = window.pageYOffset;
          const distance = offsetPosition - startPosition;
          const duration = Math.min(Math.abs(distance) / 2, 1200);
          let startTime: number | null = null;

          const easeInOutCubic = (t: number): number => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          };

          const animateScroll = (currentTime: number) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * ease);
            
            if (progress < 1) {
              requestAnimationFrame(animateScroll);
            } else {
              setIsClicked(false);
            }
          };

          requestAnimationFrame(animateScroll);
        }, scrollDelay);
      }
    }
  };

  return (
    <motion.a 
      href={href} 
      onClick={handleClick}
      whileHover={{ 
        scale: isMobile ? 1.01 : 1.05,
        color: '#ffffff',
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.96 }}
      animate={{
        color: isClicked ? '#3b82f6' : (isMobile ? '#e4e4e7' : '#a1a1aa'),
        transition: { duration: 0.3 }
      }}
      style={{ 
        textDecoration: 'none', 
        fontSize: isMobile ? '20px' : '14px', 
        fontWeight: isMobile ? 600 : 500,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        padding: isMobile ? '20px 24px' : '0',
        width: isMobile ? '100%' : 'auto',
        textAlign: isMobile ? 'center' : 'left',
        minHeight: isMobile ? '60px' : 'auto',
        alignItems: 'center',
        justifyContent: isMobile ? 'center' : 'flex-start',
        borderRadius: isMobile ? '20px' : '0',
        transition: 'all 0.2s ease'
      }}
    >
      {text}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: isClicked ? 1 : 0,
          transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] }
        }}
        style={{
          position: 'absolute',
          bottom: isMobile ? '16px' : '-2px',
          left: isMobile ? '50%' : 0,
          right: isMobile ? 'auto' : 0,
          width: isMobile ? '80px' : 'auto',
          height: isMobile ? '3px' : '2px',
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
          transformOrigin: isMobile ? 'center' : 'left',
          borderRadius: isMobile ? '2px' : '1px',
          transform: isMobile ? 'translateX(-50%)' : 'none'
        }}
      />
    </motion.a>
  );
};

const MenuButton = ({ toggle, isOpen }: { toggle: () => void, isOpen: boolean }) => (
    <motion.button 
        onClick={toggle} 
        style={{
            background: 'rgba(30, 30, 30, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
            position: 'relative',
            zIndex: 101,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
        whileHover={{ 
          scale: 1.08, 
          backgroundColor: 'rgba(50, 50, 50, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.4)'
        }}
        whileTap={{ scale: 0.92 }}
        animate={{
          backgroundColor: isOpen ? 'rgba(50, 50, 50, 0.95)' : 'rgba(30, 30, 30, 0.9)',
          borderColor: isOpen ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)'
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
    >
        <motion.div
          style={{
            width: 22,
            height: 22,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '3px',
          }}
          animate={isOpen ? "open" : "closed"}
        >
          <motion.div
            variants={{
              closed: { rotate: 0, y: 0, width: '22px', opacity: 1 },
              open: { rotate: 45, y: 7, width: '22px', opacity: 1 },
            }}
            style={{ 
              height: '2.5px', 
              background: '#fff', 
              borderRadius: '2px',
              transformOrigin: 'center'
            }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          />
          <motion.div
            variants={{
              closed: { opacity: 1, width: '18px', x: 0 },
              open: { opacity: 0, width: '18px', x: 4 },
            }}
            style={{ 
              height: '2.5px', 
              background: '#fff', 
              borderRadius: '2px',
              alignSelf: 'flex-end'
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          />
          <motion.div
            variants={{
              closed: { rotate: 0, y: 0, width: '14px', opacity: 1 },
              open: { rotate: -45, y: -7, width: '22px', opacity: 1 },
            }}
            style={{ 
              height: '2.5px', 
              background: '#fff', 
              borderRadius: '2px',
              alignSelf: 'flex-end',
              transformOrigin: 'center'
            }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          />
        </motion.div>
    </motion.button>
);

// const FreeTrialButton = () => (
//   <button style={{
//     background: 'linear-gradient(to right, #6d28d9, #4f46e5)',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '10px',
//     padding: '8px 16px',
//     fontSize: '14px',
//     fontWeight: 500,
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px'
//   }}>
//     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
//     Start Free Trial
//   </button>
// );

const AuthButtons = ({ isMobile = false }: { isMobile?: boolean }) => {
  const router = useRouter();
  return (
    <div style={{ 
      display: 'flex', 
      gap: isMobile ? '16px' : '12px',
      flexDirection: isMobile ? 'column' : 'row',
      width: isMobile ? '100%' : 'auto'
    }}>
      <motion.button
        onClick={() => router.push(ROUTES.login)}
        whileHover={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          scale: isMobile ? 1.02 : 1.05
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'transparent',
          color: '#a1a1aa',
          border: '1px solid #3f3f46',
          borderRadius: isMobile ? '12px' : '10px',
          padding: isMobile ? '14px 20px' : '8px 16px',
          fontSize: isMobile ? '16px' : '14px',
          fontWeight: isMobile ? 600 : 500,
          cursor: 'pointer',
          minHeight: isMobile ? '48px' : 'auto',
          width: isMobile ? '100%' : 'auto',
          transition: 'all 0.2s ease'
        }}
      >
        Login
      </motion.button>
      <motion.button
        onClick={() => router.push(ROUTES.companyOnboard)}
        whileHover={{ 
          backgroundColor: '#fff', 
          color: '#000',
          scale: isMobile ? 1.02 : 1.05
        }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: '#fafafa',
          color: '#18181b',
          border: 'none',
          borderRadius: isMobile ? '12px' : '10px',
          padding: isMobile ? '14px 20px' : '8px 16px',
          fontSize: isMobile ? '16px' : '14px',
          fontWeight: isMobile ? 600 : 500,
          cursor: 'pointer',
          minHeight: isMobile ? '48px' : 'auto',
          width: isMobile ? '100%' : 'auto',
          transition: 'all 0.2s ease'
        }}
      >
        Sign Up
      </motion.button>
    </div>
  );
};

const HamburgerIcon = ({ isOpen, toggle }: { isOpen: boolean, toggle: () => void }) => (
  <motion.div
    onClick={toggle}
    style={{
      width: 24,
      height: 24,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: '5px',
    }}
    animate={isOpen ? "open" : "closed"}
  >
    <motion.div
      variants={{
        closed: { rotate: 0, y: 0 },
        open: { rotate: 45, y: 6 },
      }}
      style={{ height: '2px', background: '#fff', width: '100%' }}
    ></motion.div>
    <motion.div
      variants={{
        closed: { opacity: 1 },
        open: { opacity: 0 },
      }}
      style={{ height: '2px', background: '#fff', width: '100%' }}
    ></motion.div>
    <motion.div
      variants={{
        closed: { rotate: 0, y: 0 },
        open: { rotate: -45, y: -6 },
      }}
      style={{ height: '2px', background: '#fff', width: '100%' }}
    ></motion.div>
  </motion.div>
);

export default function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setHasMounted(true);
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Set initial values
    handleResize();
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const navLinks = [
    { text: 'Pricing', href: '#pricing' },
    { text: 'Features', href: '#features' },
    { text: 'Contact', href: '#contact' },
  ];

  // Responsive width calculation
  const getHeaderWidth = () => {
    if (windowWidth <= 480) return '95%'; // Mobile
    if (windowWidth <= 768) return '90%'; // Small tablet
    if (windowWidth <= 1024) return '85%'; // Tablet
    if (windowWidth <= 1200) return '70%'; // Small desktop
    return '35%'; // Large desktop
  };

  const getHeaderPadding = () => {
    if (windowWidth <= 768) return '10px 16px'; // Mobile/tablet
    return '12px 20px'; // Desktop
  };

  const getHeaderTop = () => {
    if (windowWidth <= 768) return '12px'; // Mobile/tablet
    return '16px'; // Desktop
  };

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <motion.header
        style={{
          position: 'fixed',
          top: getHeaderTop(),
          left: '50%',
          width: getHeaderWidth(),
          maxWidth: '855px',
          minWidth: '320px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: getHeaderPadding(),
          borderRadius: windowWidth <= 768 ? '20px' : '40px',
          border: '1px solid',
        }}
        variants={{
          hidden: { y: -100, x: '-50%' },
          top: {
            y: 0,
            x: '-50%',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(18, 18, 18, 0.4)',
          },
          scrolled: {
            y: 0,
            x: '-50%',
            backgroundColor: 'rgba(10, 10, 10, 0.8)',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(16px)',
          }
        }}
        initial="hidden"
        animate={isScrolled ? "scrolled" : "top"}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Logo isMobile={windowWidth <= 768} />
        <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: windowWidth <= 1024 ? '16px' : '24px' }}>
          {navLinks.map(link => <NavLink key={link.text} {...link} />)}
          <AuthButtons />
        </nav>
        <div className="mobile-nav">
          <MenuButton toggle={() => setMenuOpen(!isMenuOpen)} isOpen={isMenuOpen} />
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 99,
            }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ 
                type: 'spring',
                damping: 25,
                stiffness: 300,
                mass: 0.8
              }}
              style={{
                background: 'linear-gradient(180deg, rgba(15, 15, 15, 0.98) 0%, rgba(25, 25, 25, 0.98) 100%)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderTop: 'none',
                borderRadius: '0 0 32px 32px',
                padding: '20px 24px 32px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: windowWidth <= 480 ? '100vh' : '70vh',
                maxHeight: '100vh',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative gradient overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                opacity: 0.8
              }} />
              
              {/* Header Section */}
              {/* <motion.div 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  width: '100%',
                  paddingTop: '16px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <Logo isMobile={true} />
                <motion.div 
                  onClick={() => setMenuOpen(false)} 
                  style={{cursor: 'pointer'}}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                   <MenuButton toggle={() => setMenuOpen(false)} isOpen={isMenuOpen} />
                </motion.div>
              </motion.div> */}
              
              {/* Navigation Section */}
              <motion.div 
                style={{
                  flex: 1,
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  gap: '16px',
                  paddingTop: '32px',
                  paddingBottom: '32px'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.text}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.3 + index * 0.1, 
                      duration: 0.4,
                      type: 'spring',
                      stiffness: 200,
                      damping: 20
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                      backdropFilter: 'blur(10px)',
                      position: 'relative'
                    }}
                    whileHover={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink 
                      key={link.text} 
                      {...link} 
                      isMobile={true}
                      onClick={() => setMenuOpen(false)}
                    />
                  </motion.div>
                ))}
              </motion.div>
                
              {/* Auth Buttons Section */}
              <motion.div 
                style={{
                  width: '100%', 
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <AuthButtons isMobile={true} />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .desktop-nav {
          display: flex;
          align-items: center;
        }
        .mobile-nav {
          display: none;
        }
        
        /* Large Tablet and Mobile Breakpoints */
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
        
        /* Tablet Adjustments */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
        
        /* Small Mobile Adjustments */
        @media (max-width: 480px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
        
        /* Extra Small Mobile */
        @media (max-width: 375px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
        
        /* Very Small Mobile */
        @media (max-width: 320px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav {
            display: block !important;
          }
        }
        
        /* Large Desktop - Show more navigation items */
        @media (min-width: 1200px) {
          .desktop-nav {
            gap: 32px;
          }
        }
        
        /* Ultra-wide screens */
        @media (min-width: 1600px) {
          .desktop-nav {
            gap: 40px;
          }
        }
        
        /* Landscape mobile orientation - Force mobile nav */
        @media (max-height: 500px) and (orientation: landscape) and (max-width: 1024px) {
          .mobile-nav {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
        }
        
        /* Portrait tablet orientation */
        @media (orientation: portrait) and (max-width: 1024px) {
          .mobile-nav {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
        }
        
        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
          .desktop-nav, .mobile-nav {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        }
        
        /* Touch device optimization */
        @media (pointer: coarse) {
          .mobile-nav {
            display: block !important;
          }
          .desktop-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
