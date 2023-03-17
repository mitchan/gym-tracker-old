import { component$ } from '@builder.io/qwik';
import { Form, globalAction$, z, zod$ } from '@builder.io/qwik-city';
import { Button } from '../../../components/core/Button';
import { InputText } from '../../../components/input/InputText';
import { getUserFromCookie } from '../../../lib/auth';
import { db } from '../../../lib/db';

export const useCreateTraining = globalAction$(
    async ({ title }, { redirect, cookie }) => {
        // get user
        const user = await getUserFromCookie(cookie);
        if (!user) {
            // not authenticated
            throw redirect(301, '/login');
        }

        // check if a trainging with the same title already exists
        const training = await db.training.findFirst({
            where: {
                title,
                userId: user.id,
            },
        });
        if (training) {
            return {
                error: `A training with the title '${title} already exists'`,
            };
        }

        // try to create the training
        const created = await db.training.create({
            data: {
                title,
                userId: user.id,
            },
        });

        // redirect to created training
        throw redirect(301, `/training/${created.id}/`);
    },
    zod$({
        title: z.string(),
    }),
);

export default component$(() => {
    const action = useCreateTraining();

    return (
        <>
            <h1 class="text-4xl">Create new training</h1>
            <Form action={action}>
                <InputText name="title" label="Title" disabled={action.isRunning} />

                <Button label="Save" type="submit" disabled={action.isRunning} />
            </Form>
        </>
    );
});
