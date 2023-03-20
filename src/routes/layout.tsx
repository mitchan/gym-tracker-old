import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { getAuthCookie, getUserFromCookie } from '../lib/auth';

export const onGet: RequestHandler = async ({ redirect, cookie }) => {
    const user = await getUserFromCookie(cookie);
    if (!user) {
        // for precaution, remove cookie
        cookie.delete(getAuthCookie());

        // not logged in
        throw redirect(301, '/login/');
    }
};

export default component$(() => {
    return (
        <div class="min-h-full w-full bg-purple-900 text-white p-5">
            <Slot />
        </div>
    );
});
