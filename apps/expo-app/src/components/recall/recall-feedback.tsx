import { Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { Check, X } from "lucide-react-native";
import { useRecallContent } from "@/hooks/recall.hook";
import { useStyleTarget } from "@/hooks";
import type { RecallResult } from "@/lib/recall/recall";

export function RecallFeedback({ result }: { result: RecallResult }) {
  const content = useRecallContent();
  const { styles } = useStyleTarget("recall");
  const { correct } = result;

  return (
    <Animated.View
      entering={FadeInDown.springify()}
      accessibilityLiveRegion="polite"
      style={[styles.feedback, correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}
    >
      <Animated.View
        entering={ZoomIn.springify().delay(80)}
        style={correct ? styles.feedbackIconCorrect : styles.feedbackIconIncorrect}
      >
        {correct ? (
          <Check size={24} color={styles.iconCorrect.color} strokeWidth={3} />
        ) : (
          <X size={24} color={styles.iconIncorrect.color} strokeWidth={3} />
        )}
      </Animated.View>
      <View style={styles.feedbackText}>
        <Text style={correct ? styles.feedbackTitleCorrect : styles.feedbackTitleIncorrect}>
          {correct ? content.correctTitle : content.incorrectTitle}
        </Text>
        <Text style={styles.feedbackMessage}>
          {correct ? content.correctMessage : content.incorrectMessage}
        </Text>
        {!correct && <Text style={styles.feedbackAnswer}>{result.item.answer}</Text>}
      </View>
    </Animated.View>
  );
}
