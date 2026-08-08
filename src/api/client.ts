/**
 * Partner Portal API client.
 *
 * Talks only to /api/v1/partner/*. The token it stores carries the
 * `is_partner` claim, which the admin surface refuses — so even if this token
 * leaked into an admin request it would be rejected server-side.
 *
 * The key is namespaced separately from the admin dashboard's, and the portal
 * is served from its own origin, so the two never see each other's session
 * even during local development.
 */
import axios from 'axios';

export const TOKEN_KEY = 'sribees_partner_token';

const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // A dead or wrong-realm token is unrecoverable here — there is no
        // refresh flow for partners — so clear it and let the router send
        // them back to login rather than looping on 401s.
        if (error.response?.status === 401) {
            localStorage.removeItem(TOKEN_KEY);
            if (!window.location.pathname.startsWith('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
