import { QUIZ_REGISTRY } from '@/lib/quiz-registry';
import { useLocalSearchParams } from 'expo-router';
import { Text, ScrollView } from 'react-native';

export default function SetupScreen() {
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz = QUIZ_REGISTRY[id];

  if(!quiz){
    return <Text>404, no setup here</Text>
    //TODO thro error to error boundary
  }

  const { Setup } = quiz;

  return (
    <ScrollView >
      <Text>Setup ID: {id}</Text>
      
      <Setup />
    </ScrollView>
  );
}