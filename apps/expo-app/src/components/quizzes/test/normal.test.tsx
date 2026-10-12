import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';

let summary = false;
vi.mock('@/hooks', () => ({
  useQuiz: () => ({ getSnapshot: () => ({ matches: () => summary }) }),
  useStyleTarget: () => ({ styles: {} }),
}));
vi.mock('@xstate/react', () => ({ useSelector: (actor: any, selector: any) => selector(actor.getSnapshot()) }));
vi.mock('react-native', () => ({ ScrollView: 'scroll-view', View: 'view' }));
vi.mock('../../quiz', () => ({ ProgressBar: 'progress', PointsDisplay: 'points', QuizSummary: 'summary' }));
vi.mock('../../questions/normal', () => ({ NormalQuestion: 'question' }));
vi.mock('@/components/setups/standard', () => ({ default: 'setup' }));
import { NormalQuiz } from '../normal';
import { QuizContainer } from '../quiz-container';
import { QUIZ_REGISTRY } from '@/lib/quiz-registry';

beforeEach(() => { summary = false; });
it('passes the active question into the shared container', () => {
  const controls = <button />;
  const tree = NormalQuiz({ controls });
  expect(tree.type).toBe(QuizContainer);
  expect(tree.props.children.type).toBe('question');
  expect(tree.props.controls).toBe(controls);
});
it('passes the summary into the container and hides answer controls', () => {
  summary = true;
  const tree = NormalQuiz({ userId: 'solo', controls: <button /> });
  expect(tree.props.children.type).toBe('summary');
  expect(tree.props.children.props.userId).toBe('solo');
  expect(tree.props.controls).toBe(false);
});
it('renders supplied children in the layout', () => {
  const child = <span />;
  const tree = QuizContainer({ children: child });
  const sections = React.Children.toArray(tree.props.children) as React.ReactElement<{ children: React.ReactNode }>[];
  expect(sections[1].props.children).toBe(child);
});
it('registers the composed normal quiz as SOLO-1', () => {
  expect(QUIZ_REGISTRY['SOLO-1'].Quiz).toBe(NormalQuiz);
  expect(QUIZ_REGISTRY['SOLO-1'].actorId).toBe('solo.normalQuiz');
});
