import { RootActorContext } from '@/context'

export function RootActorProvider ({ children }: { children: React.ReactNode }) {
  return (
    <RootActorContext.Provider>
      {children}
    </RootActorContext.Provider>
  )
}
