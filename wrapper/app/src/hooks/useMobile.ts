import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('md');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const newIsMobile = width < 768;
      const newIsTablet = width >= 768 && width < 1024;
      let newScreenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
      
      if (width < 600) newScreenSize = 'xs';
      else if (width < 900) newScreenSize = 'sm';
      else if (width < 1200) newScreenSize = 'md';
      else if (width < 1536) newScreenSize = 'lg';
      else newScreenSize = 'xl';
      
      setIsMobile(newIsMobile);
      setIsTablet(newIsTablet);
      setScreenSize(newScreenSize);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  return { isMobile, isTablet, screenSize };
};