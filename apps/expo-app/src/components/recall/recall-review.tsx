import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Check, X } from "lucide-react-native";
import { useStyleTarget } from "@/hooks";
import { useRecallContent, type RecallQuizState } from "@/hooks/recall.hook";
import { formatContent } from "@/lib/recall/recall";

export function RecallReview({ quiz }: { quiz: RecallQuizState }) {
  const content = useRecallContent();
  const { styles } = useStyleTarget("recall");
  const { results, summary } = quiz;

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>{content.reviewTitle}</Text>
        <Text style={styles.subtitle}>{content.reviewSubtitle}</Text>
      </View>

      <Animated.View entering={ZoomIn.springify()} style={styles.scoreCard}>
        <Text style={styles.scorePercent}>
          {formatContent(content.reviewPercent, { percent: summary.percent })}
        </Text>
        <Text style={styles.scoreText}>
          {formatContent(content.reviewScore, { correct: summary.correct, total: summary.total })}
        </Text>
      </Animated.View>

      {results.map((result, i) => (
        <Animated.View
          key={`${result.item.quizQuestion.id}-${i}`}
          entering={FadeInDown.delay(i * 60)}
          style={[styles.reviewItem, result.correct ? styles.reviewItemCorrect : styles.reviewItemIncorrect]}
        >
          <View style={styles.reviewHeader}>
            <Text style={styles.reviewIndex}>
              {formatContent(content.progress, { current: i + 1, total: summary.total })}
            </Text>
            <View style={result.correct ? styles.badgeCorrect : styles.badgeIncorrect}>
              {result.correct ? (
                <Check size={14} color={styles.iconCorrect.color} strokeWidth={3} />
              ) : (
                <X size={14} color={styles.iconIncorrect.color} strokeWidth={3} />
              )}
              <Text style={styles.badgeText}>
                {result.correct ? content.reviewCorrectLabel : content.reviewIncorrectLabel}
              </Text>
            </View>
          </View>
          <Text style={styles.reviewQuestion}>{result.item.question}</Text>
          <Text style={styles.reviewLabel}>{content.reviewYourAnswer}</Text>
          <Text style={result.correct ? styles.reviewAnswerCorrect : styles.reviewAnswerIncorrect}>
            {result.selectedWords.length > 0 ? result.selectedWords.join(" ") : content.reviewNoAnswer}
          </Text>
          {!result.correct && (
            <>
              <Text style={styles.reviewLabel}>{content.reviewCorrectAnswer}</Text>
              <Text style={styles.reviewAnswer}>{result.item.answer}</Text>
            </>
          )}
        </Animated.View>
      ))}

      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={quiz.restart} style={styles.button}>
          <Text style={styles.buttonText}>{content.retryButton}</Text>
        </Pressable>
      </View>
    </View>
  );
}
