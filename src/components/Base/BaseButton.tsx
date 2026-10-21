import type { BaseButtonProps } from "../../interface/common";

export type { BaseButtonProps };

const BaseButton = ({ children, loading = false, disabled, ...props }: BaseButtonProps) => (
    <button type="button" disabled={disabled || loading} {...props}>
        {loading ? 'Signing in...' : children}
    </button>
);

export default BaseButton;
