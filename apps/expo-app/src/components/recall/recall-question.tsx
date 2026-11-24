import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useStyleTarget } from "@/hooks";
import { useRecallContent, type RecallQuizState } from "@/hooks/recall.hook";
import { formatContent } from "@/lib/recall/recall";
import { WordBlock, type WordBlockState } from "./word-block";
import { RecallFeedback } from "./recall-feedback";

export function RecallQuestion({ quiz }: { quiz: RecallQuizState }) {
  const content = useRecallContent();
  const { styles } = useStyleTarget("recall");
  const { item, index, total, status, selectedIds, selectedBlocks, currentResult, isLast } = quiz;
  const shake = useSharedValue(0);
  const pop = useSharedValue(1);

  useEffect(() => {
    if (!currentResult) return;
    if (currentResult.correct) {
      pop.value = withSequence(withTiming(1.05, { duration: 150 }), withSpring(1));
    } else {
      shake.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [currentResult, pop, shake]);

  const answerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }, { scale: pop.value }],
  }));

  if (!item) return null;

  const checked = status === "checked";
  const answerBlockState: WordBlockState = checked
    ? currentResult?.correct
      ? "correct"
      : "incorrect"
    : "selected";
  const progress = `${Math.round(((index + (checked ? 1 : 0)) / total) * 100)}%` as const;

  return (
    <View style={styles.content}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={styles.title}>{content.title}</Text>
        <Text style={styles.subtitle}>{content.subtitle}</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.progressText}>
          {formatContent(content.progress, { current: index + 1, total })}
        </Text>
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: total, now: index + 1 }}
          style={styles.progressTrack}
        >
          <View style={[styles.progressFill, { width: progress }]} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>{content.questionLabel}</Text>
        <Text style={styles.questionText}>{item.question}</Text>
      </View>

      <Text style={styles.label}>{content.answerLabel}</Text>
      <Animated.View
        style={[
          styles.answerArea,
          checked && (currentResult?.correct ? styles.answerAreaCorrect : styles.answerAreaIncorrect),
          answerAnimatedStyle,
        ]}
      >
        {selectedBlocks.length === 0 ? (
          <Text style={styles.placeholder}>{content.answerPlaceholder}</Text>
        ) : (
          selectedBlocks.map((block) => (
            <WordBlock
              key={block.id}
              block={block}
              state={answerBlockState}
              disabled={checked}
              onPress={(b) => quiz.removeBlock(b.id)}
            />
          ))
        )}
      </Animated.View>

      {checked && currentResult ? (
        <RecallFeedback result={currentResult} />
      ) : (
        <>
          <Text style={styles.label}>{content.wordBankLabel}</Text>
          <View style={styles.wordBank}>
            {item.blocks.map((block) => (
              <WordBlock
                key={block.id}
                block={block}
                state={selectedIds.includes(block.id) ? "used" : "idle"}
                onPress={(b) => quiz.selectBlock(b.id)}
              />
            ))}
          </View>
        </>
      )}

      <View style={styles.actions}>
        {checked ? (
          <Pressable accessibilityRole="button" onPress={quiz.next} style={styles.button}>
            <Text style={styles.buttonText}>{isLast ? content.finishButton : content.nextButton}</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              accessibilityRole="button"
              onPress={quiz.clear}
              disabled={selectedIds.length === 0}
              style={[styles.secondaryButton, selectedIds.length === 0 && styles.buttonDisabled]}
            >
              <Text style={styles.secondaryButtonText}>{content.clearButton}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={quiz.submit}
              disabled={selectedIds.length === 0}
              style={[styles.button, selectedIds.length === 0 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>{content.submitButton}</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}
