/**
 * Partner login — a separate realm from the admin dashboard.
 *
 * The server returns one message for every failure (unknown email, wrong
 * password, deactivated account) and this screen shows it verbatim, so the
 * page cannot be used to discover which agents exist.
 */
import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { partnerApi } from '../api/partner.api';

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: { email: string; password: string }) => {
        setLoading(true);
        setError(null);
        try {
            await partnerApi.login(values.email, values.password);
            navigate('/', { replace: true });
        } catch (err: any) {
            setError(
                err.response?.data?.detail?.error?.message ??
                    'Could not sign in. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#F1F5F4',
                padding: 16,
            }}
        >
            <Card style={{ width: 400, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Title level={3} style={{ marginBottom: 4 }}>
                        SRIBEES Partners
                    </Title>
                    <Text type="secondary">Referral team portal</Text>
                </div>

                {error && (
                    <Alert
                        type="error"
                        message={error}
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Enter your email' }]}
                    >
                        <Input size="large" autoComplete="username" />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Enter your password' }]}
                    >
                        <Input.Password size="large" autoComplete="current-password" />
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                    >
                        Sign in
                    </Button>
                </Form>

                <Text
                    type="secondary"
                    style={{ display: 'block', marginTop: 16, fontSize: 12, textAlign: 'center' }}
                >
                    Partner accounts are separate from staff accounts.
                </Text>
            </Card>
        </div>
    );
};

export default Login;
