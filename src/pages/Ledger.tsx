import React, { useState, useMemo } from "react";
import {
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  ChevronDown,
  X,
  RotateCcw,
  Crown,
  GitFork,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type {
  RecruitPartnerPayload,
  LedgerSortBy,
  LedgerStatusFilter,
  LedgerLevelFilter,
} from "../interface";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { SectionCard, StatCard } from "../components/Base";
import { CommissionTable } from "../components/Table";
import { RecruitModal, useForm } from "../components/Page/Dashboard";
import { useToast } from "../components/Common/Toast";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";

const Ledger: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useToast();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LedgerStatusFilter>("all");
  const [levelFilter, setLevelFilter] = useState<LedgerLevelFilter>("all");
  const [sortBy, setSortBy] = useState<LedgerSortBy>("newest");
  const [recruitForm] = useForm<RecruitPartnerPayload>();

  const { data: me } = useQuery({
    queryKey: ["partner-me"],
    queryFn: partnerApi.me,
  });

  const { data: commissions = [], isLoading } = useQuery({
    queryKey: ["partner-commissions"],
    queryFn: partnerApi.commissions,
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
  const claimable = me?.totals?.claimable ?? 0;

  const level1Earned = useMemo(() => {
    if (me?.byLevel?.level1 !== undefined && me.byLevel.level1 > 0) {
      return me.byLevel.level1;
    }
    const computed = commissions
      .filter((c) => c.level === 1 && c.status !== "reversed")
      .reduce((sum, c) => sum + c.amount, 0);
    return computed > 0 ? computed : (me?.byLevel?.level1 ?? 0);
  }, [me?.byLevel?.level1, commissions]);

  const level2Earned = useMemo(() => {
    if (me?.byLevel?.level2 !== undefined && me.byLevel.level2 > 0) {
      return me.byLevel.level2;
    }
    const computed = commissions
      .filter((c) => c.level === 2 && c.status !== "reversed")
      .reduce((sum, c) => sum + c.amount, 0);
    return computed > 0 ? computed : (me?.byLevel?.level2 ?? 0);
  }, [me?.byLevel?.level2, commissions]);

  const totalRecorded = useMemo(
    () =>
      commissions.reduce(
        (sum, c) => sum + (c.status !== "reversed" ? c.amount : 0),
        0,
      ),
    [commissions],
  );

  const totalEarned = useMemo(() => {
    if (totalRecorded > 0) return totalRecorded;
    const totalsSum =
      (me?.totals?.pending ?? 0) +
      (me?.totals?.claimable ?? 0) +
      (me?.totals?.paid ?? 0);
    if (totalsSum > 0) return totalsSum;
    return level1Earned + level2Earned;
  }, [totalRecorded, me?.totals, level1Earned, level2Earned]);

  // Filter and sort commissions
  const filteredCommissions = useMemo(() => {
    let list = [...commissions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((c) => {
        const orderMatch = c.order_number?.toLowerCase().includes(q);
        const lineMatch = c.lines?.some((l) =>
          l.product_name.toLowerCase().includes(q),
        );
        return orderMatch || lineMatch;
      });
    }

    if (statusFilter !== "all") {
      list = list.filter((c) => c.status === statusFilter);
    }

    if (levelFilter !== "all") {
      const lvl = parseInt(levelFilter, 10);
      list = list.filter((c) => c.level === lvl);
    }

    list.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()
        );
      }
      if (sortBy === "highest") {
        return b.amount - a.amount;
      }
      if (sortBy === "lowest") {
        return a.amount - b.amount;
      }
      return 0;
    });

    return list;
  }, [commissions, searchQuery, statusFilter, levelFilter, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    levelFilter !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setLevelFilter("all");
    setSortBy("newest");
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden box-border bg-gradient-to-br from-[#A51F60] to-[#880E4F] p-3 flex">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        activeTab="commissions"
        onSelectTab={() => {}}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />

      <div className="custom-scrollbar min-w-0 flex-1 h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[17px] bg-slate-50 shadow-[0_20px_40px_rgba(15,23,42,.25)]">
        <Header onSignOut={signOut} title="Commission Ledger" />

        <main className="m-0 w-auto max-w-none bg-slate-50 px-4 sm:px-7 pb-[30px] pt-1">
          {/* Overview Stat Cards */}
          <SectionCard
            title="Ledger Financial Overview"
            icon={<DollarSign className="h-5 w-5" />}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <StatCard
                  title="LEVEL 1 EARNED"
                  value={level1Earned}
                  icon={<Crown className="h-6 w-6" />}
                  colorScheme="rose"
                />
              </div>
              <div>
                <StatCard
                  title="LEVEL 2 EARNED"
                  value={level2Earned}
                  icon={<GitFork className="h-6 w-6" />}
                  colorScheme="purple"
                />
              </div>
              <div>
                <StatCard
                  title="TOTAL EARNED"
                  value={totalEarned}
                  icon={<TrendingUp className="h-6 w-6" />}
                  colorScheme="blue"
                />
              </div>
              <div>
                <StatCard
                  title="READY TO CLAIM"
                  value={claimable}
                  icon={<DollarSign className="h-6 w-6" />}
                  colorScheme="emerald"
                />
              </div>
            </div>
          </SectionCard>

          {/* Ledger Table Section */}
          <SectionCard
            title="Commission Statements"
            icon={<FileText className="h-5 w-5" />}
            extraHeader={
              <span className="text-xs font-semibold text-slate-500">
                {filteredCommissions.length} of {commissions.length} entries
              </span>
            }
          >
            {/* Filter and Search Bar */}
            <div className="mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by order # or product name..."
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

              <div className="flex flex-wrap items-center gap-2">
                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="claimable">Ready (Claimable)</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="reversed">Cancelled (Reversed)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Level Filter */}
                <div className="relative">
                  <select
                    value={levelFilter}
                    onChange={(e) => setLevelFilter(e.target.value)}
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                  >
                    <option value="all">All Levels</option>
                    <option value="1">Level 1 (Direct)</option>
                    <option value="2">Level 2 (Team)</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                  >
                    <option value="newest">Newest Date</option>
                    <option value="oldest">Oldest Date</option>
                    <option value="highest">Highest Amount</option>
                    <option value="lowest">Lowest Amount</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                </div>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="h-10 inline-flex items-center gap-1.5 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:text-pink-600 hover:border-pink-200 transition-all cursor-pointer"
                    title="Reset filters"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Commissions Table Component */}
            {filteredCommissions.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
                <FileText className="h-10 w-10 text-slate-300 mb-2" />
                <p className="text-sm font-medium text-slate-700 m-0">
                  {hasActiveFilters
                    ? "No commission entries match your filters."
                    : "No commission recorded yet."}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700 underline cursor-pointer border-0 bg-transparent"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            ) : (
              <CommissionTable
                commissions={filteredCommissions}
                loading={isLoading}
              />
            )}
          </SectionCard>

          <p className="mt-4 block text-xs text-slate-500 m-0">
            Commission is settled by the finance team; this ledger is the
            statement it is reconciled against.
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

export default Ledger;
