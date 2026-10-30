import content from '@/lib/content'
import type { Content } from '@/lib/content/types'
import { useCallback, useMemo, useState } from 'react'

type Language = keyof typeof LANGUAGES

const LANGUAGES = {
  en: 'English',
  sp: 'Spanish',
} as const

interface UseLanguageOptions {
  keyName?: keyof Content;
}

interface UseLanguageReturn {

  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  language: Language;
}

export function useLanguage ({ keyName }: UseLanguageOptions): UseLanguageReturn {
  const [language, setLanguage] = useState<Language>('en')

  const setLanguageValue = useCallback(
    (nextLanguage: React.SetStateAction<Language>) => {
      setLanguage(nextLanguage)
    },
    []
  )

  return useMemo(
    () => ({

      setLanguage: setLanguageValue,
      language,
    }),
    [language, setLanguageValue]
  )
}
