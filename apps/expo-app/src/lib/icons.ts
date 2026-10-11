import {
  // Navigation
  Mic,
  Home,
  BookOpen,
  Trophy,
  User,
  Settings,
  // Quizzing & Study
  Book,
  Bookmark,
  Flame,
  Clock,
  Award,
  Volume2,
  Search,
  HelpCircle,
  // Actions & UI
  PlayCircle,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Plus,
  Trash2,
  RefreshCw,
  Bell,
  Share2,
  Lock,
  LogOut,
  Filter,
  UserCircle2,
} from 'lucide-react-native'

export const Icons = {
  microphone: Mic,
  // Navigation
  home: Home,
  study: BookOpen,
  quiz: Trophy,
  profile: User,
  settings: Settings,
  playCircle: PlayCircle,

  // Quizzing & Study
  bible: Book,
  bookmark: Bookmark,
  streak: Flame,
  timer: Clock,
  award: Award,
  audio: Volume2,
  search: Search,
  help: HelpCircle,

  // Actions & UI
  chevronRight: ChevronRight,
  chevronLeft: ChevronLeft,
  check: Check,
  close: X,
  plus: Plus,
  trash: Trash2,
  refresh: RefreshCw,
  bell: Bell,
  share: Share2,
  lock: Lock,
  logout: LogOut,
  filter: Filter,
}

// TODO: make an actual icon library
export type IconKey = keyof typeof Icons
