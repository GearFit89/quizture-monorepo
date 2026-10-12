import { useContext, useMemo } from 'react'
import type { Content } from '@/lib/content/types'
import { ContentContext } from '@/context'
import contentJson from '@/lib/content'
import { useState } from 'react'
export interface ContentContextValue {
  content: Content;
}

export function useContent<T = Content> (
  selector?: (data: Content) => T
): T {
  const [content, setContent] = useState(contentJson)

  return useMemo(
    () => (selector ? selector(content) : (content as T)),
    [content, selector]
  )
}

export function useSetupContent () {
  return useContent((c) => c.setup)
}

export function useQuizContent () {
  return useContent((c) => c.quiz)
}

export function usePracticeContent () {
  return useContent((c) => c.practicePage)
}

export function useProfileMockContent () {
  return useContent((c) => c.profileMock)
}

export function useSettingsMockContent () {
  return useContent((c) => c.settingsMock)
}
