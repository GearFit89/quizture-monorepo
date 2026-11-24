import { useEffect } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useStyleTarget } from "@/hooks";
import type { RecallBlock } from "@/lib/recall/recall";

export type WordBlockState = "idle" | "selected" | "used" | "correct" | "incorrect";

interface WordBlockProps {
  block: RecallBlock;
  state?: WordBlockState;
  disabled?: boolean;
  onPress?: (block: RecallBlock) => void;
}

export function WordBlock({ block, state = "idle", disabled, onPress }: WordBlockProps) {
  const { styles } = useStyleTarget("recall");
  const scale = useSharedValue(1);

  useEffect(() => {
    if (state === "correct") {
      scale.value = withSequence(withTiming(1.12, { duration: 140 }), withSpring(1));
    }
  }, [scale, state]);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const stateStyle =
    state === "selected"
      ? styles.blockSelected
      : state === "used"
        ? styles.blockUsed
        : state === "correct"
          ? styles.blockCorrect
          : state === "incorrect"
            ? styles.blockIncorrect
            : undefined;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={block.word}
        accessibilityState={{ disabled: disabled || state === "used" }}
        disabled={disabled || state === "used"}
        onPress={() => onPress?.(block)}
        onPressIn={() => {
          scale.value = withTiming(0.92, { duration: 80 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[styles.block, stateStyle]}
      >
        <Text style={styles.blockText}>{block.word}</Text>
      </Pressable>
    </Animated.View>
  );
}
