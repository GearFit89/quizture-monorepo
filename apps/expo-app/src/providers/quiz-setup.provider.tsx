import { QuizSetupStateArgs, useQuizSetupState } from "@/hooks/quiz-setup.hook";
import React from 'react';
import { QuizSetupContext } from "@/context";

interface QuizSetupProviderProps< Mode_T > extends QuizSetupStateArgs <Mode_T>{
    children: React.ReactNode;
    
    
     
}

export function QuizSetupProvider<Mode_T>({
    children,
    quizType,
    id, 
    minQuizQuestionLength,
    initialMode
   }: QuizSetupProviderProps<Mode_T>
){
  const quizSetupState =  useQuizSetupState({
        quizType,
        initialMode,
        id,
        minQuizQuestionLength

    })
   

   
   

    return (
        <QuizSetupContext.Provider value={quizSetupState} >

            {children}

        </QuizSetupContext.Provider>
    )
}