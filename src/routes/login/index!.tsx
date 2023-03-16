import { component$ } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { globalAction$, Form } from '@builder.io/qwik-city';
import { parse } from 'cookie';

export const useLogin = globalAction$((formData, { redirect, cookie }) => {
    if (formData.email === 'admin') {
        // TODO set the correct cookie
        cookie.set('Authorization', 'asdada', { path: '/', maxAge: [7, 'days'] });
        throw redirect(301, '/');
    }

    return {
        success: true,
        email: formData.email as string,
    };
});

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
