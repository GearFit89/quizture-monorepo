import { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import type { AppQuestion } from "@bq/shared/types";
import { RecallQuiz } from "@/components/recall";
import { useStyleTarget } from "@/hooks";
import { useRecallContent } from "@/hooks/recall.hook";
import { useQuestions } from "@/hooks/use-questions";
import { createQuizQuestions, parseRecallCount } from "@/lib/recall/recall";

const DEFAULT_RECALL_LENGTH = 10;

export default function RecallPage() {
  const { count } = useLocalSearchParams<{ count?: string }>();
  const content = useRecallContent();
  const { styles } = useStyleTarget("recall");
  const { data, isLoading, isError } = useQuestions();

  const questions = useMemo(
    () => ((data ?? []) as AppQuestion[]).filter((q) => q.question && q.answer),
    [data],
  );
  const quizQuestions = useMemo(
    () => createQuizQuestions(questions, parseRecallCount(count, DEFAULT_RECALL_LENGTH)),
    [questions, count],
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
        <Text style={styles.subtitle}>{content.loading}</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>{content.errorLoading}</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: content.title }} />
      <RecallQuiz quizQuestions={quizQuestions} questions={questions} />
    </>
  );
}
