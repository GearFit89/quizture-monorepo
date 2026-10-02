import type { ScoreConfig } from "@/types";


// TODO; Make labels keys for lanaguage support
export const defaultScoreConfig: ScoreConfig = {
  id: "default-standard",

  global: {
    mutliplier: 1,
    offset: 0,
  },

  quizOut: {
    perfect: {
      points: 10, // 10 extra bonus points
      label: "Perfect Quiz Out",
      
      threshold: {
        
        correct: 5,
        incorrect: 0
      },
    },
    imperfect: {
      points: 0,
      label: "Imperfect Quiz Out",
      
      threshold: {
        correct: 4
      },
    },
    error: {
      points: -10,
      label: "Quiz Failed",
      threshold: {
        incorrect: 3,
      },
    },
  },

  question: {
    correct: {
      points: 20,
      label: "Correct Answer",
    },
    incorrect: {
      points: -10,
      label: "Incorrect Answer",
    },
  },

  bonus: {
    correct: {
      points: 10,
      label: "Bonus Correct",
    },
    incorrect: {
      points: 0,
      label: "Bonus Missed",
    },
  },
};

export default defaultScoreConfig;