import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "../../components/Common/Pagination";
import { CustomerTable } from "../../components/Table";
import { RecruitTable } from "../../components/Table";
import { CommissionTable } from "../../components/Table";
import { TopProductsTable } from "../../components/Table";
import type { PartnerCustomer, PartnerRecruit, PartnerCommission, PartnerTopProduct } from "../../api/partner.api";

describe("Pagination Component", () => {
  it("does not render pagination when total items is 10 or less", () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalItems={10}
        pageSize={10}
        onPageChange={() => {}}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders pagination controls when total items exceed page size", () => {
    const handlePageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalItems={25}
        pageSize={10}
        onPageChange={handlePageChange}
        itemLabel="customers"
      />
    );

    expect(screen.getByText(/Showing/)).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();

    // Check page numbers 1, 2, 3 buttons
    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();

    // Clicking next or page 2
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });
});

describe("CustomerTable Pagination", () => {
  const dummyCustomers: PartnerCustomer[] = Array.from({ length: 15 }, (_, i) => ({
    user_id: `cust-${i + 1}`,
    name: `Customer ${i + 1}`,
    member_id: `MB-${1000 + i + 1}`,
    joined_at: "2026-09-01T00:00:00Z",
    orders: i + 1,
    total_earned: (i + 1) * 100,
  }));

  it("limits display to 10 rows per page and navigates with pagination", () => {
    render(<CustomerTable customers={dummyCustomers} />);

    // Page 1 should display Customers 1 to 10
    expect(screen.getByText("Customer 1")).toBeInTheDocument();
    expect(screen.getByText("Customer 10")).toBeInTheDocument();
    expect(screen.queryByText("Customer 11")).not.toBeInTheDocument();

    // Pagination controls should be visible
    const page2Btn = screen.getByRole("button", { name: "Page 2" });
    expect(page2Btn).toBeInTheDocument();

    // Navigate to page 2
    fireEvent.click(page2Btn);

    // Page 2 should display Customers 11 to 15
    expect(screen.getByText("Customer 11")).toBeInTheDocument();
    expect(screen.getByText("Customer 15")).toBeInTheDocument();
    expect(screen.queryByText("Customer 1")).not.toBeInTheDocument();
  });
});

describe("TopProductsTable Pagination", () => {
  const dummyProducts: PartnerTopProduct[] = Array.from({ length: 12 }, (_, i) => ({
    product_id: `prod-${i + 1}`,
    product_name: `Product ${i + 1}`,
    orders: 10 - i,
    units: 20 - i,
    total_earned: 1000 - i * 50,
  }));

  it("limits display to 10 products per page and computes global rank correctly", () => {
    render(<TopProductsTable products={dummyProducts} viewMode="table" />);

    // Page 1: Product 1 to 10
    expect(screen.getByText("Product 1")).toBeInTheDocument();
    expect(screen.getByText("Product 10")).toBeInTheDocument();
    expect(screen.queryByText("Product 11")).not.toBeInTheDocument();

    // Page 2 button
    const page2Btn = screen.getByRole("button", { name: "Page 2" });
    fireEvent.click(page2Btn);

    // Page 2: Product 11 and 12
    expect(screen.getByText("Product 11")).toBeInTheDocument();
    expect(screen.getByText("Product 12")).toBeInTheDocument();
    expect(screen.queryByText("Product 1")).not.toBeInTheDocument();

    // Rank on page 2
    expect(screen.getAllByText("11").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("12").length).toBeGreaterThanOrEqual(1);
  });
});

describe("RecruitTable Pagination", () => {
  const dummyRecruits: PartnerRecruit[] = Array.from({ length: 14 }, (_, i) => ({
    partner_id: `rec-${i + 1}`,
    name: `Partner ${i + 1}`,
    joined_at: "2026-09-01T00:00:00Z",
    is_active: true,
    total_earned: (i + 1) * 200,
  }));

  it("limits display to 10 recruits and allows pagination", () => {
    render(<RecruitTable recruits={dummyRecruits} />);

    expect(screen.getByText("Partner 1")).toBeInTheDocument();
    expect(screen.getByText("Partner 10")).toBeInTheDocument();
    expect(screen.queryByText("Partner 11")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByText("Partner 11")).toBeInTheDocument();
    expect(screen.queryByText("Partner 1")).not.toBeInTheDocument();
  });
});

describe("CommissionTable Pagination", () => {
  const dummyCommissions: PartnerCommission[] = Array.from({ length: 13 }, (_, i) => ({
    commission_id: `comm-${i + 1}`,
    date: "2026-09-01T00:00:00Z",
    order_number: `ORD-${1000 + i + 1}`,
    level: 1,
    amount: (i + 1) * 50,
    rate_percentage: 5,
    status: "claimable",
    lines: [],
  }));

  it("limits display to 10 commission entries and allows pagination", () => {
    render(<CommissionTable commissions={dummyCommissions} />);

    expect(screen.getByText("ORD-1001")).toBeInTheDocument();
    expect(screen.getByText("ORD-1010")).toBeInTheDocument();
    expect(screen.queryByText("ORD-1011")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(screen.getByText("ORD-1011")).toBeInTheDocument();
    expect(screen.getByText("ORD-1013")).toBeInTheDocument();
    expect(screen.queryByText("ORD-1001")).not.toBeInTheDocument();
  });
});
