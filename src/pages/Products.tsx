import React, { useState, useMemo } from "react";
import {
  Search,
  LayoutGrid,
  Table,
  DollarSign,
  Package,
  ShoppingCart,
  ShoppingBag,
  ChevronDown,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type {
  RecruitPartnerPayload,
  ProductSortBy,
  ProductViewMode,
} from "../interface";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { SectionCard, StatCard } from "../components/Base";
import { TopProductsTable } from "../components/Table";
import { RecruitModal, useForm } from "../components/Page/Dashboard";
import { useToast } from "../components/Common/Toast";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useToast();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProductSortBy>("earned");
  const [viewMode, setViewMode] = useState<ProductViewMode>("auto");
  const [recruitForm] = useForm<RecruitPartnerPayload>();

  const { data: me } = useQuery({
    queryKey: ["partner-me"],
    queryFn: partnerApi.me,
  });

  const { data: topProducts = [], isLoading } = useQuery({
    queryKey: ["partner-top-products"],
    queryFn: partnerApi.topProducts,
  });

  const recruitMutation = useMutation({
    mutationFn: (payload: RecruitPartnerPayload) => partnerApi.recruit(payload),
    onSuccess: () => {
      message.success(
        "Partner recruited. Share their login details with them.",
      );
      setRecruitOpen(false);
      recruitForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["partner-recruits"] });
    },
    onError: (err: any) =>
      message.error(
        err.response?.data?.detail?.error?.message ??
          "Could not recruit this partner.",
      ),
  });

  const signOut = () => {
    partnerApi.logout();
    navigate("/login", { replace: true });
  };

  const submitRecruit = async () => {
    let values: RecruitPartnerPayload;
    try {
      values = await recruitForm.validateFields();
    } catch {
      return;
    }
    recruitMutation.mutate({
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || undefined,
      password: values.password,
    });
  };

  // KPI Calculations
  const totalCommission = useMemo(
    () => topProducts.reduce((sum, p) => sum + (p.total_earned || 0), 0),
    [topProducts],
  );
  const totalUnits = useMemo(
    () => topProducts.reduce((sum, p) => sum + (p.units || 0), 0),
    [topProducts],
  );
  const totalOrders = useMemo(
    () => topProducts.reduce((sum, p) => sum + (p.orders || 0), 0),
    [topProducts],
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...topProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          p.product_id.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sortBy === "earned") return b.total_earned - a.total_earned;
      if (sortBy === "units") return b.units - a.units;
      if (sortBy === "orders") return b.orders - a.orders;
      if (sortBy === "name")
        return a.product_name.localeCompare(b.product_name);
      return 0;
    });

    return list;
  }, [topProducts, searchQuery, sortBy]);

  return (
    <div className="relative h-screen max-h-screen overflow-hidden box-border bg-slate-50 sm:bg-gradient-to-br sm:from-[#A51F60] sm:to-[#880E4F] p-0 sm:p-3 flex">
      {/* Polished ambient glass highlights & specular reflections (preserves brand colors) */}
      <div
        className="pointer-events-none absolute inset-0 hidden sm:block overflow-hidden"
        aria-hidden="true"
      >
        {/* Top-left soft specular glow */}
        <div className="absolute -top-[15%] -left-[10%] h-[420px] w-[420px] rounded-full bg-white/10 blur-[85px]" />
        {/* Center ambient fill for depth */}
        <div className="absolute top-1/3 left-1/3 h-[320px] w-[320px] rounded-full bg-pink-300/[0.08] blur-[95px]" />
        {/* Bottom specular reflection */}
        <div className="absolute -bottom-[20%] right-[10%] h-[380px] w-[380px] rounded-full bg-white/[0.07] blur-[85px]" />
        {/* Crisp glass rim light on top edge */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        activeTab="products"
        onSelectTab={() => {}}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />

      <div className="custom-scrollbar relative z-10 min-w-0 flex-1 h-screen sm:h-[calc(100vh-24px)] max-h-screen sm:max-h-[calc(100vh-24px)] overflow-y-auto rounded-none sm:rounded-[17px] bg-slate-50 shadow-none sm:shadow-[0_20px_40px_rgba(15,23,42,.25)] sm:ring-1 sm:ring-white/20">
        <Header onSignOut={signOut} title="Products" />

        <main className="m-0 w-auto max-w-none bg-slate-50 px-3 sm:px-7 pb-24 sm:pb-[30px] pt-1">
          {/* Overview Stat Cards */}
          <SectionCard
            title="Products Performance Overview"
            icon={<ShoppingBag className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <StatCard
                  title="TOTAL PRODUCT EARNINGS"
                  value={totalCommission}
                  icon={<DollarSign className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
                />
              </div>
              <div>
                <StatCard
                  title="TOTAL UNITS SOLD"
                  value={totalUnits}
                  prefix=""
                  precision={0}
                  icon={<Package className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
              </div>
              <div>
                <StatCard
                  title="TOTAL ORDERS GENERATED"
                  value={totalOrders}
                  prefix=""
                  precision={0}
                  icon={<ShoppingCart className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-emerald-600 to-teal-500"
                />
              </div>
            </div>
          </SectionCard>

          {/* Top Products Table & Grid Card */}
          <SectionCard
            title="Top Products"
            icon={<ShoppingBag className="h-5 w-5" />}
            extraHeader={
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="hidden sm:inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => setViewMode("auto")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 ${
                      viewMode === "auto"
                        ? "bg-white text-pink-700 shadow-sm"
                        : "bg-transparent text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("table")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
                      viewMode === "table"
                        ? "bg-white text-pink-700 shadow-sm"
                        : "bg-transparent text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <Table className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-0 flex items-center gap-1.5 ${
                      viewMode === "grid"
                        ? "bg-white text-pink-700 shadow-sm"
                        : "bg-transparent text-slate-600 hover:text-slate-800"
                    }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                </div>
              </div>
            }
          >
            {/* Filter and Search Bar */}
            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-0 bg-transparent p-0 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Sort by:
                </span>
                <div className="relative w-44">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                  >
                    <option value="earned">Highest Earned</option>
                    <option value="units">Most Units Sold</option>
                    <option value="orders">Most Orders</option>
                    <option value="name">Product Name (A-Z)</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Top Products Table (Desktop) / Grid (Mobile) */}
            {filteredProducts.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
                <Package className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm text-slate-500 m-0">
                  {searchQuery
                    ? "No products matching your search."
                    : "No product has earned you commission yet."}
                </p>
              </div>
            ) : (
              <TopProductsTable
                products={filteredProducts}
                loading={isLoading}
                viewMode={viewMode}
              />
            )}
          </SectionCard>

          <p className="mt-4 block text-xs text-slate-500 m-0">
            Product commissions are earned based on selected items purchased by
            referred customers.
          </p>
        </main>
      </div>

      <RecruitModal
        open={recruitOpen}
        onOk={submitRecruit}
        onCancel={() => {
          setRecruitOpen(false);
          recruitForm.resetFields();
        }}
        confirmLoading={recruitMutation.isPending}
        form={recruitForm}
      />
    </div>
  );
};

export default Products;
