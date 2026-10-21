import { useState, useEffect } from "react";

/**
 * Returns whether the sidebar should be collapsed by default based on screen size:
 * - sm <= screen size < lg (640px to 1023px): collapsed by default (true)
 * - < sm (< 640px): collapsed (true)
 * - >= lg (>= 1024px): expanded by default (false)
 */
export function getDefaultSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia) {
    return window.matchMedia("(max-width: 1023px)").matches;
  }
  return window.innerWidth < 1024;
}

/**
 * Hook to manage sidebar collapsed state with responsive defaults:
 * - Automatically initializes to true (collapsed) when width < 1024px (sm <= width < lg, and mobile).
 * - Automatically initializes to false (expanded) when width >= 1024px (lg+).
 * - Updates state when screen crosses the lg (1024px) breakpoint.
 * - Allows manual toggling at any time.
 */
export function useSidebarCollapse(): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] {
  const [collapsed, setCollapsed] = useState<boolean>(getDefaultSidebarCollapsed);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(min-width: 1024px)");
      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        // When >= 1024px, default to expanded (false); when < 1024px, default to collapsed (true)
        setCollapsed(!e.matches);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
      }
    }

    const handleResize = () => {
      setCollapsed(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [collapsed, setCollapsed];
}
