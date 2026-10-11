import { RootActorContext } from '@/context';
import { useQuizSetup, useSetupContent, useStyleTarget } from '@/hooks';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useFilteredQuestions } from '@/hooks/use-questions';
import Icon from '@/components/icon';

export default function QuizStartButton() {
  const { send } = RootActorContext.useActorRef();

  const { styles } = useStyleTarget('quizSetup');
  const { setupButton, invalidSetupButton } = useSetupContent();
  const router = useRouter();

  const { data, isQuizValid, minQuizQuestionLength } = useQuizSetup();
  const { id } = data;
  const { questions, isPending, isError } = useFilteredQuestions({
    filterCriteria: data.questionFilters!,
  });
  const canStart =
    isQuizValid && !isPending && !isError && questions.length > 0;

  const handleQuizStart = () => {
    if (!canStart) return;
    console.debug("Date before starting the quiz:", data)
    send({
      type: 'NORMAL_QUIZ',
      questions,
      quizLength: minQuizQuestionLength,
      difficulty: data.difficultyLevel,
      isTimed: data.mode === "timed"
    });
    router.push(`/quiz/${id}`);
  };
  const buttonTitle = canStart ? setupButton : invalidSetupButton;
  return (
    <Button
      onPress={handleQuizStart}
      style={[styles.sartButton, !canStart && styles.startButtonDisabled]}
      disabled={!canStart}
    >
      <Icon name="playCircle" color="#ffffff" size={22} />
      <Text style={styles.startButtonText}>{buttonTitle}</Text>
    </Button>
  );
}
