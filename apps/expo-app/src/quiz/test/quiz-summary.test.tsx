import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import content from '../../lib/content/content.json';
const mocks = vi.hoisted(() => ({ send: vi.fn(), back: vi.fn(), replace: vi.fn(), canGoBack: vi.fn() }));
const context = { activeUser: 'solo', score: { solo: { points: 20 } }, incomingQuesions: [], completedQuestions: [{ state: 'correct', owner: 'solo' }] };
vi.mock('@/hooks', () => ({ useQuiz: () => ({ send: mocks.send, getSnapshot: () => ({ context }) }), useQuizContent: () => content.quiz, useStyleTarget: () => ({ styles: {} }) }));
vi.mock('@xstate/react', () => ({ useSelector: (actor: any, selector: any) => selector(actor.getSnapshot()) }));
vi.mock('expo-router', () => ({ useRouter: () => mocks }));
vi.mock('react-native', () => ({ View: 'view' }));
vi.mock('@/components/ui/text', () => ({ Text: 'text' }));
vi.mock('@/components/ui/button', () => ({ Button: 'button' }));
import { QuizSummary } from '../quiz-summary';
function nodes(node: any): any[] { return typeof node === 'object' && node ? [node, ...React.Children.toArray(node.props?.children).flatMap(nodes)] : []; }
beforeEach(() => vi.clearAllMocks());
it('selects summary stats and completes the quiz before returning', () => {
  mocks.canGoBack.mockReturnValue(true);
  const elements = nodes(QuizSummary({}));
  expect(elements.some((element) => element.props.children === 'Total score: 20')).toBe(true);
  elements.find((element) => element.type === 'button').props.onPress();
  expect(mocks.send).toHaveBeenCalledWith({ type: 'COMPLETE' });
  expect(mocks.back).toHaveBeenCalledOnce();
  expect(mocks.send.mock.invocationCallOrder[0]).toBeLessThan(mocks.back.mock.invocationCallOrder[0]);
});
it('returns to home when there is no previous route', () => {
  mocks.canGoBack.mockReturnValue(false);
  nodes(QuizSummary({})).find((element) => element.type === 'button').props.onPress();
  expect(mocks.send).toHaveBeenCalledWith({ type: 'COMPLETE' });
  expect(mocks.replace).toHaveBeenCalledWith('/');
});
