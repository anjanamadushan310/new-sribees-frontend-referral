import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        include: ['src/**/*.test.{ts,tsx}'],
        setupFiles: ['./src/test-setup.ts'],
        // Page tests render real Ant Design screens in jsdom: seconds, not ms.
        testTimeout: 30000,
    },
});
