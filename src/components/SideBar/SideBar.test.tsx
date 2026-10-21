import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SideBar from "./SideBar";

const defaultProps = {
  collapsed: false,
  onToggleCollapse: vi.fn(),
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

  describe("Desktop screen", () => {
    beforeEach(() => {
      // Desktop: matchMedia does not match max-width 767px
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));
    });

    it("renders expanded state with labels and toggle button when collapsed=false", () => {
      const { container } = renderSideBar({ collapsed: false });

      expect(screen.getByText("Main Logo")).toBeInTheDocument();
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
      const { container } = renderSideBar({ collapsed: true });

      expect(screen.queryByText("Main Logo")).not.toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[76px]");
    });
  });

  describe("Mobile screen", () => {
    beforeEach(() => {
      // Mobile: matchMedia matches max-width 767px
      window.matchMedia = vi.fn().mockImplementation((query) => ({
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
      const { container } = renderSideBar({ collapsed: false });

      // Labels should not be visible
      expect(screen.queryByText("Main Logo")).not.toBeInTheDocument();
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
