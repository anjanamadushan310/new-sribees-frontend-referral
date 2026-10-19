import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

// Ant Design screens in jsdom take seconds, not ms (see vitest.config.ts):
// a form's validation message can land after Testing Library's default 1 s
// wait for findBy*/waitFor, which failed the recruit test on a busy machine
// while the screen itself was right.
configure({ asyncUtilTimeout: 5000 });

// jsdom has neither; Ant Design's grid, tables, tabs and modals use both.
if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}
if (!('ResizeObserver' in window)) {
    class ResizeObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
    }
    Object.defineProperty(window, 'ResizeObserver', { writable: true, value: ResizeObserverStub });
    Object.defineProperty(globalThis, 'ResizeObserver', { writable: true, value: ResizeObserverStub });
}

afterEach(() => {
    cleanup();
    localStorage.clear();
});
