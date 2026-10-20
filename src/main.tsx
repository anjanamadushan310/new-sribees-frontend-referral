import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, App as AntApp } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router';
import 'antd/dist/reset.css';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ConfigProvider theme={{ token: { colorPrimary: '#0F766E' } }}>
            <AntApp>
                <QueryClientProvider client={queryClient}>
                    <AppRouter />
                </QueryClientProvider>
            </AntApp>
        </ConfigProvider>
    </React.StrictMode>
);
