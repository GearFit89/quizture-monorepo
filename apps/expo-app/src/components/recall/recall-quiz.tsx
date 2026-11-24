import { ScrollView, Text, View } from "react-native";
import type { AppQuestion, QuizQuestion } from "@bq/shared/types";
import { useStyleTarget } from "@/hooks";
import { useRecallContent, useRecallQuiz } from "@/hooks/recall.hook";
import { RecallQuestion } from "./recall-question";
import { RecallReview } from "./recall-review";

interface RecallQuizProps {
  /** The questions to be answered, in quizIndex order. */
  quizQuestions: QuizQuestion[];
  /** Source question data used to resolve each QuizQuestion's text and answer by id. */
  questions: AppQuestion[];
}

export function RecallQuiz({ quizQuestions, questions }: RecallQuizProps) {
  const content = useRecallContent();
  const { styles } = useStyleTarget("recall");
  const quiz = useRecallQuiz(quizQuestions, questions);

  if (quiz.total === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.subtitle}>{content.empty}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} keyboardShouldPersistTaps="handled">
      {quiz.status === "review" ? <RecallReview quiz={quiz} /> : <RecallQuestion quiz={quiz} />}
    </ScrollView>
  );
}
