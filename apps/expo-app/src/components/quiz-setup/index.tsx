import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { DifficultyLevel, QuizMode } from '@bq/shared/types'
import { View } from 'lucide-react-native'
import { IconKey } from '@/lib/icons'
import { createContext } from 'react'
import DifficultyOption from './difficulty-option'
import ModeOption from './mode-option'
import DefaultQuizFilters from '../question-filters/default-quiz-filters'
import { QuizSetupProvider } from '@/providers/quiz-setup.provider'

export {

  DefaultQuizFilters as DefaultSetupFilters,
  ModeOption as SetupModeOption,
  DifficultyOption as SetupDifficultyOption,
  QuizSetupProvider

}
