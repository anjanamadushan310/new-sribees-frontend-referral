import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSidebarCollapse, getDefaultSidebarCollapsed } from "./useSidebarCollapse";

describe("useSidebarCollapse", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getDefaultSidebarCollapsed", () => {
    it("returns true when viewport width is between sm and lg (< 1024px)", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("max-width: 1023px"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getDefaultSidebarCollapsed()).toBe(true);
    });

    it("returns false when viewport width is >= lg (>= 1024px)", () => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(getDefaultSidebarCollapsed()).toBe(false);
    });
  });

  describe("useSidebarCollapse hook", () => {
    it("initializes to collapsed (true) on tablet screens (< 1024px) and allows toggling", () => {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("max-width: 1023px"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useSidebarCollapse());

      expect(result.current[0]).toBe(true);

      act(() => {
        result.current[1]((prev) => !prev);
      });

      expect(result.current[0]).toBe(false);
    });

    it("initializes to expanded (false) on desktop screens (>= 1024px) and allows toggling", () => {
      window.matchMedia = vi.fn().mockImplementation(() => ({
        matches: false,
        media: "",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      const { result } = renderHook(() => useSidebarCollapse());

      expect(result.current[0]).toBe(false);

      act(() => {
        result.current[1]((prev) => !prev);
      });

      expect(result.current[0]).toBe(true);
    });
  });
});
