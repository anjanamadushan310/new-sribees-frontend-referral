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
  UserPlus,
  Send,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { partnerApi } from "../api/partner.api";
import type { PartnerCustomer, CustomerSortBy } from "../interface";
import { SideBar } from "../components/SideBar";
import { Header } from "../components/Header";
import { SectionCard, StatCard } from "../components/Base";
import { CustomerTable } from "../components/Table";
import { useToast } from "../components/Common/Toast";
import { useSidebarCollapse } from "../hooks/useSidebarCollapse";

const Customers: React.FC = () => {
  const navigate = useNavigate();
  const { message } = useToast();
  const queryClient = useQueryClient();
  const [selectedCustomer, setSelectedCustomer] = useState<PartnerCustomer | null>(null);
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useSidebarCollapse();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<CustomerSortBy>("earned");

  const { data: me } = useQuery({
    queryKey: ["partner-me"],
    queryFn: partnerApi.me,
  });

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["partner-customers"],
    queryFn: partnerApi.customers,
  });

  const partnerAction = useMutation({
    mutationFn: (customer: PartnerCustomer) => customer.partner_role
      ? partnerApi.resendCustomerInvitation(customer.user_id)
      : partnerApi.upgradeCustomer(customer.user_id),
    onSuccess: (result, customer) => {
      const accountStatus = customer.partner_role ? "Partner account ready" : "Partner account created";
      const delivery = result.invitation_delivery;
      if (!delivery) {
        message[result.invitation_sent ? "success" : "info"](
          result.invitation_sent
            ? `${accountStatus}. A password setup link was sent by SMS.`
            : `${accountStatus}, but the invitation could not be sent. Contact Sribees support for a new invitation.`,
          6000,
        );
      } else if (delivery.sms && delivery.email) {
        message.success(`${accountStatus}. Password setup links were sent by email and SMS.`, 6000);
      } else if (delivery.sms) {
        message.info(`${accountStatus}. SMS was sent, but the email could not be sent.`, 6000);
      } else if (delivery.email) {
        message.info(`${accountStatus}. Email was sent, but the SMS could not be sent.`, 6000);
      } else {
        message.info(`${accountStatus}, but email and SMS could not be sent. Contact Sribees support for a new invitation.`, 6000);
      }
      setSelectedCustomer(null);
      setConsentConfirmed(false);
      queryClient.invalidateQueries({ queryKey: ["partner-customers"] });
      queryClient.invalidateQueries({ queryKey: ["partner-recruits"] });
      queryClient.invalidateQueries({ queryKey: ["partner-me"] });
    },
    onError: (err: any, customer) =>
      message.error(
        err.response?.data?.detail?.error?.message ??
          err.response?.data?.detail ??
          (customer.partner_role ? "Could not resend the setup links." : "Could not make this customer a Partner."),
      ),
  });

  const signOut = () => {
    partnerApi.logout();
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  const isResending = Boolean(selectedCustomer?.partner_role);
  const pendingLabel = isResending ? "Sending…" : "Creating Partner…";
  const submitLabel = isResending ? "Resend Email & SMS" : "Make Partner & Send Links";

  const isMasterPartner = me?.role === "master_partner" && me?.canRecruit === true;

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
    <div className="relative h-dvh max-h-dvh overflow-hidden box-border bg-slate-50 sm:bg-[#8B1447] p-0 sm:p-3 flex">
      <SideBar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        activeTab="customers"
        onSelectTab={() => {}}
        isMasterPartner={me?.role === "master_partner" && me?.canRecruit === true}
        showWallet={Boolean(me?.linkedUserId)}
        onOpenRecruit={() => navigate("/customers")}
        onSignOut={signOut}
      />

      <div className="custom-scrollbar relative z-10 min-w-0 flex-1 h-dvh sm:h-[calc(100dvh-24px)] max-h-dvh sm:max-h-[calc(100vh-24px)] overflow-y-auto rounded-none sm:rounded-[17px] bg-slate-50 shadow-none sm:ring-1 sm:ring-black/5">
        <Header onSignOut={signOut} title="My Customers" />

        <main className="mx-auto w-full max-w-[1440px] bg-slate-50 px-4 sm:px-7 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:pb-8 pt-4">
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
                  precision={0}
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
                  precision={0}
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
                canPromote={isMasterPartner}
                promotingCustomerId={partnerAction.isPending ? selectedCustomer?.user_id : null}
                onResend={(customer) => setSelectedCustomer(customer)}
                onPromote={(customer) => {
                  setSelectedCustomer(customer);
                  setConsentConfirmed(false);
                }}
              />
            )}
          </SectionCard>

          <p className="mt-4 block text-xs text-slate-500 m-0">
            Customers who sign up using your referral code earn you direct
            commissions on their eligible purchases.
          </p>
        </main>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" role="presentation">
          <section className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="promote-customer-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="promote-customer-title" className="m-0 text-lg font-bold text-slate-900">{isResending ? "Resend password setup links" : "Make customer a Partner"}</h2>
                <p className="mt-2 text-sm text-slate-600">{isResending
                  ? `Send new password setup links to ${selectedCustomer.name}.`
                  : `${selectedCustomer.name} will join your Partner team. Their existing referral code and unpaid commissions will be carried over.`}</p>
              </div>
              <button type="button" aria-label="Close" onClick={() => setSelectedCustomer(null)} className="rounded-lg border-0 bg-transparent p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">Password setup links will be sent to the email address and verified phone number in their Sribees account. The customer can use either link to choose their password.{!isResending && " No Super Admin approval is required."}</p>
            {!isResending && <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-5 text-slate-700">
              <input type="checkbox" checked={consentConfirmed} onChange={(event) => setConsentConfirmed(event.target.checked)} className="mt-1 h-4 w-4 accent-pink-600" />
              <span>I confirm that this customer agreed to become a Partner.</span>
            </label>}
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setSelectedCustomer(null)} className="min-h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">Cancel</button>
              <button
                type="button"
                disabled={(!isResending && !consentConfirmed) || partnerAction.isPending}
                onClick={() => partnerAction.mutate(selectedCustomer)}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border-0 bg-pink-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isResending ? <Send className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {partnerAction.isPending ? pendingLabel : submitLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Customers;
