/**
 * The partner token: sent on every request, and thrown away the moment the
 * API refuses it. Partners have no refresh flow, so a 401 that did not clear
 * the token would loop the dashboard on the same dead credential.
 */
import { AxiosError, AxiosHeaders, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it } from 'vitest';
import apiClient, { TOKEN_KEY } from './client';

let seen: InternalAxiosRequestConfig[] = [];

function serve(status: number) {
    const adapter: AxiosAdapter = async (config) => {
        seen.push(config);
        const response = { data: {}, status, statusText: '', headers: new AxiosHeaders(), config };
        if (status >= 400) throw new AxiosError('x', String(status), config, null, response);
        return response;
    };
    apiClient.defaults.adapter = adapter;
}

beforeEach(() => {
    seen = [];
    Object.defineProperty(window, 'location', {
        value: { pathname: '/', href: '' },
        writable: true,
        configurable: true,
    });
});

describe('partner API client', () => {
    it('attaches the stored partner token', async () => {
        localStorage.setItem(TOKEN_KEY, 'partner-token');
        serve(200);
        await apiClient.get('/partner/me');
        expect(seen[0].headers.Authorization).toBe('Bearer partner-token');
    });

    it('drops a refused token and sends the partner to login', async () => {
        localStorage.setItem(TOKEN_KEY, 'dead');
        serve(401);
        await expect(apiClient.get('/partner/me')).rejects.toBeTruthy();
        expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
        expect(window.location.href).toBe('/login');
    });

    it('keeps the token on other errors', async () => {
        localStorage.setItem(TOKEN_KEY, 'ok');
        serve(500);
        await expect(apiClient.get('/partner/me')).rejects.toBeTruthy();
        expect(localStorage.getItem(TOKEN_KEY)).toBe('ok');
    });

    it('uses its own storage key, never the admin one', () => {
        expect(TOKEN_KEY).not.toBe('admin_token');
    });
});
