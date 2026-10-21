import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import LogoutModal from "../../components/SideBar/LogoutModal";

describe("LogoutModal", () => {
  it("renders nothing when open is false", () => {
    const { container } = render(
      <LogoutModal open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders modal when open is true", () => {
    render(
      <LogoutModal open={true} onConfirm={vi.fn()} onCancel={vi.fn()} />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm Log Out")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Are you sure you want to log out? You will need to sign in again to access your account."
      )
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /yes, log out/i })
    ).toBeInTheDocument();
  });

  it("calls onConfirm when Yes, Log Out button is clicked", () => {
    const onConfirm = vi.fn();
    render(
      <LogoutModal open={true} onConfirm={onConfirm} onCancel={vi.fn()} />
    );

    fireEvent.click(screen.getByRole("button", { name: /yes, log out/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <LogoutModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Close (X) button is clicked", () => {
    const onCancel = vi.fn();
    render(
      <LogoutModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when backdrop overlay is clicked", () => {
    const onCancel = vi.fn();
    render(
      <LogoutModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />
    );

    fireEvent.click(screen.getByRole("dialog"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when Escape key is pressed", () => {
    const onCancel = vi.fn();
    render(
      <LogoutModal open={true} onConfirm={vi.fn()} onCancel={onCancel} />
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
