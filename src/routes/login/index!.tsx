import { component$ } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { z, zod$ } from '@builder.io/qwik-city';
import { globalAction$, Form } from '@builder.io/qwik-city';
import { comparePasswords, createJWT } from '../../lib/auth';
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
                cookie.set('Authorization', jwt, { path: '/', maxAge: [7, 'days'] });
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
    if (cookie.get(process.env.AUTH_COOKIE ?? '')) {
        // already logged in, redirect to home
        throw redirect(301, '/');
    }
};

export default component$(() => {
    const loginAction = useLogin();

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
