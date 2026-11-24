import { theme } from "../theme";
import type { StyleClass } from "./types";

export const stylesContent = {
  "home": {
    "title": {
      "width": 23
    },
    "name": {
      "width": 899
    }
  },
  "page": {
    "read": {
      "height": 89
    }
  },

  "difficultyOption": {
    "container": {
      "padding": 16,
      "marginVertical": 8,
      "borderRadius": 12,
      "borderWidth": 1
    },
    "superHard": {
      "backgroundColor": "#f3e8ff",
      "borderColor": "#7e22ce"
    },
    "superHardTitle": {
      "color": "#581c87"
    },
    "superHardDesc": {
      "color": "#6b21a8"
    },
    "hard": {
      "backgroundColor": "#fecaca",
      "borderColor": "#b91c1c"
    },
    "hardTitle": {
      "color": "#7f1d1d"
    },
    "hardDesc": {
      "color": "#991b1b"
    },
    "medium": {
      "backgroundColor": "#fed7aa",
      "borderColor": "#c2410c"
    },
    "mediumTitle": {
      "color": "#7c2d12"
    },
    "mediumDesc": {
      "color": "#9a3412"
    },
    "easy": {
      "backgroundColor": "#fef08a",
      "borderColor": "#a16207"
    },
    "easyTitle": {
      "color": "#713f12"
    },
    "easyDesc": {
      "color": "#854d0e"
    },
    "desc": {
      "marginTop": 4,
      "fontSize": 14,
      "lineHeight": 20
    }
  },
  "bottomNav":{
  "navContainer": {
    "flexDirection": "row",
    "height": 65,
    "backgroundColor": "#ffffff",
    "borderTopWidth": 1,
    "borderTopColor": "#e5e5e5",
    "paddingTop": 8,
    "justifyContent": "space-around",
    "alignItems": "center",
    "position": "absolute",
    "bottom": 0,
    "left": 0,
    "right": 0,
    "zIndex": 10
  },
  "navItem": {
    "alignItems": "center",
    "justifyContent": "center"
  },
  "navLabel": {
    "fontSize": 11,
    "marginTop": 3
  }
},
"questionFilter":{
  "circleBase": {
    "width": 36,
    "height": 36,
    "borderRadius": 18,
    "borderWidth": 1,
    "alignItems": "center",
    "justifyContent": "center"
  },
  "blockBase": {
    "minWidth": 64,
    "paddingVertical": 10,
    "paddingHorizontal": 8,
    "borderRadius": 12,
    "borderWidth": 1,
    "alignItems": "center",
    "justifyContent": "center",
    "maxWidth": 500,
    "marginTop": 8,
    "marginBottom": 8
  },
  "disabled": {
    "opacity": 0.5
  }
},
"quizSetup":{
  "sartButton": { 
    "width": "80%",
    "backgroundColor":"#f3e8ff"
  },
  "quizLength":{
    "borderColor": "black"
  }


},
"text":{
  "white": {
    "color":"#ffffff"
  }
}, 
modeOption: {
  container: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  defaultBorder: {
    borderColor: theme.colors.border, 
  },
  pressedBorder: {
    borderColor: theme.colors.primary, 
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#FFFFFF",
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 4,
    color: "#FFFFFF",
  },
},
recall: {
  screen: { flex: 1, backgroundColor: "#ffffff" },
  content: { padding: 16, paddingBottom: 48, gap: 16 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 12 },
  header: { gap: 4 },
  title: { fontSize: 28, fontWeight: "800", color: "#0f172a" },
  subtitle: { fontSize: 15, color: "#64748b" },
  progressText: { fontSize: 13, fontWeight: "600", color: "#1e3a8a" },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: "#f1f5f9", overflow: "hidden" },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: "#1e3a8a" },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#e2e8f0", backgroundColor: "#f8fafc", gap: 8 },
  label: { fontSize: 12, fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5 },
  questionText: { fontSize: 20, fontWeight: "700", color: "#0f172a", lineHeight: 28 },
  answerArea: { minHeight: 72, padding: 12, borderRadius: 16, borderWidth: 2, borderStyle: "dashed", borderColor: "#cbd5e1", backgroundColor: "#ffffff", flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  answerAreaCorrect: { borderStyle: "solid", borderColor: "#10b981", backgroundColor: "#ecfdf5" },
  answerAreaIncorrect: { borderStyle: "solid", borderColor: "#e11d48", backgroundColor: "#fff1f2" },
  placeholder: { fontSize: 14, color: "#94a3b8" },
  wordBank: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  block: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: "#cbd5e1", backgroundColor: "#ffffff", shadowColor: "#000000", shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  blockSelected: { borderColor: "#1e3a8a", backgroundColor: "#eff6ff" },
  blockUsed: { opacity: 0.25 },
  blockCorrect: { borderColor: "#10b981", backgroundColor: "#d1fae5" },
  blockIncorrect: { borderColor: "#e11d48", backgroundColor: "#ffe4e6" },
  blockText: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  actions: { flexDirection: "row", gap: 12 },
  button: { flex: 1, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#1e3a8a" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
  secondaryButton: { flex: 1, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#cbd5e1", backgroundColor: "#ffffff" },
  secondaryButtonText: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  feedback: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 16, borderWidth: 1 },
  feedbackCorrect: { backgroundColor: "#ecfdf5", borderColor: "#10b981" },
  feedbackIncorrect: { backgroundColor: "#fff1f2", borderColor: "#e11d48" },
  feedbackIconCorrect: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#10b981" },
  feedbackIconIncorrect: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#e11d48" },
  feedbackText: { flex: 1, gap: 4 },
  feedbackTitleCorrect: { fontSize: 18, fontWeight: "800", color: "#047857" },
  feedbackTitleIncorrect: { fontSize: 18, fontWeight: "800", color: "#be123c" },
  feedbackMessage: { fontSize: 14, color: "#334155" },
  feedbackAnswer: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  scoreCard: { padding: 24, borderRadius: 20, alignItems: "center", gap: 4, backgroundColor: "#1e3a8a" },
  scorePercent: { fontSize: 48, fontWeight: "800", color: "#ffffff" },
  scoreText: { fontSize: 16, fontWeight: "600", color: "#dbeafe" },
  reviewItem: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 8 },
  reviewItemCorrect: { borderColor: "#10b981", backgroundColor: "#ecfdf5" },
  reviewItemIncorrect: { borderColor: "#e11d48", backgroundColor: "#fff1f2" },
  reviewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  reviewIndex: { fontSize: 13, fontWeight: "700", color: "#64748b" },
  badgeCorrect: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#10b981" },
  badgeIncorrect: { flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: "#e11d48" },
  badgeText: { fontSize: 12, fontWeight: "700", color: "#ffffff" },
  reviewQuestion: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  reviewLabel: { fontSize: 12, fontWeight: "700", color: "#64748b" },
  reviewAnswerCorrect: { fontSize: 15, color: "#047857" },
  reviewAnswerIncorrect: { fontSize: 15, color: "#be123c", textDecorationLine: "line-through" },
  reviewAnswer: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  iconCorrect: { color: "#ffffff" },
  iconIncorrect: { color: "#ffffff" },
} satisfies StyleClass
}






