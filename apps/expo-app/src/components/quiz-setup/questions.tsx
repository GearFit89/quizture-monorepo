import { useQuizSetup, useSetupContent, useStyleTarget } from "@/hooks";
import { useFilteredQuestions } from "@/hooks/use-questions";
import { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { TriangleAlertIcon } from "lucide-react-native";

export function FilteredQuestions() {
  
  const { data, isQuizValid, setIsQuizVaild, minQuizQuestionLength } =
    useQuizSetup();

  

  const { questions,  isLoadingError, error } = useFilteredQuestions({
    filterCriteria: data.questionFilters,
  });

  error && console.error(error);
  
  useEffect(() => {
    setIsQuizVaild(questions.length >= minQuizQuestionLength);
  }, [questions]);

  return (
    <View>
      {isQuizValid ? <QuizSetupLength length= {questions.length} /> : <QuizSetupError />}
    </View>
  );
}

function QuizSetupError() {
  const { errorInvalidQuestionLength } = useSetupContent()

  return (
    <View className="border-border">
      <TriangleAlertIcon color="red" size={20} />
      <Text className="text-red-500" numberOfLines={1}>{errorInvalidQuestionLength.title}</Text>
      <Text className="text-red-500">{errorInvalidQuestionLength.message}</Text>
    </View>
  );
}

function QuizSetupLength ({length}: { length: number}) {
const { styles } = useStyleTarget("quizSetup")
  return (
    <View style= {styles.quizLength}>
      <Text>{length}</Text>
    </View>
  )
}
