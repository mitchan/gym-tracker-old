import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Form } from '@builder.io/qwik-city';
import { z, zod$ } from '@builder.io/qwik-city';
import { globalAction$ } from '@builder.io/qwik-city';
import { Button } from '../../../components/core/Button';
import { InputText } from '../../../components/input/InputText';
import { getUserFromCookie } from '../../../lib/auth';
import { db } from '../../../lib/db';

export const useCreateExercise = globalAction$(
    async (formData, event) => {
        const { name } = formData;
        const { cookie, redirect } = event;

        // get user
        const user = await getUserFromCookie(cookie);
        if (!user) {
            // not authenticated
            throw redirect(301, '/login');
        }

        // check if an exercise with the same name already exists
        const exercise = await db.exercise.findFirst({
            where: {
                name,
                userId: user.id,
            },
        });
        if (exercise) {
            return {
                ...formData,
                errors: {
                    name: `Un esercizio con questo nome esiste gia'`,
                },
            };
        }

        // try to create the exercise
        await db.exercise.create({
            data: {
                name,
                recovery: formData.recovery,
                serie: formData.serie,
                weight: Number(formData.weight),
                userId: user.id,
            },
        });

        // redirect to exercise list
        throw redirect(301, `/exercices/`);
    },
    zod$({
        name: z.string().min(1),
        notes: z.string().optional(),
        serie: z.string().min(1),
        recovery: z.string().min(1),
        weight: z.string().min(1),
    }),
);

export default component$(function CreateExercise() {
    const action = useCreateExercise();

    return (
        <>
            <h1 class="text-4xl">Nuovo esercizio</h1>

            <Form action={action}>
                <InputText name="name" label="Nome" disabled={action.isRunning} value={action.value?.name} />
                <InputText name="serie" label="Serie" disabled={action.isRunning} value={action.value?.serie} />
                <InputText
                    name="recovery"
                    label="Recupero"
                    disabled={action.isRunning}
                    value={action.value?.recovery}
                />
                <InputText
                    name="weight"
                    type="number"
                    label="Peso"
                    disabled={action.isRunning}
                    value={action.value?.weight}
                />
                <InputText name="notes" label="Note" disabled={action.isRunning} value={action.value?.notes} />

                <Button label="Crea" type="submit" disabled={action.isRunning} />
            </Form>
        </>
    );
});

export const head: DocumentHead = {
    title: 'Crea nuovo esercizio',
    meta: [
        {
            name: 'description',
            content: 'Crea nuovo esercizio',
        },
    ],
};
