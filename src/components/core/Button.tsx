import { component$ } from '@builder.io/qwik';

type ButtonProps = {
    type?: 'button' | 'submit';
    label: string;
};

export const Button = component$<ButtonProps>((props) => {
    const { type, label } = props;

    return (
        <button type={type ?? 'button'} class="bg-green-700 py-2 px-4 rounded w-full mt-2">
            {label}
        </button>
    );
});
