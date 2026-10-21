import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";

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

      expect(screen.getByText(/SRIB[EƎ]ES/)).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Top Products")).toBeInTheDocument();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[264px]");
    });

    it("renders expanded state with labels and toggle button when collapsed=false", () => {
      const { container } = renderSideBar({ collapsed: false, onToggleCollapse: vi.fn() });

      expect(screen.getByText(/SRIB[EƎ]ES/)).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Top Products")).toBeInTheDocument();
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

      expect(screen.queryByText(/SRIB[EƎ]ES/)).not.toBeInTheDocument();
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();

      const toggleButton = screen.getByRole("button", { name: "Toggle sidebar" });
      expect(toggleButton).toBeInTheDocument();

      const aside = container.querySelector("aside");
      expect(aside?.className).toContain("w-[76px]");
    });

    it("opens confirmation modal on clicking Log Out and calls onSignOut only on confirmation", () => {
      const onSignOut = vi.fn();
      renderSideBar({ onSignOut });

      const logoutBtn = screen.getByRole("button", { name: "Sidebar sign out" });
      fireEvent.click(logoutBtn);

      expect(screen.getByText("Confirm Log Out")).toBeInTheDocument();
      expect(onSignOut).not.toHaveBeenCalled();

      // Click cancel first
      fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
      expect(screen.queryByText("Confirm Log Out")).not.toBeInTheDocument();
      expect(onSignOut).not.toHaveBeenCalled();

      // Click logout again and confirm
      fireEvent.click(logoutBtn);
      expect(screen.getByText("Confirm Log Out")).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: /yes, log out/i }));
      expect(onSignOut).toHaveBeenCalledTimes(1);
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
      expect(screen.queryByText(/SRIB[EƎ]ES/)).not.toBeInTheDocument();
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
      expect(screen.getByText(/SRIB[EƎ]ES/)).toBeInTheDocument();
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

    it("renders mobile bottom navigation bar with Dashboard, Top Products, Ledger, and More", () => {
      const { container } = renderSideBar();

      // Desktop sidebar aside should not be rendered
      expect(container.querySelector("aside")).toBeNull();

      // Mobile bottom nav should be present
      const nav = screen.getByRole("navigation", { name: "Mobile Navigation" });
      expect(nav).toBeInTheDocument();

      expect(screen.getByRole("button", { name: "Dashboard" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Top Products" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Ledger" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();
    });

    it("clicking More opens bottom sheet with My Customers, My Team, Recruit Partner, and Logout", () => {
      renderSideBar();

      const moreButton = screen.getByRole("button", { name: "More" });
      fireEvent.click(moreButton);

      // Sheet header
      expect(screen.getByText("More Options")).toBeInTheDocument();

      // Items inside sheet
      expect(screen.getByText("My Customers")).toBeInTheDocument();
      expect(screen.getByText("My Team")).toBeInTheDocument();
      expect(screen.getByText("Recruit a Partner")).toBeInTheDocument();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
    });

    it("clicking Recruit a Partner calls onOpenRecruit and closes the sheet", () => {
      const onOpenRecruit = vi.fn();
      renderSideBar({ onOpenRecruit });

      fireEvent.click(screen.getByRole("button", { name: "More" }));

      const recruitButton = screen.getByText("Recruit a Partner").closest("button")!;
      fireEvent.click(recruitButton);

      expect(onOpenRecruit).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("More Options")).not.toBeInTheDocument();
    });

    it("clicking Log Out closes the sheet, opens confirmation modal, and calls onSignOut on confirm", () => {
      const onSignOut = vi.fn();
      renderSideBar({ onSignOut });

      fireEvent.click(screen.getByRole("button", { name: "More" }));

      const logoutButton = screen.getByText("Log Out").closest("button")!;
      fireEvent.click(logoutButton);

      expect(screen.queryByText("More Options")).not.toBeInTheDocument();
      expect(screen.getByText("Confirm Log Out")).toBeInTheDocument();
      expect(onSignOut).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole("button", { name: /yes, log out/i }));
      expect(onSignOut).toHaveBeenCalledTimes(1);
    });

    it("clicking My Customers calls onSelectTab and closes the sheet", () => {
      const onSelectTab = vi.fn();
      renderSideBar({ onSelectTab });

      fireEvent.click(screen.getByRole("button", { name: "More" }));

      const customersButton = screen.getByText("My Customers").closest("button")!;
      fireEvent.click(customersButton);

      expect(onSelectTab).toHaveBeenCalledWith("customers");
      expect(screen.queryByText("More Options")).not.toBeInTheDocument();
    });

    it("does not show My Team or Recruit Partner in More sheet when hasUpline is true", () => {
      renderSideBar({ hasUpline: true });

      fireEvent.click(screen.getByRole("button", { name: "More" }));

      expect(screen.getByText("My Customers")).toBeInTheDocument();
      expect(screen.getByText("Log Out")).toBeInTheDocument();
      expect(screen.queryByText("My Team")).not.toBeInTheDocument();
      expect(screen.queryByText("Recruit a Partner")).not.toBeInTheDocument();
    });

    it("closes the More sheet when close button is clicked", () => {
      renderSideBar();

      fireEvent.click(screen.getByRole("button", { name: "More" }));
      expect(screen.getByText("More Options")).toBeInTheDocument();

      const closeButton = screen.getByRole("button", { name: "Close menu" });
      fireEvent.click(closeButton);

      expect(screen.queryByText("More Options")).not.toBeInTheDocument();
    });
  });
});
