import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
    return <div>Homepage works</div>;
});

export const head: DocumentHead = {
    title: 'Homepage',
    meta: [
        {
            name: 'description',
            content: 'Homepage',
        },
    ],
};
