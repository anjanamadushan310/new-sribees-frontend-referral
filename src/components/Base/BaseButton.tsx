import type { BaseButtonProps } from "../../interface/common";

export type { BaseButtonProps };

const BaseButton = ({ children, loading = false, loadingText = 'Please wait...', disabled, ...props }: BaseButtonProps) => (
    <button type="button" disabled={disabled || loading} {...props}>
        {loading ? loadingText : children}
    </button>
);


export default BaseButton;
