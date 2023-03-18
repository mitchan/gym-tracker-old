import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { Exercise } from '@prisma/client';
import { Button } from '../../components/core/Button';
import { getUserFromCookie } from '../../lib/auth';
import { db } from '../../lib/db';

export const useGetExercices = routeLoader$(async (event): Promise<Exercise[]> => {
    const { cookie } = event;

    const user = await getUserFromCookie(cookie);
    if (!user) {
        return [];
    }

    return db.exercise.findMany({
        where: {
            user,
        },
    });
});

export default component$(() => {
    const exercices = useGetExercices();
    const nav = useNavigate();

    return (
        <>
            <h1 class="text-4xl">Esercizi</h1>

            <Button
                label="Crea nuova esercizio"
                onClick$={() => {
                    nav('/exercices/create');
                }}
            />

            {exercices.value.map((exercise) => (
                <div key={exercise.id}>{exercise.name}</div>
            ))}
        </>
    );
});

export const head: DocumentHead = {
    title: 'Esercizi',
    meta: [
        {
            name: 'description',
            content: 'Esercizi',
        },
    ],
};
