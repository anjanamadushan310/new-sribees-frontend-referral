/**
 * Partner dashboard — invite code, earnings, customers and recruits.
 *
 * A partner sees their customers' names and member ids and the commission
 * earned from each. Not what those customers actually bought: the API does not
 * return the order value, so this screen could not show it even by mistake.
 */
import React, { useState } from 'react';
import {
    Layout,
    Card,
    Row,
    Col,
    Statistic,
    Table,
    Tag,
    Typography,
    Button,
    Tabs,
    Space,
    App,
    Modal,
    Form,
    Input,
} from 'antd';
import { LogoutOutlined, CopyOutlined, TeamOutlined, UserAddOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { partnerApi } from '../api/partner.api';
import type {
    PartnerCustomer,
    PartnerRecruit,
    PartnerCommission,
    RecruitPartnerPayload,
} from '../api/partner.api';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const money = (v: number) =>
    `Rs ${v.toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const shortDate = (v: string | null) =>
    v ? new Date(v).toLocaleDateString('en-LK') : '—';

const statusTag = (s: PartnerCommission['status']) => {
    const map: Record<string, { colour: string; label: string }> = {
        pending: { colour: 'gold', label: 'Pending' },
        claimable: { colour: 'green', label: 'Ready' },
        paid: { colour: 'default', label: 'Paid' },
        reversed: { colour: 'red', label: 'Cancelled' },
    };
    const m = map[s] ?? map.pending;
    return <Tag color={m.colour}>{m.label}</Tag>;
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const queryClient = useQueryClient();
    const [recruitOpen, setRecruitOpen] = useState(false);
    const [recruitForm] = Form.useForm<RecruitPartnerPayload>();

    const { data: me, isLoading } = useQuery({
        queryKey: ['partner-me'],
        queryFn: partnerApi.me,
    });
    const { data: customers = [] } = useQuery({
        queryKey: ['partner-customers'],
        queryFn: partnerApi.customers,
    });
    const { data: recruits = [] } = useQuery({
        queryKey: ['partner-recruits'],
        queryFn: partnerApi.recruits,
    });
    const { data: commissions = [] } = useQuery({
        queryKey: ['partner-commissions'],
        queryFn: partnerApi.commissions,
    });

    const recruitMutation = useMutation({
        mutationFn: (payload: RecruitPartnerPayload) => partnerApi.recruit(payload),
        onSuccess: () => {
            message.success('Partner recruited. Share their login details with them.');
            setRecruitOpen(false);
            recruitForm.resetFields();
            queryClient.invalidateQueries({ queryKey: ['partner-recruits'] });
        },
        onError: (err: any) =>
            message.error(
                err.response?.data?.detail?.error?.message ?? 'Could not recruit this partner.'
            ),
    });

    const signOut = () => {
        partnerApi.logout();
        navigate('/login', { replace: true });
    };

    const copyCode = async () => {
        if (!me?.referralCode) return;
        await navigator.clipboard.writeText(me.referralCode);
        message.success('Referral code copied');
    };

    const submitRecruit = async () => {
        const values = await recruitForm.validateFields();
        recruitMutation.mutate({
            full_name: values.full_name.trim(),
            email: values.email.trim(),
            phone: values.phone?.trim() || undefined,
            password: values.password,
        });
    };

    const customerColumns = [
        { title: 'Customer', dataIndex: 'name', key: 'name' },
        { title: 'ID', dataIndex: 'member_id', key: 'member_id' },
        {
            title: 'Joined',
            dataIndex: 'joined_at',
            key: 'joined_at',
            render: (v: string | null) => shortDate(v),
        },
        {
            title: 'Orders',
            dataIndex: 'orders',
            key: 'orders',
            align: 'right' as const,
        },
        {
            title: 'You earned',
            dataIndex: 'total_earned',
            key: 'total_earned',
            align: 'right' as const,
            render: (v: number) => <Text strong>{money(v)}</Text>,
        },
    ];

    const recruitColumns = [
        { title: 'Partner', dataIndex: 'name', key: 'name' },
        {
            title: 'Joined',
            dataIndex: 'joined_at',
            key: 'joined_at',
            render: (v: string | null) => shortDate(v),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (v: boolean) =>
                v ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag>,
        },
        {
            title: 'Level 2 earned',
            dataIndex: 'total_earned',
            key: 'total_earned',
            align: 'right' as const,
            render: (v: number) => <Text strong>{money(v)}</Text>,
        },
    ];

    const commissionColumns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (v: string | null) => shortDate(v),
        },
        {
            title: 'Order',
            dataIndex: 'order_number',
            key: 'order_number',
            render: (v: string | null) => v ?? '—',
        },
        {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            render: (v: number) => (
                <Tag color={v === 1 ? 'blue' : 'purple'}>L{v}</Tag>
            ),
        },
        {
            title: 'Rate',
            dataIndex: 'rate_percentage',
            key: 'rate_percentage',
            render: (v: number) => `${v}%`,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'right' as const,
            render: (v: number, row: PartnerCommission) => (
                <Text strong delete={row.status === 'reversed'}>
                    {money(v)}
                </Text>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (v: PartnerCommission['status']) => statusTag(v),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh', background: '#F1F5F4' }}>
            <Header
                style={{
                    background: '#0F766E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Space>
                    <TeamOutlined style={{ color: '#fff', fontSize: 18 }} />
                    <Text style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>
                        SRIBEES Partners
                    </Text>
                </Space>
                <Space>
                    <Text style={{ color: '#D5E8E5' }}>{me?.fullName}</Text>
                    <Button
                        type="text"
                        icon={<LogoutOutlined />}
                        onClick={signOut}
                        style={{ color: '#fff' }}
                    >
                        Sign out
                    </Button>
                </Space>
            </Header>

            <Content
                style={{
                    padding: 24,
                    maxWidth: 1100,
                    margin: '0 auto',
                    width: '100%',
                }}
            >
                <Card loading={isLoading} style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col xs={24} md={10}>
                            <Text type="secondary">Your referral code</Text>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginTop: 6,
                                }}
                            >
                                <Title level={2} style={{ margin: 0, letterSpacing: 4 }}>
                                    {me?.referralCode ?? '—'}
                                </Title>
                                <Button icon={<CopyOutlined />} onClick={copyCode}>
                                    Copy
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                    onClick={() => setRecruitOpen(true)}
                                >
                                    Recruit a partner
                                </Button>
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {me
                                    ? `${me.commissionPercent}% of every order your customers place`
                                    : ''}
                            </Text>
                        </Col>
                        <Col xs={12} md={4}>
                            <Statistic
                                title="Level 1"
                                value={me?.byLevel.level1 ?? 0}
                                prefix="Rs"
                                precision={2}
                            />
                        </Col>
                        <Col xs={12} md={4}>
                            <Statistic
                                title="Level 2"
                                value={me?.byLevel.level2 ?? 0}
                                prefix="Rs"
                                precision={2}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Statistic
                                title="Pending"
                                value={me?.totals.pending ?? 0}
                                prefix="Rs"
                                precision={2}
                            />
                        </Col>
                        <Col xs={12} md={3}>
                            <Statistic
                                title="Ready"
                                value={me?.totals.claimable ?? 0}
                                prefix="Rs"
                                precision={2}
                                valueStyle={{ color: '#0F766E' }}
                            />
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Tabs
                        items={[
                            {
                                key: 'customers',
                                label: `My Customers (${customers.length})`,
                                children: (
                                    <Table<PartnerCustomer>
                                        rowKey="user_id"
                                        size="small"
                                        pagination={false}
                                        columns={customerColumns}
                                        dataSource={customers}
                                        locale={{
                                            emptyText:
                                                'No one has signed up with your code yet.',
                                        }}
                                    />
                                ),
                            },
                            {
                                key: 'recruits',
                                label: `My Team (${recruits.length})`,
                                children: (
                                    <Table<PartnerRecruit>
                                        rowKey="partner_id"
                                        size="small"
                                        pagination={false}
                                        columns={recruitColumns}
                                        dataSource={recruits}
                                        locale={{
                                            emptyText:
                                                'You have not recruited any partners yet.',
                                        }}
                                    />
                                ),
                            },
                            {
                                key: 'commissions',
                                label: 'Commission Ledger',
                                children: (
                                    <Table<PartnerCommission>
                                        rowKey="commission_id"
                                        size="small"
                                        columns={commissionColumns}
                                        dataSource={commissions}
                                        locale={{
                                            emptyText: 'No commission recorded yet.',
                                        }}
                                    />
                                ),
                            },
                        ]}
                    />
                </Card>

                <Text
                    type="secondary"
                    style={{ display: 'block', marginTop: 16, fontSize: 12 }}
                >
                    Commission is settled by the finance team; this ledger is the
                    statement it is reconciled against.
                </Text>
            </Content>

            <Modal
                title="Recruit a partner"
                open={recruitOpen}
                onOk={submitRecruit}
                onCancel={() => {
                    setRecruitOpen(false);
                    recruitForm.resetFields();
                }}
                okText="Recruit"
                confirmLoading={recruitMutation.isPending}
                destroyOnHidden
            >
                <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                    They join your team and you earn level-2 commission on their
                    customers. Set their password here and share it with them
                    yourself — there is no automatic invite email.
                </Text>
                <Form form={recruitForm} layout="vertical" requiredMark={false}>
                    <Form.Item
                        label="Full Name"
                        name="full_name"
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input size="large" placeholder="e.g. Nadeesha Fernando" />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Email is required' },
                            { type: 'email', message: 'Enter a valid email' },
                        ]}
                    >
                        <Input size="large" placeholder="partner@example.com" />
                    </Form.Item>
                    <Form.Item label="Phone" name="phone">
                        <Input size="large" placeholder="+94 7XX XXX XXX" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Set a password for them' },
                            { min: 8, message: 'At least 8 characters' },
                        ]}
                    >
                        <Input.Password size="large" placeholder="Min 8 characters" />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default Dashboard;
