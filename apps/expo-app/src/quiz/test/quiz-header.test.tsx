import React from 'react';
import { expect, it, vi } from 'vitest';
import content from '../../lib/content/content.json';
import { stylesContent } from '../../lib/styles/content';
vi.mock('@/hooks', () => ({
  useQuiz: () => ({ getSnapshot: () => ({ context: {
    incomingQuesions: [{}, {}], completedQuestions: [{}], activeUser: 'solo', score: { solo: { points: 20 }, other: { points: 5 } },
  } }) }),
  useQuizContent: () => content.quiz,
  useStyleTarget: () => ({ styles: stylesContent.quiz }),
}));
vi.mock('@xstate/react', () => ({ useSelector: (actor: any, selector: any) => selector(actor.getSnapshot()) }));
vi.mock('react-native', () => ({ View: 'view' }));
vi.mock('@/components/ui/text', () => ({ Text: 'text' }));
import { ProgressBar } from '../progress-bar';
import { PointsDisplay } from '../points-display';
function nodes(node: any): any[] { return node && typeof node === 'object' ? [node, ...React.Children.toArray(node.props?.children).flatMap(nodes)] : []; }
it('reads question progress directly from the quiz actor and preserves custom color', () => {
  const elements = nodes(ProgressBar({ color: '#123456' }));
  expect(elements.some((node) => node.props.children === 'Question 2 of 3')).toBe(true);
  expect(elements.find((node) => node.props.accessibilityRole === 'progressbar').props.accessibilityValue).toEqual({ min: 0, max: 3, now: 2 });
  expect(elements.some((node) => Array.isArray(node.props.style) && node.props.style.some((style: any) => style.backgroundColor === '#123456'))).toBe(true);
});
it('selects current user points without score props', () => {
  expect(PointsDisplay().props.children).toBe('Points: 20');
  expect(PointsDisplay({ userId: 'other' }).props.children).toBe('Points: 5');
});
