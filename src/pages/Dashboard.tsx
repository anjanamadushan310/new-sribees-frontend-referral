/**
 * Partner dashboard — invite code, earnings, customers and recruits.
 *
 * A partner sees their customers' names and member ids, the commission earned
 * from each, and which products it came from (name, units, rate, earned).
 * Never what a customer paid: the API does not return the order or line value,
 * so this screen could not show it even by mistake.
 */
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type { RecruitPartnerPayload } from "../interface/partner";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import {
  ReferralSection,
  EarningsOverview,
  NetworkMetrics,
  CommissionBreakdown,
  RecruitModal,
  useForm,
} from "../components/Page/Dashboard";
import { useToast } from "../components/Common/Toast";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useToast();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
  const [recruitForm] = useForm<RecruitPartnerPayload>();

  const { data: me, isLoading, isError, refetch } = useQuery({
    queryKey: ["partner-me"],
    queryFn: partnerApi.me,
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["partner-customers"],
    queryFn: partnerApi.customers,
  });

  const { data: recruits = [] } = useQuery({
    queryKey: ["partner-recruits"],
    queryFn: partnerApi.recruits,
    enabled: me?.role === "master_partner" && me?.canRecruit === true,
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
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const copyCode = async () => {
    if (!me?.referralCode) return;
    try {
      await navigator.clipboard.writeText(me.referralCode);
      message.success("Referral code copied");
    } catch {
      message.error("Could not copy the code. Select and copy it manually.");
    }
  };

  const submitRecruit = async () => {
    if (me?.role !== "master_partner" || me?.canRecruit !== true) return;
    let values: RecruitPartnerPayload;
    try {
      values = await recruitForm.validateFields();
    } catch {
      // The form already shows what is missing; an invalid form is not
      // an error to throw (it surfaced as an unhandled rejection).
      return;
    }
    recruitMutation.mutate({
      full_name: values.full_name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || undefined,
      password: values.password,
    });
  };

  return (
    <div className="relative h-dvh max-h-dvh overflow-hidden box-border bg-slate-50 sm:bg-[#8B1447] p-0 sm:p-3 flex">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        activeTab="dashboard"
        onSelectTab={() => {}}
        isMasterPartner={me?.role === "master_partner" && me?.canRecruit === true}
        showWallet={Boolean(me?.linkedUserId)}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />
      <div className="custom-scrollbar relative z-10 min-w-0 flex-1 h-dvh sm:h-[calc(100dvh-24px)] max-h-dvh sm:max-h-[calc(100vh-24px)] overflow-y-auto rounded-none sm:rounded-[17px] bg-slate-50 shadow-none sm:ring-1 sm:ring-black/5">
        <Header onSignOut={signOut} />

        <main className="mx-auto w-full max-w-[1440px] bg-slate-50 px-4 sm:px-7 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-8 pt-4">
          {isError && <p role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">Your overview could not be loaded. <button onClick={() => refetch()} className="ml-2 font-semibold underline">Retry</button></p>}
          <div className="mb-6">
            <p className="mb-1 text-sm text-slate-500">{me?.role === "master_partner" ? "Master Partner" : "Partner"}</p>
            <h2 className="m-0 text-2xl font-semibold tracking-tight text-slate-900">{me ? `Welcome, ${me.fullName}` : "Your partner overview"}</h2>
          </div>
          <ReferralSection profile={me} loading={isLoading} onCopy={copyCode} />

          {me?.linkedUserId && (
            <Link to="/wallet" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#8B1447] p-5 font-semibold text-white sm:p-6">
              <span>Partner Wallet<span className="mt-1 block text-sm font-normal text-pink-100">View earnings, request a withdrawal or transfer to Sribees Wallet.</span></span>
              <span className="text-sm">Open wallet →</span>
            </Link>
          )}
          {me && <EarningsOverview totals={me.totals} />}

          <NetworkMetrics customers={customers} recruits={recruits} isMasterPartner={me?.role === "master_partner"} />

          {me && <CommissionBreakdown byLevel={me.byLevel} isMasterPartner={me.role === "master_partner"} />}
        </main>
      </div>

      <RecruitModal
        requiresApproval={me?.requiresUpgradeApproval}
        open={recruitOpen && me?.role === "master_partner" && me?.canRecruit === true}
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

export default Dashboard;
