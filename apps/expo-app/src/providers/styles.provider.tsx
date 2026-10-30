import { useStylesState } from '@/hooks'
import type { StyleContent } from '@/lib/styles'
import { stylesContent } from '@/lib/styles/content'
import { StyleContext } from '@/context'
interface StylesProviderProps {
  children: React.ReactNode;

}
export type StylesT = typeof stylesContent
type e = keyof StylesT
type r = StylesT[e]
const s: e = 'page'

export function StylesProvider ({
  children
}: StylesProviderProps) {
  const styleState = useStylesState(stylesContent as StyleContent)

  return (
    <StyleContext.Provider value={styleState}>

      {children}

    </StyleContext.Provider>
  )
}
