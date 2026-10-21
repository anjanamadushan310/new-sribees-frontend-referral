import { useState, useEffect } from "react";

/**
 * Hook to detect if current viewport is mobile screen (< breakpoint px).
 * Defaults to 768px (standard md breakpoint).
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      if (window.matchMedia) {
        return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
      }
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
      const handler = (e: MediaQueryListEvent) => {
        setIsMobile(e.matches);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
        setIsMobile(mediaQuery.matches);
        return () => mediaQuery.removeEventListener("change", handler);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handler);
        setIsMobile(mediaQuery.matches);
        return () => mediaQuery.removeListener(handler);
      }
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isMobile;
}
