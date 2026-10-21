import React, { useState, useMemo } from "react";
import {
  User,
  Users,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Search,
  ChevronDown,
  X,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type { RecruitPartnerPayload, CustomerSortBy } from "../interface";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { SectionCard, StatCard } from "../components/Base";
import { CustomerTable } from "../components/Table";
import { RecruitModal, useForm } from "../components/Page/Dashboard";
import { useToast } from "../components/Common/Toast";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useToast();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CustomerSortBy>("earned");
  const [recruitForm] = useForm<RecruitPartnerPayload>();

  const { data: me } = useQuery({
    queryKey: ["partner-me"],
    queryFn: partnerApi.me,
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["partner-customers"],
    queryFn: partnerApi.customers,
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
  const totalCustomers = customers.length;
  const totalEarned = useMemo(
    () => customers.reduce((sum, c) => sum + (c.total_earned || 0), 0),
    [customers],
  );
  const totalOrders = useMemo(
    () => customers.reduce((sum, c) => sum + (c.orders || 0), 0),
    [customers],
  );
  const avgEarned = totalCustomers > 0 ? totalEarned / totalCustomers : 0;

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let list = [...customers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.member_id.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sortBy === "earned") {
        return (b.total_earned || 0) - (a.total_earned || 0);
      }
      if (sortBy === "orders") {
        return (b.orders || 0) - (a.orders || 0);
      }
      if (sortBy === "recent") {
        return (
          new Date(b.joined_at || 0).getTime() -
          new Date(a.joined_at || 0).getTime()
        );
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [customers, searchQuery, sortBy]);

  return (
    <div className="h-screen max-h-screen overflow-hidden box-border bg-gradient-to-br from-[#A51F60] to-[#880E4F] p-1.5 sm:p-3 flex">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        activeTab="customers"
        onSelectTab={() => {}}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />

      <div className="custom-scrollbar min-w-0 flex-1 h-[calc(100vh-12px)] sm:h-[calc(100vh-24px)] max-h-[calc(100vh-12px)] sm:max-h-[calc(100vh-24px)] overflow-y-auto rounded-[14px] sm:rounded-[17px] bg-slate-50 shadow-[0_20px_40px_rgba(15,23,42,.25)]">
        <Header onSignOut={signOut} title="My Customers" />

        <main className="m-0 w-auto max-w-none bg-slate-50 px-3 sm:px-7 pb-6 sm:pb-[30px] pt-1">
          {/* Customer Performance KPI Cards */}
          <SectionCard
            title="Customer Portfolio Overview"
            icon={<Users className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <StatCard
                  title="TOTAL CUSTOMERS"
                  value={totalCustomers}
                  prefix=""
                  icon={<Users className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
                />
              </div>
              <div>
                <StatCard
                  title="TOTAL EARNED"
                  value={totalEarned}
                  icon={<DollarSign className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-emerald-500 to-teal-600"
                />
              </div>
              <div>
                <StatCard
                  title="TOTAL ORDERS"
                  value={totalOrders}
                  prefix=""
                  icon={<ShoppingBag className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-blue-500 to-indigo-600"
                />
              </div>
              <div>
                <StatCard
                  title="AVG. EARNINGS / USER"
                  value={avgEarned}
                  icon={<TrendingUp className="h-6 w-6" />}
                  gradientClass="bg-gradient-to-br from-purple-500 to-indigo-600"
                />
              </div>
            </div>
          </SectionCard>

          {/* Customer Directory Table Card */}
          <SectionCard
            title="Customer Directory"
            icon={<User className="h-5 w-5" />}
            extraHeader={
              <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                {filteredCustomers.length} of {customers.length} customers
              </span>
            }
          >
            {/* Search and Sort Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by customer name or member ID..."
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
                    <option value="orders">Most Orders</option>
                    <option value="recent">Recently Joined</option>
                    <option value="name">Customer Name (A-Z)</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Customers Table Component */}
            {filteredCustomers.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
                <User className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-700 m-0">
                  {searchQuery
                    ? "No customers match your search query."
                    : "No one has signed up with your code yet."}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700 underline cursor-pointer border-0 bg-transparent"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <CustomerTable
                customers={filteredCustomers}
                loading={isLoading}
              />
            )}
          </SectionCard>

          <p className="mt-4 block text-xs text-slate-500 m-0">
            Customers who sign up using your referral code earn you direct
            commissions on their eligible purchases.
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

export default Customers;
