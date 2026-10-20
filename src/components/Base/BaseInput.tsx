import type { InputHTMLAttributes, ReactNode } from 'react';

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: ReactNode;
    trailing?: ReactNode;
    error?: string;
}

const BaseInput = ({ label, icon, trailing, error, id, ...props }: BaseInputProps) => {
    const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="mb-[18px]">
            <label className="sr-only" htmlFor={inputId}>{label}</label>
            <div className={`flex h-[52px] items-center rounded-[11px] border bg-[#f0f4f8] transition focus-within:border-[#D81B60] focus-within:ring-4 focus-within:ring-[#D81B60]/15 ${error ? 'border-[#e25d6d]' : 'border-transparent'}`}>
                <span className="ml-4 inline-flex text-[#aeb6c2]" aria-hidden="true">
                    {icon}
                </span>
                <input className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-[#3a404b] outline-0 placeholder:text-[#aeb6c2]" id={inputId} {...props} aria-invalid={Boolean(error)} />
                {trailing && <span className="mr-3.5 inline-flex">{trailing}</span>}
            </div>
            {error && <span className="mt-1 block text-xs text-[#d74e60]">{error}</span>}
        </div>
    );
};

export default BaseInput;
