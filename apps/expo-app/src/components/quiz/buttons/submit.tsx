import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useEffect, useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { useActorRef, useSelector } from '@xstate/react';
import Icon from '@/components/icon';
import {
  useQuiz,
  useQuestionActor,
  useQuizContent,
  useStyleTarget,
} from '@/hooks';

export function SubmitButton() {
 const questionActor = useQuestionActor()!
 const data = useSelector(questionActor, ({ context})=> ())
  const content = useQuizContent();
  const { styles } = useStyleTarget('quiz');
  const handleSubmit = () => {
    questionActor.send({
        type: "USER_INPUT",
        userInput: 
    })
  }
  return (
    <Button
      style={styles.submitButton}
      onPress={handleSubmit}
      disabled={state.macthes('watinginForInput')}
    >
      <Text>{content.submit}</Text>
    </Button>
  );
}
