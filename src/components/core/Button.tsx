import type { QRL } from '@builder.io/qwik';
import { component$ } from '@builder.io/qwik';

type ButtonProps = {
    type?: 'button' | 'submit';
    label: string;
    disabled?: boolean;
    onClick$?: QRL<() => void>;
};

export const Button = component$<ButtonProps>((props) => {
    const { type = 'button', label, disabled, onClick$ } = props;

    return (
        <button
            disabled={disabled}
            type={type}
            class={`bg-green-700 py-2 px-4 rounded w-full mt-2 ${disabled ? `opacity-50` : ``}`}
            onClick$={() => onClick$?.()}
        >
            {label}
        </button>
    );
});
