import { component$ } from '@builder.io/qwik';

type InputTextProps = {
    type?: 'text' | 'password';
    label: string;
    name: string;
    disabled?: boolean;
};

export const InputText = component$<InputTextProps>((props) => {
    const { type = 'text', name, label } = props;

    return (
        <div class="flex flex-col mb-1">
            <label>{label}</label>
            <input
                type={type}
                name={name}
                disabled={props.disabled}
                class="border border-solid border-gray-400 rounded p-2 text-black"
            />
        </div>
    );
});
