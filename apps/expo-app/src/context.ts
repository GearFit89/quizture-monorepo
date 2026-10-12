import type {
  StylesState,
  QuizSetupState,
  BlocksContextValue,
  ContentContextValue,
} from './hooks';
import { createContext } from 'react';
import type { QuizActorRef } from "@bq/shared/types/machine"
import { createActorContext } from '@xstate/react';
import { rootMachine } from '@bq/shared/machines';

import type { AnyActorRef } from 'xstate';

export const QuizSetupContext = createContext<QuizSetupState<any> | null>(null);

export const StyleContext = createContext<StylesState | null>(null);

export const ContentContext = createContext<ContentContextValue | null>(null);

export const BlocksContext = createContext<BlocksContextValue | null>(null);

export const RootActorContext = createActorContext(rootMachine);

export const QuizActorContext = createContext<QuizActorRef | null>(null);
