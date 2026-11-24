import { RootActorContext } from "@/context";
import { useQuizSetup, useSetupContent, useStyleTarget } from "@/hooks";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { AnyStyle } from "@/lib/styles";
import { theme } from "@/lib/theme";

export default function QuizStartButton() {
  const { send } = RootActorContext.useActorRef();

  const { styles } = useStyleTarget("quizSetup");
  const { styles: textStyles } = useStyleTarget("text");
  const { setupButton } = useSetupContent();
  const router = useRouter();


  const { data, isQuizValid } = useQuizSetup();
  const { id } = data;

  const handleQuizStart = () => {
    if (!isQuizValid) return;

    send({ type: "NORMAL_QUIZ" });
    router.push(`/quiz/${id}`);
  };
  const buttonTitle = isQuizValid ? "Start Quiz" : "Quiz is not valid";
  return (
    <Button 
    onPress={handleQuizStart} 
    className={`${isQuizValid ? theme.opacity.enabled : theme.opacity.disabled}`}
    style={styles.sartButton as AnyStyle}
    disabled={!isQuizValid}
    
    >
      
      <Text style={textStyles.white}>{buttonTitle}</Text>
    </Button>
  );
}
