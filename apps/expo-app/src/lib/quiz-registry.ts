import StandardSetup from "@/components/setups/standard";
import { QuizContainer } from '@/quiz';
import { QuizKey } from "@bq/shared/types";

interface QuizEntry {
    Setup: React.ComponentType;
    // TODO Add QuizActor id Type
    actorId: string;

    Quiz: React.ComponentType;
}


export const QUIZ_REGISTRY: Record<QuizKey, QuizEntry> = {

    "SOLO-1":
    {
        Setup: StandardSetup,
        actorId: "solo.normalQuiz",
        Quiz: QuizContainer


    }

}
