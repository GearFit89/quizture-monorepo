import { setup, createMachine, StateMachine, AnyStateMachine } from "xstate";
import {  normalQuizMachine, QuizInput } from "./quizzes/normal.machine";
import type { DifficultyLevel, Question } from "../types";


export const rootMachine = setup({
  types: {
    context: {} as { username: string },
    events: {} as
      | { type: "LOGIN" }
      | { type: "STUDY" }
      | { type: "LOGOUT" }
      | { type: "SIGN_UP" }
      | { type: "FLASHCARDS" }
      | { type: "LEAVE_GUEST" }
      | {
          type: "NORMAL_QUIZ";
          questions?: Question[];
          quizLength?: number;
          difficulty?: DifficultyLevel;
          isTimed: boolean
        }
      | { type: "SELECT_SOLO" }
      | { type: "PRACTICE_QUIZ" }
      | { type: "NETWORK_ONLINE" }
      | { type: "NETWORK_OFFLINE" }
      | { type: "SELECT_GUEST_MODE" }
      | { type: "SELECT_MUTLIPLAYER" }
      | { type: "CONNECTION_REGAINED" }
      | { type: "ON_CONNECTION_FAILED" }
      | { type: "ACTIVITY_QUIT"}
  },
  actors: {
    checkCookies: createMachine({/* ... */}),
    signUpUser: createMachine({/* ... */}),
    loginUser: createMachine({/* ... */}),
    Online: createMachine({/* ... */}),
    OfflineQuiz: createMachine({/* ... */}),
    NormalQuiz: normalQuizMachine,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcD2qAuCCWEwEMAmAOnwFcMALYgY0rBoGtsA7KAYglRbGNYDdUjXnQaMAwumZwAgjQypkAbQAMAXUSgADqljYM2bppAAPRAA5CAGhABPRIQCsANmfEVHlc4As314QBOQgBmAF9QmzRMHDwiUgpqUSZWDjBkNGRiLQAbfAwAM0UAW1p6JkkhbFl5RVUNJBAdPQMjBrMEb0ISRz8AlQBGFUJnc2DnYJt7BH6Xbs9vFQC-fsJzb3DI9CxcAhJyKniqMBYDGjzIdgAZAHkAcWuAVQAVOuMm-UMWY3bCfrdCbwBAJ-cwDYJLJyTBzmEbERweP5dRz9bwAdlR6wiICi21iewSxDILH29BO2DOGEgfAg2TAVzuAEkAHKvBrvFpfNqIQbWOwOIHmYhOAbDFzeRyOQgbbFbGK7Q7UIkk46nc4Qam09gAZQZtyZAH0HgAFVnaXQfVqgdrBYLedyeZxOJYedFQhAhAL-eEqGFLVESobSnFyuIkwnEhIq8lqjV0rUAUUu8fET31twe8a1qYAstcACLx02Nc0c76IG12zxeJ0LFSuvnumYqYgrZH9VFA1zmIOynahgl6KAsFIPLScbi8ARCXiDlijuQKZTqN4lz5lhBBN3BFTeQX+jwS-p9VEDRw96J9-EHWcjsdpDJZXIFYrEWfzmpL+pm5prrkb3lTACfjEPup6OKiYxAmEWLBpeCrENkqBQFAKQMiw448HwLCCMICFIawC61MubKrpapiID0wRCratreOC5iojM5hbkMqLEME-orP0DHBI4wJnjBvZ4vBiHIah6H3ooj55IUyAlKJBEfkW7K-la3IrG6R7OP0cIIiinQ+nW564vKYZQGQcAYFc8YyAAavGaYZlmymkZyanTF0bqEIZIHwn8Nr9DaArGSGJA0NwPDyJ8xDcNkrB0pJmQ5DJL6xfFxAAEb4EwUBoESEAuT+ZHtAsVEjP6dHAuY1VAluYxsUCASotVKyrAxmKbBewnhSwkUcjFLBxTw7BMvGTwAOrXAASgA0vq1wAGILZczKFsR34Wm55EdCoZUMZRVU1QEW7eDMxCAp6QSDKCwQzCFcE9X10VpcN1wGuIb2jSmDJvfqC0yAySZ5oVm3rqVxDlQd3FHSdziOMQjWOnWtrcf093dRFDD9ag+T5ENdKjRN01zW9K2jSDpZ-uK8POIsu7eSs7XOFuyJuBdPQBGMu3QZ1JlxI9WPPbj+PsB9TJfU8P0GlN8a3ADo3A+txZFVtJU+uxKzouBdYohiqJ1e250CnxgLOBB3aCV1plRfw+i2LG2qJsmqZatcNwU6p22WJpCwkBdATmCCIro9bBi2xg9u4JqCZJim+rZs8K1GpcMgAJrxlNHvFRYAHcsi9oIn0gSuOMzgh6GNt28QACOZDYAAXvXKSvqgiGkDbBPTdmMiXPqACKDwMgAWlnqv8lRjUwgxnOeqXbrVVRwooh4CwGWjlt83slcRzXdeN83sCt6g7dh3SRpTTI33iA5A-D6P66BBPArlTPrhjG6Ad7t6ZvXeYjXl1vMOVda4NybmwFubdsqn21E8B4eZU73z-I-BGz9p7gjfszBsgwlhCguuKVEhAILOE5gAk+2Bw72xAfvcBh9IEd3YMtGQWoAAS4gZBTTzFqRB7lkGTxfugueWCjwBBAhdX4AJHDmD4qiUhUDyHAL3mAqAEDj4sGKPgbIfc94YUnNhacKjiBqLkhorRDduFexcHCZqvFWpw18P0eeaxfIDF2sCRYKweYyithXIBO8qFKIMVoZAciaB0i4JhKcuFaHHyCSEsA5j2hSLcOBUYyIuh2NOh-PoQpvTbiajPX4sjt6UMUQfI+r4MBkAgLYHRWEcIznKbASp1SEkWEsSkmx6SeiZKwYseGGIgSSJ3M1AhRTfElNAWUtueN8CwEoGcZAEBYC1MiQ06ZuQ5kLKWa0hASSrGpNsd0hxWCGa4KgrxDBXRwhYjUXgeADRYJ4hXCrdcABaBYbpXkAgLlWX5gYN6hQVM80GSDvA+wxCgoEgxtyOmIR1Lxm94JJGYGwYFlN3IEM0j4KinhuIQUlMEQh8LHmmQJMqMkFJIBos9u0AhNN3EB1WM1U8W4ZgiP9s6bc6IjIArgmGJUkYKVqmpdnaYiwvLcTmCKVEsK0S7lkQSAVRwhWUnVFHMAIqx7THAl5QhzYqw+D8I6IIniSX9mvNgIct5NVg1psQP+1ZA4+G0p6LyCw3A2loj4by4wAgKoOKJFCbA0I2qQeic6jgYXeVGH4X4LEhj2v9N5Aht0lgCV5oCsyFkmmhvcrMOEt1ghSN3NxFwErxTuFOh2OGkjP5l15RjXqgsyIqVFQCLcXQRGNSCKKYhUoG3ygFlFbgA18a5u2pihsNougtlcPCYYt0IKmqEoOzGw6WAxWFvFcd7QS4gUuv6OGlg+ITCnadeGiMrqGUJWM+REcd0WDdOMXSngAjIl3AFGRA6fF3sjjSDVJEXl-kGBCs2vxdq6xcGWhsUF3CMUBCoSRvxPTEpXT+ihu9JmosAyCvNmDAK2mcRBjshDkS2lvRh-xUzUAPrFWChs6ISD7hA3WJYfwv0Zr5cUzD1DlHRLIfwADG10XbRmLnXZb72J6RhKsUUFGFFYb4+UoxRQTF71o2ieGeLJHgVcF4Vw887VLwWIHIIEp5N+NKTQ8psSoqhI05Yc6HE51rE5tOj+cMiNm2quiW09bOPCTkZRqzSm25NKqVMYTNLEAIdwV0NYvxiFHkjZpHWZygSAlmCiZd3jAG-p4wE-jMzNn4EWfcqLorNMQ0WLTWtO5hn0amP0dsbgBk9qGL0U6FmJm8eIEUMg2QDDJVsGkWjgxGvlhncKLwEpCW1o4wizN3GqPgP64N7Aw20i0DXQYbDFWtVsvS7K48gJ9YNj8IKabMrbRSIYgts1eXguKb6wNobuQRuZEQhlDKkXla4dE64FshL0TNaPCeQK4mdM5I8Nub0fRiHdYK83Nbb38AfeIAAd3wB8Pbf2RPtD+G4CHU8BhNS6LtN0CwRGgSBIQgEqxdqI5W8olHG33tbeGykMbgOIcg+a01ME4nsVEZcKxOsCPv2PYU711nm3MjIAYDtrnOH8d53EyeEg03A6zYBGbJnIWXvrbl8QBXsBXvlbx9F6YPPgeMX5+DwlbpJSte9JGzocqMTXNCEAA */
  context: {
    username: "",
  },
  id: "root",
  type: "parallel",
  states: {
    Auth: {
      initial: "Checking",
      states: {
        Checking: {
          invoke: {
            id: "checkCookiesActor",
            input: {},
            onDone: {
              target: "Authenticated",
            },
            onError: {
              target: "Unauthenticated",
            },
            src: "checkCookies",
          },
        },
        Authenticated: {
          on: {
            LOGOUT: {
              target: "Unauthenticated",
            },
          },
        },
        Unauthenticated: {
          initial: "Idle",
          states: {
            Idle: {
              on: {
                LOGIN: {
                  target: "#root.Auth.LoggingIn",
                },
                SIGN_UP: {
                  target: "#root.Auth.SigningUp",
                },
                SELECT_GUEST_MODE: {
                  target: "#root.Auth.Guest",
                },
              },
            },
          },
        },
        SigningUp: {
          invoke: {
            id: "signUpActor",
            input: {},
            onDone: {
              target: "LoggingIn",
            },
            onError: {
              target: "Unauthenticated",
            },
            src: "signUpUser",
          },
        },
        LoggingIn: {
          invoke: {
            id: "loginActor",
            input: {},
            onDone: {
              target: "Authenticated",
            },
            onError: {
              target: "Unauthenticated",
            },
            src: "loginUser",
          },
        },
        Guest: {
          on: {
            LEAVE_GUEST: {
              target: "Unauthenticated",
            },
          },
        },
      },
    },
    Connection: {
      initial: "Online",
      states: {
        Online: {
          on: {
            NETWORK_OFFLINE: {
              target: "Offline",
            },
            ON_CONNECTION_FAILED: {
              target: "Offline",
            },
          },
          invoke: {
            id: "online.background",
            input: {},
            onError: {
              target: "Offline",
            },
            src: "Online",
          },
        },
        Offline: {
          on: {
            NETWORK_ONLINE: {
              target: "Online",
            },
            CONNECTION_REGAINED: {
              target: "Online",
            },
          },
        },
      },
    },
    Activity: {
      initial: "Idle",
      states: {
        Idle: {
          on: {
            NORMAL_QUIZ: { target: "#root.Activity.Quizzing.NormalQuiz" },
            SELECT_SOLO: {
              target: "#root.Activity.Quizzing",
            },
            SELECT_MUTLIPLAYER: {
              target: "#root.Activity.Quizzing",
            },
          },
        },
        Quizzing: {
          initial: "Active",
            on: {
                ACTIVITY_QUIT: {
                  target: "#root.Activity.Idle"
                }
              },
          states: {
            Active: {
              on: {
                NORMAL_QUIZ: {
                  target: "NormalQuiz",
                },
                PRACTICE_QUIZ: {
                  target: "Practice",
                },
                STUDY: {
                  target: "Study",
                },
                FLASHCARDS: {
                  target: "Flashcards",
                },
              },
            },
            NormalQuiz: {
              invoke: {
                id: "solo.normalQuiz",
                input: ({ event, context }) => ({
                  quizLength:
                    event.type === "NORMAL_QUIZ"
                      ? (event.quizLength ?? 20)
                      : 20,
                  questions:
                    event.type === "NORMAL_QUIZ" ? (event.questions ?? []) : [],
                  difficulty:
                    event.type === "NORMAL_QUIZ"
                      ? (event.difficulty ?? "easy")
                      : "easy",
                  userId: context.username || "solo",
                  isQuestionTimed: event.type === "NORMAL_QUIZ"
                       ? event.isTimed : false
                }) satisfies QuizInput ,
                onDone: {
                  target: "#root.Activity.Quizzing.Results",
                },
                src: "NormalQuiz",
              },
            
            },
            Practice: {
              invoke: {
                id: "solo.practice",
                input: {},
                onDone: {
                  target: "#root.Activity.Idle",
                },
                src: "OfflineQuiz",
              },
            },
            Study: {
              invoke: {
                id: "solo.study",
                input: {},
                onDone: {
                  target: "#root.Activity.Idle",
                },
                src: "OfflineQuiz",
              },
            },
            Flashcards: {
              invoke: {
                id: "solo.flashcards",
                input: {},
                onDone: {
                  target: "#root.Activity.Idle",
                },
                src: "OfflineQuiz",
              },
            },
            Connecting: {},
            Lobby: {},
            Waiting: {},
            Playing: {},
            Reconnecting: {},
            Results: {
              on: { NORMAL_QUIZ: { target: "NormalQuiz" } },
            },
          },
        },
      },
    },
  },
});
