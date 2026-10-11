import { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useSelector } from '@xstate/react';
import Icon from '@/components/icon';
import { QuizTimer } from './quiz-timer';

import { useQuiz, useQuestionActor, useQuizContent, useStyleTarget } from '@/hooks';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Blocks } from '@/components/mulit-blocks';

export function QuestionSection() {
  const actor = useQuestionActor()!;
  const quizActor = useQuiz();
  const mode = useSelector(quizActor, (snapshot) => snapshot.context.difficulty);
  const question = useSelector(actor, (snapshot) => snapshot.context.question);
  const activeUser = useSelector(actor, (snapshot) => snapshot.context.activeUser);
  const phase = useSelector(actor, (snapshot) =>
    snapshot.matches('Correct') ? 'correct' : snapshot.matches('Incorrect') ? 'incorrect'
    : snapshot.matches({ WaitingForInput: 'Waiting' }) ? 'ready'
    : snapshot.matches('WaitingForJump') ? 'jump' : 'display');
  const content = useQuizContent();
  const { styles } = useStyleTarget('quiz');
  const [answer, setAnswer] = useState('');
  const [retry, setRetry] = useState(false);
  const resolved = phase === 'correct' || phase === 'incorrect';
  const ready = phase === 'ready';

  useEffect(() => {
    // This UI presents the complete question and enters answer entry without a buzz-in control.
    if (phase === 'jump') {
      actor.send({ type: 'JUMP', username: activeUser });
    }
  }, [actor, phase, activeUser]);

  const submit = () => {
    if (resolved) {
      actor.send({ type: 'NEXT' });
      return;
    }
    if (!ready || !answer.trim()) return;
    actor.send({ type: 'USER_INPUT', userInput: answer.trim() });
    const result = actor.getSnapshot();
    if (result.matches('Correct') || result.matches('Incorrect')) {
      actor.send({ type: 'NEXT' });
    } else {
      setRetry(true);
    }
  };

  return (
    <View style={styles.questionSection}>
      <View style={styles.questionCard}>
     
      <View style={styles.questionBadge}>
        <Text style={styles.questionBadgeText}>
          {question.head}
        </Text>
      </View>
      <Text style={styles.questionBody}>
        <Text style={styles.questionPrefix}>{content.questionStart}</Text>
        {question.body}
      </Text>
      </View>
      <View style={styles.answerCard}>
      {ready &&
        (mode === 'easy' ? (
          <Blocks onChange={setAnswer} />
        ) : (
          <TextInput
            style={styles.answerInput}
            value={answer}
            onChangeText={setAnswer}
            placeholder={content.answerPlaceholder}
            accessibilityLabel={content.answerLabel}
            multiline
            autoCorrect={false}
          />
        ))}

      {retry && ready && (
        <Text accessibilityLiveRegion="polite">{content.tryAgain}</Text>
      )}
      {phase === 'incorrect' && <Text>{content.incorrect}</Text>}

      {/* <Pressable disabled style={styles.microphoneButton} accessibilityRole="button" accessibilityState={{ disabled: true }} accessibilityLabel={content.microphoneLabel}>
        <Icon name="microphone" size={18} color="#8000ff" />
        <Text style={styles.microphoneText}>{content.microphoneLabel}</Text>
      </Pressable> */}
      <Button
        style={styles.submitButton}
        onPress={submit}
        disabled={!resolved && (!ready || !answer.trim())}
      >
        <Text>{resolved ? content.next : content.submit}</Text>
      </Button>
      </View>
    </View>
  );
}
