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
    <div className="h-screen max-h-screen overflow-hidden box-border bg-gradient-to-br from-[#A51F60] to-[#880E4F] p-3 flex">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        activeTab="dashboard"
        onSelectTab={() => {}}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />
      <div className="custom-scrollbar min-w-0 flex-1 h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[17px] bg-slate-50 shadow-[0_20px_40px_rgba(15,23,42,.25)]">
        <Header onSignOut={signOut} />

        <main className="m-0 w-auto max-w-none bg-slate-50 px-7 pb-[30px] pt-1">
          <ReferralSection profile={me} loading={isLoading} onCopy={copyCode} />

          <EarningsOverview totals={me?.totals} />
 
          <NetworkMetrics customers={customers} recruits={recruits} />

          <CommissionBreakdown byLevel={me?.byLevel} />
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

export default Dashboard;
