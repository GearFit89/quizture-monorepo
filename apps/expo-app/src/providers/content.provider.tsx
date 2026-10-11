import { useMemo } from 'react'
import { useContent, useLanguage } from '@/hooks'
import { ContentContext } from '@/context'

export function ContentProvider ({ children }: { children: React.ReactNode }) {
  // Pull language-specific content from the hook
  // const { content } = useContent()

  // const value = useMemo(() => ({ content }), [content]);

  return (
    <ContentContext.Provider value={{} as any}>
      {children}
    </ContentContext.Provider>
  )
}
