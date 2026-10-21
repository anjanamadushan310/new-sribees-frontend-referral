/**
 * Partner login — a separate realm from the admin dashboard.
 *
 * The server returns one message for every failure (unknown email, wrong
 * password, deactivated account) and this screen shows it verbatim, so the
 * page cannot be used to discover which agents exist.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { partnerApi } from '../api/partner.api';
import LoginComponent from '../components/Page/Login/Login';
import type { LoginFormValues } from '../interface/auth';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onFinish = async (values: LoginFormValues) => {
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

    return <LoginComponent loading={loading} error={error} onSubmit={onFinish} />;
};

export default Login;
