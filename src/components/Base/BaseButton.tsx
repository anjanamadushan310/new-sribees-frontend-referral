import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface BaseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    loading?: boolean;
}

const BaseButton = ({ children, loading = false, disabled, ...props }: BaseButtonProps) => (
    <button type="button" disabled={disabled || loading} {...props}>
        {loading ? 'Signing in...' : children}
    </button>
);

export default BaseButton;
