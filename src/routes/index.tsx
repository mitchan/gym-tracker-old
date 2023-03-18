import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { useNavigate } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import type { Training } from '@prisma/client';
import { Button } from '../components/core/Button';
import { getUserFromCookie } from '../lib/auth';
import { db } from '../lib/db';

export const useGetTrainings = routeLoader$(async (event): Promise<Training[]> => {
    const { cookie } = event;

    const user = await getUserFromCookie(cookie);
    if (!user) {
        return [];
    }

    return db.training.findMany({
        where: {
            user,
        },
        orderBy: {
            lastOpenAt: 'desc',
        },
    });
});

export default component$(() => {
    const trainingSignal = useGetTrainings();
    const nav = useNavigate();

    return (
        <>
            <h1 class="text-4xl">Schede</h1>

            <div class="mb-2">
                <Button
                    label="Crea nuova scheda"
                    onClick$={() => {
                        nav('/training/create/');
                    }}
                />
                <Button
                    label="Esercizi"
                    onClick$={() => {
                        nav('/exercices/');
                    }}
                />
            </div>

            {trainingSignal.value.map((training) => (
                <div key={training.id}>{training.title}</div>
            ))}
        </>
    );
});

export const head: DocumentHead = {
    title: 'Schede',
    meta: [
        {
            name: 'description',
            content: 'Schede',
        },
    ],
};
