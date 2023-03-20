import { component$ } from '@builder.io/qwik';
import type { Exercise } from '@prisma/client';

type ExerciseCardProps = {
    exercise: Exercise;
};

export default component$<ExerciseCardProps>(function ExerciseCard(props) {
    const { exercise } = props;

    return (
        <div class="border border-solid border-yellow-700 bg-yellow-700 p-2 rounded shadow-lg mb-2">
            <div class="flex justify-between mb-5">
                <h2 class="text-xl">{exercise.name}</h2>

                {exercise.serie}
            </div>

            <ul>
                <li>Recupero: {exercise.recovery}</li>
                {exercise.weight > 0 && <li>Peso: {exercise.weight} Kg</li>}
                {exercise.notes && <li>{exercise.notes}</li>}
            </ul>
        </div>
    );
});
