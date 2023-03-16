import { component$, Slot } from '@builder.io/qwik';
import type { RequestHandler } from '@builder.io/qwik-city';
import { parse } from 'cookie';

export const onGet: RequestHandler = ({ request, redirect }) => {
    const cookies = request.headers.get('cookie');
    if (!cookies) {
        // not logged in
        throw redirect(301, '/login/');
    }
    const parsedCookies = parse(cookies);

    if (!parsedCookies['Authorization']) {
        // not logged in
        throw redirect(301, '/login/');
    }

    // TODO validate cookie
};

export default component$(() => {
    return (
        <>
            <Slot />
        </>
    );
});
