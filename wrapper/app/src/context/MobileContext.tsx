import React, { createContext, useContext } from 'react';
import { useMobile as useMobileDetection } from '../hooks/useMobile';

const MobileContext = createContext(null);

export const MobileProvider = ({ children }: { children: React.ReactNode }) => {
  const { isMobile, isTablet, screenSize } = useMobileDetection();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);

  return (
    <MobileContext.Provider value={{ isMobile, isTablet, screenSize, isMenuOpen, toggleMenu, closeMenu, openMenu }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (!context) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};
