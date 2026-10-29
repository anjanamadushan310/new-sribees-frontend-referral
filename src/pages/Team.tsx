import React, { useState, useMemo } from "react";
import {
  Users,
  UserCheck,
  DollarSign,
  Award,
  Search,
  ChevronDown,
  X,
  UserPlus,
  ShieldAlert,
  RotateCcw,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type {
  RecruitPartnerPayload,
  TeamStatusFilter,
  TeamSortBy,
} from "../interface";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { SectionCard, StatCard } from "../components/Base";
import { RecruitTable } from "../components/Table";
import { RecruitModal, useForm } from "../components/Page/Dashboard";
import { useToast } from "../components/Common/Toast";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";

const Team: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useToast();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TeamStatusFilter>("all");
  const [sortBy, setSortBy] = useState<TeamSortBy>("earned");
  const [recruitForm] = useForm<RecruitPartnerPayload>();

  const { data: me } = useQuery({
    queryKey: ["partner-me"],
    queryFn: partnerApi.me,
  });

  const { data: recruits = [], isLoading } = useQuery({
    queryKey: ["partner-recruits"],
    queryFn: partnerApi.recruits,
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
  const totalTeamMembers = recruits.length;
  const activePartners = useMemo(
    () => recruits.filter((r) => r.is_active).length,
    [recruits],
  );
  const level2Earned = useMemo(
    () =>
      me?.byLevel?.level2 ??
      recruits.reduce((sum, r) => sum + (r.total_earned || 0), 0),
    [me, recruits],
  );
  const avgPerRecruit =
    totalTeamMembers > 0 ? level2Earned / totalTeamMembers : 0;

  // Filter and sort recruits
  const filteredRecruits = useMemo(() => {
    let list = [...recruits];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.partner_id.toLowerCase().includes(q),
      );
    }

    if (statusFilter === "active") {
      list = list.filter((r) => r.is_active);
    } else if (statusFilter === "inactive") {
      list = list.filter((r) => !r.is_active);
    }

    list.sort((a, b) => {
      if (sortBy === "earned") {
        return (b.total_earned || 0) - (a.total_earned || 0);
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
  }, [recruits, searchQuery, statusFilter, sortBy]);

  const hasActiveFilters = searchQuery.trim() !== "" || statusFilter !== "all";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("earned");
  };

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
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        activeTab="recruits"
        onSelectTab={() => {}}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />

      <div className="custom-scrollbar relative z-10 min-w-0 flex-1 h-screen sm:h-[calc(100vh-24px)] max-h-screen sm:max-h-[calc(100vh-24px)] overflow-y-auto rounded-none sm:rounded-[17px] bg-slate-50 shadow-none sm:shadow-[0_20px_40px_rgba(15,23,42,.25)] sm:ring-1 sm:ring-white/20">
        <Header onSignOut={signOut} title="My Team" />

        <main className="m-0 w-auto max-w-none bg-slate-50 px-3 sm:px-7 pb-24 sm:pb-[30px] pt-1">
          {me?.hasUpline ? (
            /* Restricted Tier Notice */
            <div className="mb-6 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-6 text-slate-800">
              <div className="flex items-start gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="m-0 text-base font-bold text-amber-900">
                    Partner Account
                  </h3>
                  <p className="mt-1 text-sm text-amber-800/90 leading-relaxed m-0">
                    Your account belongs to a Master Partner. Only Master Partners
                    can recruit Partners. You continue to earn Level 1
                    commissions on your direct customer referrals.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Overview Stat Cards */}
              <SectionCard
                title="Team Performance Overview"
                icon={<Users className="h-5 w-5" />}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <StatCard
                      title="TOTAL TEAM MEMBERS"
                      value={totalTeamMembers}
                      prefix=""
                      precision={0}
                      icon={<Users className="h-6 w-6" />}
                      gradientClass="bg-gradient-to-br from-purple-500 to-indigo-600"
                    />
                  </div>
                  <div>
                    <StatCard
                      title="ACTIVE PARTNERS"
                      value={activePartners}
                      prefix=""
                      precision={0}
                      icon={<UserCheck className="h-6 w-6" />}
                      gradientClass="bg-gradient-to-br from-emerald-500 to-teal-600"
                    />
                  </div>
                  <div>
                    <StatCard
                      title="LEVEL 2 EARNINGS"
                      value={level2Earned}
                      icon={<DollarSign className="h-6 w-6" />}
                      gradientClass="bg-gradient-to-br from-pink-500 to-rose-600"
                    />
                  </div>
                  <div>
                    <StatCard
                      title="AVG. EARNED / PARTNER"
                      value={avgPerRecruit}
                      icon={<Award className="h-6 w-6" />}
                      gradientClass="bg-gradient-to-br from-amber-500 to-orange-600"
                    />
                  </div>
                </div>
              </SectionCard>

              {/* Team Table Section */}
              <SectionCard
                title="Team Members & Recruits"
                icon={<Users className="h-5 w-5" />}
                extraHeader={
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        recruitForm.resetFields();
                        setRecruitOpen(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-pink-700 transition-colors cursor-pointer border-0"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Recruit Partner</span>
                    </button>
                    <span className="hidden sm:inline text-xs font-semibold text-slate-500">
                      {filteredRecruits.length} of {recruits.length} members
                    </span>
                  </div>
                }
              >
                {/* Search & Filter Toolbar */}
                <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search partner by name or ID..."
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
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>

                    {/* Sort By */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="h-10 appearance-none rounded-xl border border-slate-200 bg-white px-3.5 pr-8 text-xs font-medium text-slate-700 focus:outline-none focus:border-pink-600 focus:ring-2 focus:ring-pink-100 transition-all cursor-pointer"
                      >
                        <option value="earned">Highest L2 Earned</option>
                        <option value="recent">Recently Joined</option>
                        <option value="name">Partner Name (A-Z)</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
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

                {/* Recruits Table Component */}
                {filteredRecruits.length === 0 && !isLoading ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
                    <Users className="h-10 w-10 text-slate-300 mb-2" />
                    <p className="text-sm font-medium text-slate-700 m-0">
                      {hasActiveFilters
                        ? "No team members match your filters."
                        : "You have not recruited any partners yet."}
                    </p>
                    {!hasActiveFilters && (
                      <button
                        type="button"
                        onClick={() => {
                          recruitForm.resetFields();
                          setRecruitOpen(true);
                        }}
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-pink-700 transition-colors cursor-pointer border-0"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Recruit Your First Partner</span>
                      </button>
                    )}
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-3 text-xs font-semibold text-pink-600 hover:text-pink-700 underline cursor-pointer border-0 bg-transparent"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  <RecruitTable
                    recruits={filteredRecruits}
                    loading={isLoading}
                  />
                )}
              </SectionCard>
            </>
          )}

          <p className="mt-4 block text-xs text-slate-500 m-0">
            You earn Level 2 commissions from sales made by the partners you
            recruit.
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

export default Team;
