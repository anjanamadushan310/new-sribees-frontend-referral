import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SideBar from "./SideBar";

const defaultProps = {
  activeTab: "dashboard",
  onSelectTab: vi.fn(),
  hasUpline: false,
  onOpenRecruit: vi.fn(),
  onSignOut: vi.fn(),
};

function renderSideBar(props = {}) {
  return render(
    <MemoryRouter>
      <SideBar {...defaultProps} {...props} />
    </MemoryRouter>
  );
}

describe("SideBar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Desktop screen (>= lg)", () => {
    beforeEach(() => {
      // Desktop: matches min-width: 1024px, does not match max-width
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("min-width: 1024px"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it("defaults to expanded state with labels and toggle button when uncontrolled", () => {
      const { container } = renderSideBar();

      expect(screen.getByText("SRIBEES")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[264px]");
    });

    it("renders expanded state with labels and toggle button when collapsed=false", () => {
      const { container } = renderSideBar({ collapsed: false, onToggleCollapse: vi.fn() });

      expect(screen.getByText("SRIBEES")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Ledger")).toBeInTheDocument();
      expect(screen.getByText("My Customers")).toBeInTheDocument();
      expect(screen.getByText("My Team")).toBeInTheDocument();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[264px]");
    });

    it("calls onToggleCollapse when toggle button is clicked", () => {
      const onToggleCollapse = vi.fn();
      renderSideBar({ collapsed: false, onToggleCollapse });

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      fireEvent.click(toggleButton);

      expect(onToggleCollapse).toHaveBeenCalledTimes(1);
    });

    it("renders collapsed state when collapsed=true", () => {
      const { container } = renderSideBar({ collapsed: true, onToggleCollapse: vi.fn() });

      expect(screen.queryByText("SRIBEES")).not.toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[76px]");
    });
  });

  describe("Tablet / Mid-range screen (sm <= screen < lg)", () => {
    beforeEach(() => {
      // sm <= screen < lg: matches max-width: 1023px, does not match max-width: 639px (not mobile)
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("1023px"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it("defaults to collapsed state but shows toggle button", () => {
      const { container } = renderSideBar();

      // Labels should not be visible by default
      expect(screen.queryByText("SRIBEES")).not.toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

      // But toggle button SHOULD be present
      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[76px]");
    });

    it("toggles to expanded when user clicks the toggle button", () => {
      const { container } = renderSideBar();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      fireEvent.click(toggleButton);

      // Now it should be expanded
      expect(screen.getByText("SRIBEES")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[264px]");
    });
  });

  describe("Mobile screen (< sm)", () => {
    beforeEach(() => {
      // Mobile: matchMedia matches max-width 639px
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("max-width"),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it("remains collapsed even if collapsed=false is passed", () => {
      const { container } = renderSideBar({ collapsed: false, onToggleCollapse: vi.fn() });

      // Labels should not be visible
      expect(screen.queryByText("SRIBEES")).not.toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
      expect(screen.queryByText("Products")).not.toBeInTheDocument();

      // Toggle button should not be displayed on mobile
      expect(screen.queryByRole("button", { name: "Toggle sidebar" })).not.toBeInTheDocument();

      // Sidebar should have collapsed width class (w-[76px])
      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[76px]");
    });
  });
});
