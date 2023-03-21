import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import type { Exercise } from '@prisma/client';
import { Button } from '../../../components/core/Button';
import { InputText } from '../../../components/input/InputText';
import { getUserFromCookie } from '../../../lib/auth';
import { db } from '../../../lib/db';

export const useEditExercise = globalAction$(
    async (formData, event) => {
        const { cookie, redirect } = event;

        // get user
        const user = await getUserFromCookie(cookie);
        if (!user) {
            // not authenticated
            throw redirect(301, '/login');
        }

        try {
            await db.exercise.update({
                where: {
                    id: formData.id,
                },
                data: {
                    name: formData.name,
                    notes: formData.notes ?? '',
                    serie: formData.serie,
                    recovery: formData.recovery,
                    weight: Number(formData.weight),
                },
            });
        } catch (e) {
            return {
                name: formData.name,
                notes: formData.notes,
                serie: formData.serie,
                recovery: formData.recovery,
                weight: formData.weight,
            };
        }

        throw redirect(301, '/exercices/');
    },
    zod$({
        id: z.string().uuid(),
        name: z.string().min(1),
        notes: z.string().optional(),
        serie: z.string().min(1),
        recovery: z.string().min(1),
        weight: z.string().min(1),
    }),
);

export const useGetExercise = routeLoader$<Exercise>(async (event) => {
    const { params, redirect } = event;

    // check if exercise exists
    if (!params.id) {
        throw redirect(301, '/');
    }

    const exercise = await db.exercise.findUnique({
        where: {
            id: params.id,
        },
    });

    if (!exercise) {
        throw redirect(301, '/');
    }

    return exercise;
});

export default component$(function EditExercise() {
    const { value: exercise } = useGetExercise();
    const action = useEditExercise();

    return (
        <div>
            <Form action={action}>
                <InputText type="hidden" name="id" label="ID" disabled={action.isRunning} value={exercise.id} />

                <InputText name="name" label="Nome" disabled={action.isRunning} value={exercise.name} />

                <InputText
                    name="serie"
                    label="Serie"
                    disabled={action.isRunning}
                    value={action.value?.serie ?? exercise.serie}
                />

                <InputText
                    name="recovery"
                    label="Recupero"
                    disabled={action.isRunning}
                    value={action.value?.recovery ?? exercise.recovery}
                />

                <InputText
                    name="weight"
                    type="number"
                    label="Peso"
                    disabled={action.isRunning}
                    value={action.value?.weight ?? exercise.weight}
                />

                <InputText
                    name="notes"
                    label="Note"
                    disabled={action.isRunning}
                    value={action.value?.notes ?? exercise.notes ?? ''}
                />

                <Button label="Modifica" type="submit" disabled={action.isRunning} />
            </Form>
        </div>
    );
});

export const head: DocumentHead = {
    title: 'Modifica esercizio',
    meta: [
        {
            name: 'description',
            content: 'Modifica esercizio',
        },
    ],
};
