import { component$ } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { globalAction$, Form, zod$, z } from '@builder.io/qwik-city';
import { parse } from 'cookie';
import { register } from '../../lib/auth/firebase';

export const useRegister = globalAction$(
    async (formData, { redirect }) => {
        const resp = await register(formData['email'] as string, formData.password as string);
        if (resp) {
            // Go to login
            throw redirect(301, '/login');
        }

        return {
            success: false,
            email: formData.email as string,
        };
    },
    zod$({
        email: z.string().email(),
        password: z.string().min(8),
    }),
);

export const onGet: RequestHandler = ({ request, redirect }) => {
    const cookies = request.headers.get('cookie');
    if (!cookies) {
        // do nothing
        return;
    }
    const parsedCookies = parse(cookies);

    if (parsedCookies['Authorization']) {
        // already logged in, redirect to home
        throw redirect(301, '/');
    }
};

export default component$(() => {
    const loginAction = useRegister();

    return (
        <Form action={loginAction}>
            <div>
                <label>Email</label>
                <input type="text" name="email" />
            </div>

            <div>
                <label>Password</label>
                <input type="password" name="password" required />
            </div>

            <button type="submit">Submit</button>
        </Form>
    );
});
