import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import content from '../../lib/content/content.json';

vi.mock('react', async (importOriginal) => ({ ...await importOriginal<typeof import('react')>(), useEffect: () => {}, useState: (initial: unknown) => [initial, () => {}] }));

vi.mock('@/hooks', () => ({ useQuiz: () => ({ getSnapshot: () => ({ context: { difficulty: mode } }) }), useQuestionActor: () => actor, useQuizContent: () => content.quiz, useStyleTarget: () => ({ styles: {} }) }));
vi.mock('@xstate/react', () => ({ useSelector: (actor: any, selector: any) => selector(actor.getSnapshot()) }));
vi.mock('react-native', () => ({
  Pressable: 'pressable',
  View: ({ children }: any) => <div>{children}</div>,
  TextInput: ({ accessibilityLabel, placeholder, value }: any) => <textarea aria-label={accessibilityLabel} placeholder={placeholder} defaultValue={value} />,
}));
vi.mock('@/components/ui/text', () => ({ Text: ({ children }: any) => <span>{children}</span> }));
vi.mock('@/components/ui/button', () => ({ Button: ({ children, disabled }: any) => <button disabled={disabled}>{children}</button> }));
vi.mock('@/components/mulit-blocks', () => ({ Blocks: () => <div data-input="blocks" /> }));
vi.mock('@/components/icon', () => ({ default: 'icon' }));
import { QuestionSection } from '../question-section';
import { QuizTimer } from '../quiz-timer';

let mode = 'hard';
beforeEach(() => { mode = 'hard'; });
const actor = {
  getSnapshot: () => ({
    context: { question: { head: 'Quote', body: 'Who spoke?', answer: 'Jesus' }, activeUser: 'solo' },
    matches: (state: any) => typeof state === 'object' && state.WaitingForInput === 'Waiting',
  }),
};

function elements(node: any): any[] {
  if (!node || typeof node !== 'object') return [];
  const children = React.Children.toArray(node.props?.children);
  return [node, ...children.flatMap(elements)];
}
function text(node: any): string {
  if (typeof node === 'string') return node;
  if (!node || typeof node !== 'object') return '';
  return React.Children.toArray(node.props?.children).map(text).join('');
}

describe('question input UI', () => {
  it('renders the machine header, prefix, body and hard-mode input', () => {
    const tree = QuestionSection();
    expect(text(tree)).toContain('Quote');
    expect(text(tree)).toContain('Question: Who spoke?');
    const nodes = elements(tree);
    expect(nodes.some((node) => node.props.accessibilityLabel === content.quiz.answerLabel)).toBe(true);
    expect(nodes.some((node) => node.props.disabled === true)).toBe(true);
    expect(text(tree)).toContain(content.quiz.submit);
    expect(text(tree)).toContain(content.quiz.microphoneLabel);
    expect(nodes.some((node) => node.props.accessibilityState?.disabled === true)).toBe(true);
  });
  it('renders block input for easy mode', () => {
    mode = 'easy';
    const nodes = elements(QuestionSection());
    expect(nodes.some((node) => typeof node.props.onChange === 'function')).toBe(true);
    expect(nodes.some((node) => node.props.accessibilityLabel === content.quiz.answerLabel)).toBe(false);
  });
});


it('renders a timer preview without starting a countdown', () => {
  const tree = QuizTimer();
  expect(tree.props.accessibilityLabel).toBe(content.quiz.timerLabel);
  expect(text(tree)).toBe(content.quiz.timerPlaceholder);
});
