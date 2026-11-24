import { setup, createMachine, AnyStateMachine } from "xstate";
import { soloQuizMachine } from "./quizzes/offline/solo-quiz.machine";



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
      | { type: "NORMAL_QUIZ" }
      | { type: "SELECT_SOLO" }
      | { type: "PRACTICE_QUIZ" }
      | { type: "NETWORK_ONLINE" }
      | { type: "NETWORK_OFFLINE" }
      | { type: "SELECT_GUEST_MODE" }
      | { type: "SELECT_MUTLIPLAYER" }
      | { type: "CONNECTION_REGAINED" }
      | { type: "ON_CONNECTION_FAILED" },
  },
  actors: {
    checkCookies: createMachine({
      /* ... */
    }),
    signUpUser: createMachine({
      /* ... */
    }),
    loginUser: createMachine({
      /* ... */
    }),
    Online: createMachine({
      /* ... */
    }),
    OfflineQuiz: createMachine({
      /* ... */
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QCcD2qAuCCWEwEMAmAOnwFcMALYgY0rBoGtsA7KAYglRbGNYDdUjXnQaMAwumZwAgjQypkAbQAMAXUSgADqljYM2bppAAPRAA5CAGhABPRIQCsANmfEVHlc4As314QBOQgBmAF9QmzRMHDwiUgpqUSZWDjBkNGRiLQAbfAwAM0UAW1p6JkkhbFl5RVUNJBAdPQMjBrMEb0ISRz8AlQBGFUJnc2DnYJt7BH6Xbs9vFQC-fsJzb3DI9CxcAhJyKniqMBYDGjzIdgAZAHkAcWuAVQAVOuMm-UMWY3bCfrdCbwBAJ-cwDYJLJyTBzmEbERweP5dRz9bwAdlR6wiICi21iewSxDILH29BO2DOGEgfAg2TAVzuAEkAHKvBrvFpfNqIQbWOwOIHmYhOAbDFzeRyOQgbbFbGK7Q7UIkk46nc4Qam09gAZQZtyZAH0HgAFVnaXQfVqgdrBYLedyeZxOJYedFQhAhAL-eEqGFLVESobSnFyuIkwnEhIq8lqjV0rUAUUu8fET31twe8a1qYAstcACLx02Nc0c76IG12zxeJ0LFSuvnumYqYgrZH9VFA1zmIOynahgl6KAsFIPLScbi8ARCXiDlijuQKZTqN4lz5lhBBN3BFTeQX+jwS-p9VEDRw96J9-EHWcjsdpDJZXIFYrEWfzmpL+pm5prrkb3lTACfjEPup6OKiYxAmEWLBpeCrENkqBQFAKQMiw448HwLCCMICFIawC61MubKrpapiID0wRCratreOC5iojM5hbkMqLEME-orP0DHBI4wJnjBvZ4vBiHIah6H3ooj55IUyAlKJBEfkW7K-la3IrG6R7OP0cIIiinQ+nW564vKYZQGQcAYFc8YyAAavGaYZlmymkZyanTF0bqEIZIHwn8Nr9DaArGSGJA0NwPDyJ8xDcNkrB0pJmQ5DJL6xfFxAAEb4EwUBoESEAuT+ZHtAsVEjP6dHAuY1VAluYxsUCASotVKyrAxmKbBewnhSwkUcjFLBxTw7BMvGTwAOrXAASgA0vq1wAGILZczKFsR34Wm55EdCoZUMZRVU1QEW7eDMxCAp6QSDKCwQzCFcE9X10VpcN1wGuIb2jSmDJvfqC0yAySZ5oVm3rqVxDlQd3FHSdziOMQjWOnWtrcf093dRFDD9ag+T5ENdKjRN01zW9K2jSDpZ-uK8POIsu7eSs7XOFuyJuBdPQBGMu3QZ1JlxI9WPPbj+PsB9TJfU8P0GlN8a3ADo3A+txZFVtJU+uxKzouBdYohiqJ1e250CnxgLOBB3aCV1plRfw+i2LG2qJsmqZatcNwU6p22WJpCwkBdATmCCIro9bBi2xg9u4JqCZJim+rZs8K1GpcMgAJrxlNHvFRYAHcsi9oIn0gSuOMzgh6GNt28QACOZDYAAXvXKSvqgiGkDbBPTdmMiXPqACKDwMgAWlnqv8lRjUwgxnOeqXbrVVRwooh4CwGWjlt83slcRzXdeN83sCt6g7dh3SRpTTI33iA5A-D6P66BBPArlTPrhjG6Ad7t6ZvXeYjXl1vMOVda4NybmwFubdsqn21E8B4eZU73z-I-BGz9p7gjfszBsgwlhCguuKVEhAILOE5gAk+2Bw72xAfvcBh9IEd3YMtGQWoAAS4gZBTTzFqRB7lkGTxfugueWCjwBBAhdX4AJHDmD4qiUhUDyHAL3mAqAEDj4sGKPgbIfc94YUnNhacKjiBqLkhorRDduFexcHCZqvFWpw18P0eeaxfIDF2sCRYKweYyithXIBO8qFKIMVoZAciaB0i4JhKcuFaHHyCSEsA5j2hSLcOBUYyIuh2NOh-PoQpvTbiajPX4sjt6UMUQfI+r4MBkAgLYHRWEcIznKbASp1SEkWEsSkmx6SeiZKwYseGGIgSSJ3M1AhRTfElNAWUtueN8CwEoGcZAEBYC1MiQ06ZuQ5kLKWa0hASSrGpNsd0hxWCGa4KgrxDBXRwhYjUXgeADRYJ4hXCrdcABaBYbpXkAgLlWX5gYN6hQVM80GSDvA+wxCgoEgxtyOmIR1Lxm94JJGYGwYFlN3IEM0j4KinhuIQUlMEQh8LHmmQJMqMkFJIBos9u0AhNN3EB1WM1U8W4ZgiP9s6bc6IjIArgmGJUkYKVqmpdnaYiwvLcTmCKVEsK0S7lkQSAVRwhWUnVFHMAIqx7THAl5QhzYqw+D8I6IIniSX9mvNgIct5NVg1psQP+1ZA4+G0p6LyCw3A2loj4by4wAgKoOKJFCbA0I2qQeic6jgYXeVGH4X4LEhj2v9N5Aht0lgCV5oCsyFkmmhvcrMOEt1ghSN3NxFwErxTuFOh2OGkjP5l15RjXqgsyIqVFQCLcXQRGNSCKKYhUoG3ygFlFbgA18a5u2pihsNougtlcPCYYt0IKmqEoOzGw6WAxWFvFcd7QS4gUuv6OGlg+ITCnadeGiMrqGUJWM+REcd0WDdOMXSngAjIl3AFGRA6fF3sjjSDVJEXl-kGBCs2vxdq6xcGWhsUF3CMUBCoSRvxPTEpXT+ihu9JmosAyCvNmDAK2mcRBjshDkS2lvRh-xUzUAPrFWChs6ISD7hA3WJYfwv0Zr5cUzD1DlHRLIfwADG10XbRmLnXZb72J6RhKsUUFGFFYb4+UoxRQTF71o2ieGeLJHgVcF4Vw887VLwWIHIIEp5N+NKTQ8psSoqhI05Yc6HE51rE5tOj+cMiNm2quiW09bOPCTkZRqzSm25NKqVMYTNLEAIdwV0NYvxiFHkjZpHWZygSAlmCiZd3jAG-p4wE-jMzNn4EWfcqLorNMQ0WLTWtO5hn0amP0dsbgBk9qGL0U6FmJm8eIEUMg2QDDJVsGkWjgxGvlhncKLwEpCW1o4wizN3GqPgP64N7Aw20i0DXQYbDFWtVsvS7K48gJ9YNj8IKabMrbRSIYgts1eXguKb6wNobuQRuZEQhlDKkXla4dE64FshL0TNaPCeQK4mdM5I8Nub0fRiHdYK83Nbb38AfeIAAd3wB8Pbf2RPtD+G4CHU8BhNS6LtN0CwRGgSBIQgEqxdqI5W8olHG33tbeGykMbgOIcg+a01ME4nsVEZcKxOsCPv2PYU711nm3MjIAYDtrnOH8d53EyeEg03A6zYBGbJnIWXvrbl8QBXsBXvlbx9F6YPPgeMX5+DwlbpJSte9JGzocqMTXNCEAA */
  context: {
    username:""
  },
  id: "root",
  type: "parallel",
  states: {
    auth: {
      initial: "checking",
      states: {
        checking: {
          invoke: {
            id: "checkCookiesActor",
            input: {},
            onDone: {
              target: "authenticated",
            },
            onError: {
              target: "unauthenticated",
            },
            src: "checkCookies",
          },
        },
        authenticated: {
          on: {
            LOGOUT: {
              target: "unauthenticated",
            },
          },
        },
        unauthenticated: {
          initial: "idle",
          states: {
            idle: {
              on: {
                LOGIN: {
                  target: "#root.auth.loggingIn",
                },
                SIGN_UP: {
                  target: "#root.auth.signingUp",
                },
                SELECT_GUEST_MODE: {
                  target: "#root.auth.guest",
                },
              },
            },
          },
        },
        signingUp: {
          invoke: {
            id: "signUpActor",
            input: {},
            onDone: {
              target: "loggingIn",
            },
            onError: {
              target: "unauthenticated",
            },
            src: "signUpUser",
          },
        },
        loggingIn: {
          invoke: {
            id: "loginActor",
            input: {},
            onDone: {
              target: "authenticated",
            },
            onError: {
              target: "unauthenticated",
            },
            src: "loginUser",
          },
        },
        guest: {
          on: {
            LEAVE_GUEST: {
              target: "unauthenticated",
            },
          },
        },
      },
    },
    connection: {
      initial: "online",
      states: {
        online: {
          on: {
            NETWORK_OFFLINE: {
              target: "offline",
            },
            ON_CONNECTION_FAILED: {
              target: "offline",
            },
          },
          invoke: {
            id: "online.background",
            input: {},
            onError: {
              target: "offline",
            },
            src: "Online",
          },
        },
        offline: {
          on: {
            NETWORK_ONLINE: {
              target: "online",
            },
            CONNECTION_REGAINED: {
              target: "online",
            },
          },
        },
      },
    },
    activity: {
      initial: "idle",
      states: {
        idle: {
          on: {
            SELECT_SOLO: {
              target: "#root.activity.quizzing.solo",
            },
            SELECT_MUTLIPLAYER: {
              target: "#root.activity.quizzing.multiplayer",
            },
          },
        },
        quizzing: {
          initial: "solo",
          states: {
            solo: {
              initial: "active",
              states: {
                active: {
                  on: {
                    NORMAL_QUIZ: {
                      target: "normalQuiz",
                    },
                    PRACTICE_QUIZ: {
                      target: "practice",
                    },
                    STUDY: {
                      target: "study",
                    },
                    FLASHCARDS: {
                      target: "flashcards",
                    },
                  },
                },
                normalQuiz: {
                  invoke: {
                    id: "solo.normalQuiz",
                    input: {},
                    onDone: {
                      target: "#root.activity.idle",
                    },
                    src: "OfflineQuiz",
                  },
                },
                practice: {
                  invoke: {
                    id: "solo.practice",
                    input: {},
                    onDone: {
                      target: "#root.activity.idle",
                    },
                    src: "OfflineQuiz",
                  },
                },
                study: {
                  invoke: {
                    id: "solo.study",
                    input: {},
                    onDone: {
                      target: "#root.activity.idle",
                    },
                    src: "OfflineQuiz",
                  },
                },
                flashcards: {
                  invoke: {
                    id: "solo.flashcards",
                    input: {},
                    onDone: {
                      target: "#root.activity.idle",
                    },
                    src: "OfflineQuiz",
                  },
                },
              },
            },
            multiplayer: {
              initial: "connecting",
              states: {
                connecting: {},
                lobby: {},
                waiting: {},
                playing: {},
                reconnecting: {},
                results: {},
              },
            },
          },
        },
      },
    },
  },
});



const machines: Record<string, AnyStateMachine> = {
  root: rootMachine,
  soloOfflineQuiz: soloQuizMachine
}


export default machines;