import { component$ } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { z, zod$ } from '@builder.io/qwik-city';
import { globalAction$, Form } from '@builder.io/qwik-city';
import { Button } from '../../components/core/Button';
import { InputText } from '../../components/input/InputText';
import { comparePasswords, createJWT, getAuthCookie } from '../../lib/auth';
import { db } from '../../lib/db';

export const useLogin = globalAction$(
    async (formData, { redirect, cookie }) => {
        // check if user exists
        const user = await db.user.findUnique({
            where: {
                email: formData.email,
            },
        });
        if (user) {
            // validate password
            const isCorrectPassword = await comparePasswords(formData.password, user.password);
            if (isCorrectPassword) {
                const jwt = await createJWT(user);

                // go to home
                cookie.set(getAuthCookie(), jwt, { path: '/', maxAge: [7, 'days'] });
                throw redirect(301, '/');
            }
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

export const onGet: RequestHandler = ({ redirect, cookie }) => {
    if (cookie.get(getAuthCookie())) {
        // already logged in, redirect to home
        throw redirect(301, '/');
    }
};

export default component$(() => {
    const loginAction = useLogin();

    return (
        <div class="h-full w-full flex items-center justify-center bg-purple-900 text-white">
            <Form action={loginAction} class="w-9/12">
                <InputText name="email" label="Email" />
                <InputText type="password" name="password" label="Password" />

                <Button label="Login" type="submit" />
            </Form>
        </div>
    );
});
