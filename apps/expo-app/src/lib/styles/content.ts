import { theme } from '../theme';
import { AnyStyle } from './types';

export const stylesContent = {
  quiz: {
    questionCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, gap: 28, minHeight: 260 },
    answerCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, gap: 24 },
    selectedBlocks: { backgroundColor: '#e3f9f3', borderWidth: 2, borderStyle: 'dashed', borderColor: '#94ada6', borderRadius: 12, padding: 18, minHeight: 130 },
    availableBlocks: { backgroundColor: '#edf0f2', borderWidth: 2, borderStyle: 'dashed', borderColor: '#b8c2ca', borderRadius: 12, padding: 18 },
    timerRing: { alignSelf: 'center', width: 80, height: 80, borderRadius: 40, borderWidth: 9, borderColor: '#348ee5', alignItems: 'center', justifyContent: 'center', shadowColor: '#000000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
    timerValue: { fontSize: 26, fontWeight: '700', color: '#1e293b' },
    microphoneButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 2, borderColor: '#8000ff', borderRadius: 24, paddingVertical: 10, marginTop: 8 },
    microphoneText: { color: '#8000ff', fontSize: 14, fontWeight: '700' },
    questionSection: { gap: 20, flexGrow: 1 },
    questionBadge: {
      backgroundColor: '#ede9fe',
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      alignSelf: 'center',
    },
    questionBadgeText: { color: '#a000a0', fontSize: 20, fontWeight: '600' },
    questionPrefix: { fontWeight: '600' },
    answerInput: {
      borderWidth: 1,
      borderColor: '#94a3b8',
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      minHeight: 100,
      textAlignVertical: 'top',
    },
    answerControls: { gap: 16 },
    blockRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, minHeight: 48 },
    block: { paddingHorizontal: 12, backgroundColor: ' #bfbbbb0a' },
    submitButton: { marginTop: 'auto' },
    summary: { gap: 16, paddingVertical: 24 },
    summaryTitle: { fontSize: 28, fontWeight: '700' },
    container: {
      flex: 1,
      width: '100%',
      maxWidth: 960,
      alignSelf: 'center',
      padding: 20,
      gap: 24,
    },
    header: { gap: 12 },
    question: { flexGrow: 1, gap: 12, paddingVertical: 24 },
    questionHead: { fontSize: 20, fontWeight: '600' },
    questionBody: { fontSize: 24, lineHeight: 34, textAlign: 'center' },
    controls: { width: '100%', gap: 12, paddingBottom: 16 },
    points: { fontSize: 18, fontWeight: '600' },
    progress: { gap: 12 },
    progressLabel: { fontSize: 16, fontWeight: '600' },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    progressRail: {
      flex: 1,
      marginHorizontal: 16,
      height: 32,
      justifyContent: 'center',
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: '#dbeafe',
      overflow: 'hidden',
    },
    progressFill: { height: '100%', borderRadius: 4 },
    progressNode: {
      position: 'absolute',
      top: 0,
      marginLeft: -16,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    progressNodeText: { color: '#ffffff', fontWeight: '600', fontSize: 12 },
    progressTotal: { fontSize: 16, fontWeight: '600' },
    page: { flex: 1, backgroundColor: '#eef1f5' },
  },
  home: {
    title: {
      width: 23,
    },
    name: {
      width: 899,
    },
  },
  page: {
    read: {
      height: 89,
    },
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
  bottomNav: {
    navContainer: {
      flexDirection: 'row',
      height: 65,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e5e5e5',
      paddingTop: 8,
      justifyContent: 'space-around',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    navLabel: {
      fontSize: 11,
      marginTop: 3,
    },
  },
  questionFilter: {
    circleBase: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    blockBase: {
      minWidth: 64,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: 500,
      marginTop: 8,
      marginBottom: 8,
    },
    disabled: {
      opacity: 0.5,
    },
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
  text: {
    white: {
      color: '#ffffff',
    },
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
} satisfies Record<string, Record<string, AnyStyle>>;
