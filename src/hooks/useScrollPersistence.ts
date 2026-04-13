import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A hook that persists and restores the scroll position for a specific page.
 * Uses sessionStorage to store the scroll Y-offset keyed by the current pathname.
 */
export const useScrollPersistence = () => {
  const { pathname } = useLocation();
  const isRestored = useRef(false);

  // 1. Restore scroll position on mount
  useEffect(() => {
    isRestored.current = false;
    const savedScrollPos = sessionStorage.getItem(`scroll-${pathname}`);
    
    if (savedScrollPos) {
      // We use a longer timeout to ensure async content (auctions) has likely rendered
      // and the page has enough height to be scrolled.
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: parseInt(savedScrollPos, 10),
          behavior: 'instant' as ScrollBehavior,
        });
        isRestored.current = true;
      }, 350); // Increased to 350ms for reliability with async data
      
      return () => clearTimeout(timeoutId);
    } else {
      isRestored.current = true;
    }
  }, [pathname]);

  // 2. Save scroll position continuously (debounced)
  useEffect(() => {
    let timeoutId: number;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        // Only save if we've already tried to restore (or no restore needed)
        // to avoid saving '0' during the transition back to the page.
        if (isRestored.current) {
          sessionStorage.setItem(`scroll-${pathname}`, window.scrollY.toString());
        }
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [pathname]);
};
