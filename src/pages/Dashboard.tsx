/**
 * Partner dashboard — invite code, earnings, customers and recruits.
 *
 * A partner sees their customers' names and member ids, the commission earned
 * from each, and which products it came from (name, units, rate, earned).
 * Never what a customer paid: the API does not return the order or line value,
 * so this screen could not show it even by mistake.
 */
import React, { useState } from "react";
import { Layout, Typography, App, Form } from "antd";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type { RecruitPartnerPayload } from "../api/partner.api";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import {
  ReferralSection,
  EarningsOverview,
  CommissionBreakdown,
  DashboardTabs,
  RecruitModal,
} from "../components/Page/Dashboard";

const { Content } = Layout;
const { Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlTab = searchParams.get("tab");
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(urlTab || "customers");
  const [recruitForm] = Form.useForm<RecruitPartnerPayload>();

  React.useEffect(() => {
    if (urlTab) {
      setActiveTab(urlTab);
    }
  }, [urlTab]);

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
  const { data: commissions = [] } = useQuery({
    queryKey: ["partner-commissions"],
    queryFn: partnerApi.commissions,
  });
  const { data: topProducts = [] } = useQuery({
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
    <Layout className="!h-screen !max-h-screen !overflow-hidden !box-border !bg-gradient-to-br !from-[#D81B60] !via-[#C2185B] !to-[#880E4F] !p-3">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />
      <div className="custom-scrollbar min-w-0 flex-1 h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[17px] bg-slate-50 shadow-[0_20px_40px_rgba(15,23,42,.25)]">
        <Header onSignOut={signOut} />

        <Content className="!m-0 !w-auto !max-w-none !bg-slate-50 !px-7 !pb-[30px] !pt-1">
          <ReferralSection
            profile={me}
            loading={isLoading}
            onCopy={copyCode}
          />

          <EarningsOverview totals={me?.totals} />

          <CommissionBreakdown byLevel={me?.byLevel} />

          <DashboardTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            customers={customers}
            recruits={recruits}
            commissions={commissions}
            topProducts={topProducts}
            hasUpline={me?.hasUpline}
          />

          <Text type="secondary" className="!mt-4 !block !text-xs">
            Commission is settled by the finance team; this ledger is the
            statement it is reconciled against.
          </Text>
        </Content>
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
    </Layout>
  );
};

export default Dashboard;
