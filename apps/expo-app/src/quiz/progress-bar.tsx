import { View, type ColorValue } from 'react-native';
import { Text } from '@/components/ui/text';
import { useQuiz, useQuizContent, useStyleTarget } from '@/hooks';
import { theme } from '@/lib/theme';
import { useSelector } from '@xstate/react';

export interface ProgressBarProps {
  color?: ColorValue;
}

export function ProgressBar({ color = theme.colors['primary-blue'] }: ProgressBarProps = {}) {
  const actor = useQuiz();
  const completed = useSelector(actor, (snapshot) => snapshot.context.completedQuestions.length);
  const remaining = useSelector(actor, (snapshot) => snapshot.context.incomingQuesions.length);
  const total = completed + remaining;
  const current = completed + (remaining > 0 ? 1 : 0);
  const content = useQuizContent();
  const { styles } = useStyleTarget('quiz');
  const maximum = Math.max(0, total);
  const value = Math.max(0, Math.min(current, maximum));
  const position = `${maximum > 0 ? value / maximum * 100 : 0}%` as `${number}%`;
  const label = content.progress.replace('{current}', String(value)).replace('{total}', String(maximum));
  return (
    <View style={styles.progress}>
      <Text style={styles.progressLabel}>{label}</Text>
      <View style={styles.progressRow} accessibilityRole="progressbar" accessibilityLabel={label}
        accessibilityValue={{ min: 0, max: maximum, now: value }}>
        <View style={styles.progressRail}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: position, backgroundColor: color }]} />
          </View>
          <View style={[styles.progressNode, { left: position, backgroundColor: color }]}>
            <Text style={styles.progressNodeText}>{value}</Text>
          </View>
        </View>
        <Text style={styles.progressTotal}>{maximum}</Text>
      </View>
    </View>
  );
}
