import { $, component$ } from '@builder.io/qwik';
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

    const handleCreate = $(() => {
        nav('/training/create/');
    });

    return (
        <>
            <h1 class="text-4xl">Trainings</h1>

            {trainingSignal.value.map((training) => (
                <div>{training.title}</div>
            ))}

            <Button label="Create new training" onClick={handleCreate} />
        </>
    );
});

export const head: DocumentHead = {
    title: 'Trainings',
    meta: [
        {
            name: 'description',
            content: 'Trainings',
        },
    ],
};
