import { useState } from 'react';
import { Pressable, ScrollView, View, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Users } from 'lucide-react-native';
import type { QuizMode } from '@bq/shared/types';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Icon as LucideIcon } from '@/components/ui/lucide-icon';
import Icon from '@/components/icon';
import { usePracticeContent, useStyleTarget } from '@/hooks';
import { UI_QUIZZES } from '@/lib/content/UI-quizzies.content';
import { QUIZ_REGISTRY } from '@/lib/quiz-registry';
import { theme } from '@/lib/theme';

export default function PracticePage() {
  const [mode, setMode] = useState<QuizMode>('SOLO');
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const router = useRouter();
  const content = usePracticeContent();
  const { styles } = useStyleTarget('practice');

  return (
    <ScrollView
      style={styles.page}
      contentContainerStyle={[styles.container, compact && styles.containerSmall]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>{content.eyebrow}</Text>
          <Text accessibilityRole="header" style={styles.title}>{content.title}</Text>
          <Text style={styles.subtitle}>{content.description}</Text>
        </View>
        <Button variant="ghost" size="icon" style={styles.settingsButton} accessibilityLabel={content.settingsLabel} onPress={() => router.push('/settings')}>
          <Icon name="settings" size={18} color="#64748b" />
        </Button>
      </View>

      <View style={[styles.body, compact && styles.bodySmall]}>
        <View style={[styles.sessions, compact && styles.sessionsSmall]}>
          <View style={styles.sectionHeading}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>{content.quizSectionTitle}</Text>
            <Text style={styles.sectionDescription}>{content.quizSectionDescription}</Text>
          </View>
          <View style={styles.modeSwitcher} accessibilityRole="tablist">
            {(['SOLO', 'VS'] as const).map((value) => (
              <Pressable
                key={value}
                accessibilityRole="tab"
                accessibilityState={{ selected: mode === value }}
                onPress={() => setMode(value)}
                style={({ pressed }) => [styles.modeButton, mode === value && styles.modeSelected, pressed && styles.modePressed]}
              >
                <LucideIcon as={value === 'SOLO' ? User : Users} size={15} color={mode === value ? '#1e3a8a' : '#64748b'} />
                <Text style={[styles.modeText, mode === value && styles.modeTextSelected]}>{value === 'SOLO' ? content.soloLabel : content.vsLabel}</Text>
              </Pressable>
            ))}
          </View>

          {UI_QUIZZES[mode].map((quiz) => {
            const copy = content.quizCards[quiz.id as keyof typeof content.quizCards];
            const available = Object.prototype.hasOwnProperty.call(QUIZ_REGISTRY, quiz.id);
            return (
              <View key={quiz.id} style={styles.quizCard}>
                <View style={styles.cardTop}>
                  <View style={styles.quizIcon}>
                    <Icon name={quiz.icon} size={25} color={theme.colors['primary-blue']} />
                  </View>
                  {!available && <View style={styles.badge}><Text style={styles.badgeText}>{content.comingSoon}</Text></View>}
                </View>
                <View style={styles.cardCopy}>
                  <Text style={styles.cardTitle}>{copy?.title ?? quiz.title}</Text>
                  <Text style={styles.cardDescription}>{copy?.description ?? quiz.description}</Text>
                </View>
                {available && (
                  <View style={styles.features}>
                    <View style={styles.feature}>
                      <Icon name="quiz" size={14} color="#64748b" />
                      <Text style={styles.featureText}>{content.answerFeature}</Text>
                    </View>
                    <View style={styles.feature}>
                      <Icon name="timer" size={14} color="#64748b" />
                      <Text style={styles.featureText}>{content.timerFeature}</Text>
                    </View>
                  </View>
                )}
                <View style={styles.cardActions}>
                  <Button
                    disabled={!available}
                    style={[styles.startButton, !available && styles.startDisabled]}
                    onPress={() => router.push(`/setup/${quiz.id}`)}
                  >
                    <Text style={[styles.startText, !available && styles.startDisabledText]}>{available ? content.startQuiz : content.comingSoon}</Text>
                    {available && <Icon name="chevronRight" size={16} color="#ffffff" />}
                  </Button>
                  {available && <Text style={styles.setupHint}>{content.setupHint}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.study, compact && styles.studySmall]}>
          <View style={styles.sectionHeading}>
            <Text accessibilityRole="header" style={styles.sectionTitle}>{content.studyTitle}</Text>
            <Text style={styles.sectionDescription}>{content.studyDescription}</Text>
          </View>
          <View style={styles.studyList}>
            {([['study', content.contentButton], ['bookmark', content.flashCardButton]] as const).map(([icon, item]) => (
              <View key={icon} style={styles.studyItem}>
                <View style={styles.studyIcon}><Icon name={icon} size={18} color="#64748b" /></View>
                <View style={styles.studyCopy}>
                  <Text style={styles.studyItemTitle}>{item.title}</Text>
                  <Text style={styles.studyItemDescription}>{item.description}</Text>
                  <View style={styles.badge}><Text style={styles.badgeText}>{content.comingSoon}</Text></View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Icon name="bible" size={15} color="#94a3b8" />
        <Text style={styles.footerText}>{content.footer}</Text>
      </View>
    </ScrollView>
  );
}
