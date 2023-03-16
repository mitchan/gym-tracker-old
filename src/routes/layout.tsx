import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { getUserFromCookie } from '../lib/auth';

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
    const user = await getUserFromCookie(cookie);
    if (!user) {
        // for precaution, remove cookie
        cookie.delete(process.env.AUTH_COOKIE ?? '');

        // not logged in
        throw redirect(301, '/login/');
    }
};

export default component$(() => {
    return (
        <>
            <Slot />
        </>
    );
});
