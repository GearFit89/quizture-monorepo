import { QUIZ_REGISTRY } from '@/lib/quiz-registry';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Text } from '@/components/ui/text';
import { View } from 'react-native';
import { useCallback } from 'react';
import { QuizProvider } from '@/providers';
import { useStyleTarget } from '@/hooks';
import { RootActorContext } from '@/context';

export default function QuizPage() {
  const { styles } = useStyleTarget('quiz');
  const { send } = RootActorContext.useActorRef();
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz = QUIZ_REGISTRY[id];

  useFocusEffect(
    useCallback(() => {
      return () => {
        send({ type: 'ACTIVITY_QUIT' });
        console.log('Cleaned up Quiz: ', id);
      };
    }, []),
  );

  if (!quiz) {
    return <Text>404, no quiz here</Text>;
  }
  const QuizComponent = quiz.Quiz; // Rename for clarity

  return (
    <View style={styles.page}>
      <QuizProvider actorId={quiz.actorId}>
        <QuizComponent />
      </QuizProvider>
    </View>
  );
}
