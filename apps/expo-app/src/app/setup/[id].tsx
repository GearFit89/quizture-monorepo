import { QUIZ_REGISTRY } from '@/lib/quiz-registry';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Text } from '@/components/ui/text';
import { useSetupContent, useStyleTarget } from '@/hooks';

export default function SetupScreen() {
  const { styles } = useStyleTarget('quizSetup');
  const { filterSection } = useSetupContent();
  
  const { id } = useLocalSearchParams<{ id: string }>();
  const quiz = QUIZ_REGISTRY[id];

  if(!quiz){
    return <Text>404, no setup here</Text>
    //TODO thro error to error boundary
  }

  const { Setup } = quiz;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
      <Text style={styles.heading}>{filterSection.title}</Text>
      <Text style={styles.subtitle}>{filterSection.subtitle}</Text>
      
      <Setup />
    </ScrollView>
  );
}