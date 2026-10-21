import React, { useState, useMemo } from "react";
import {
  Layout,
  Typography,
  App,
  Form,
  Row,
  Col,
  Input,
  Select,
  Segmented,
  Empty,
} from "antd";
import {
  SearchOutlined,
  AppstoreOutlined,
  TableOutlined,
  DollarOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type { RecruitPartnerPayload } from "../api/partner.api";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { SectionCard, StatCard } from "../components/Base";
import { TopProductsTable } from "../components/Table";
import { RecruitModal } from "../components/Page/Dashboard";

const { Content } = Layout;
const { Text } = Typography;

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [recruitOpen, setRecruitOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"earned" | "units" | "orders" | "name">(
    "earned"
  );
  const [viewMode, setViewMode] = useState<"auto" | "table" | "grid">("auto");
  const [recruitForm] = Form.useForm<RecruitPartnerPayload>();

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
      message.success("Partner recruited. Share their login details with them.");
      setRecruitOpen(false);
      recruitForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["partner-recruits"] });
    },
    onError: (err: any) =>
      message.error(
        err.response?.data?.detail?.error?.message ??
          "Could not recruit this partner."
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
    [topProducts]
  );
  const totalUnits = useMemo(
    () => topProducts.reduce((sum, p) => sum + (p.units || 0), 0),
    [topProducts]
  );
  const totalOrders = useMemo(
    () => topProducts.reduce((sum, p) => sum + (p.orders || 0), 0),
    [topProducts]
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = [...topProducts];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          p.product_id.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === "earned") return b.total_earned - a.total_earned;
      if (sortBy === "units") return b.units - a.units;
      if (sortBy === "orders") return b.orders - a.orders;
      if (sortBy === "name") return a.product_name.localeCompare(b.product_name);
      return 0;
    });

    return list;
  }, [topProducts, searchQuery, sortBy]);

  return (
    <Layout className="!h-screen !max-h-screen !overflow-hidden !box-border !bg-gradient-to-br !from-[#D81B60] !via-[#C2185B] !to-[#880E4F] !p-3">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
        activeTab="products"
        onSelectTab={(tab) => {
          if (tab !== "products") {
            navigate(`/?tab=${tab}`);
          }
        }}
        hasUpline={me?.hasUpline}
        onOpenRecruit={() => {
          recruitForm.resetFields();
          setRecruitOpen(true);
        }}
        onSignOut={signOut}
      />

      <div className="custom-scrollbar min-w-0 flex-1 h-[calc(100vh-24px)] max-h-[calc(100vh-24px)] overflow-y-auto rounded-[17px] bg-slate-50 shadow-[0_20px_40px_rgba(15,23,42,.25)]">
        <Header onSignOut={signOut} title="Products" />

        <Content className="!m-0 !w-auto !max-w-none !bg-slate-50 !px-4 sm:!px-7 !pb-[30px] !pt-1">
          {/* Overview Stat Cards */}
          <SectionCard
            title="Products Performance Overview"
            icon={<ShoppingOutlined />}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <StatCard
                  title="TOTAL PRODUCT EARNINGS"
                  value={totalCommission}
                  tagText="Commission Earned"
                  icon={<DollarOutlined />}
                  gradientClass="!bg-gradient-to-br !from-pink-500 !to-rose-600"
                />
              </Col>
              <Col xs={24} md={8}>
                <StatCard
                  title="TOTAL UNITS SOLD"
                  value={totalUnits}
                  prefix=""
                  tagText="Net Units"
                  icon={<InboxOutlined />}
                  gradientClass="!bg-gradient-to-br !from-blue-500 !to-indigo-600"
                />
              </Col>
              <Col xs={24} md={8}>
                <StatCard
                  title="TOTAL ORDERS GENERATED"
                  value={totalOrders}
                  prefix=""
                  tagText="Unique Orders"
                  icon={<ShoppingCartOutlined />}
                  gradientClass="!bg-gradient-to-br !from-emerald-600 !to-teal-500"
                />
              </Col>
            </Row>
          </SectionCard>

          {/* Top Products Table & Grid Card */}
          <SectionCard
            title="Top Products"
            icon={<ShoppingOutlined />}
            extraHeader={
              <div className="flex flex-wrap items-center gap-2.5">
                <Segmented
                  value={viewMode}
                  onChange={(val) => setViewMode(val as "auto" | "table" | "grid")}
                  options={[
                    {
                      label: "Auto",
                      value: "auto",
                    },
                    {
                      label: (
                        <span className="flex items-center gap-1">
                          <TableOutlined />
                          <span className="hidden sm:inline">Table</span>
                        </span>
                      ),
                      value: "table",
                    },
                    {
                      label: (
                        <span className="flex items-center gap-1">
                          <AppstoreOutlined />
                          <span className="hidden sm:inline">Grid</span>
                        </span>
                      ),
                      value: "grid",
                    },
                  ]}
                />
              </div>
            }
          >
            {/* Filter and Search Bar */}
            <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <Input
                placeholder="Search products by name or ID..."
                prefix={<SearchOutlined className="text-slate-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                className="max-w-md !rounded-xl"
              />

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  Sort by:
                </span>
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-44"
                  options={[
                    { value: "earned", label: "Highest Earned" },
                    { value: "units", label: "Most Units Sold" },
                    { value: "orders", label: "Most Orders" },
                    { value: "name", label: "Product Name (A-Z)" },
                  ]}
                />
              </div>
            </div>

            {/* Top Products Table (Desktop) / Grid (Mobile) */}
            {filteredProducts.length === 0 && !isLoading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    searchQuery
                      ? "No products matching your search."
                      : "No product has earned you commission yet."
                  }
                />
              </div>
            ) : (
              <TopProductsTable
                products={filteredProducts}
                loading={isLoading}
                viewMode={viewMode}
              />
            )}
          </SectionCard>

          <Text type="secondary" className="!mt-4 !block !text-xs">
            Product commissions are earned based on selected items purchased by
            referred customers.
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

export default Products;
