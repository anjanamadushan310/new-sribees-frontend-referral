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
import { useNavigate } from "react-router-dom";
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

  const { data: me, isLoading } = useQuery({
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

  const copyCode = async () => {
    if (!me?.referralCode) return;
    await navigator.clipboard.writeText(me.referralCode);
    message.success("Referral code copied");
  };

  const submitRecruit = async () => {
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
        activeTab="dashboard"
        onSelectTab={() => {}}
        hasUpline={me?.role ? me.role !== "master_partner" : me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />
      <div className="custom-scrollbar relative z-10 min-w-0 flex-1 h-screen sm:h-[calc(100vh-24px)] max-h-screen sm:max-h-[calc(100vh-24px)] overflow-y-auto rounded-none sm:rounded-[17px] bg-slate-50 shadow-none sm:shadow-[0_20px_40px_rgba(15,23,42,.25)] sm:ring-1 sm:ring-white/20">
        <Header onSignOut={signOut} />

        <main className="m-0 w-auto max-w-none bg-slate-50 px-3 sm:px-7 pb-24 sm:pb-[30px] pt-1">
          {me?.linkedUserId && <button type="button" className="mb-4 rounded-xl bg-white border border-pink-200 px-5 py-3 font-semibold text-[#D81B60]" onClick={() => navigate('/wallet')}>Partner Wallet · Withdraw or transfer</button>}
          <ReferralSection profile={me} loading={isLoading} onCopy={copyCode} />

          <EarningsOverview totals={me?.totals} walletMode={!!me?.linkedUserId} />

          <NetworkMetrics customers={customers} recruits={recruits} />

          <CommissionBreakdown byLevel={me?.byLevel} />
        </main>
      </div>

      <RecruitModal
        requiresApproval={me?.requiresUpgradeApproval}
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

export default Dashboard;
