import React from 'react';
import { beforeEach, expect, it, vi } from 'vitest';
import content from '../../../lib/content/content.json';
import { stylesContent } from '../../../lib/styles/content';

const state = vi.hoisted(() => ({ mode: 'SOLO', width: 1280, push: vi.fn() }));
vi.mock('react', async (importOriginal) => ({
  ...await importOriginal<typeof import('react')>(),
  useState: () => [state.mode, (mode: string) => { state.mode = mode; }],
}));
vi.mock('react-native', () => ({
  View: 'view', Pressable: 'pressable', ScrollView: 'scroll',
  useWindowDimensions: () => ({ width: state.width }),
}));
vi.mock('expo-router', () => ({ useRouter: () => ({ push: state.push }) }));
vi.mock('lucide-react-native', () => ({ User: 'user', Users: 'users' }));
vi.mock('@/components/ui/lucide-icon', () => ({ Icon: 'icon' }));
vi.mock('@/components/icon', () => ({ default: 'icon' }));
vi.mock('@/components/ui/button', () => ({ Button: 'button' }));
vi.mock('@/components/ui/text', () => ({ Text: 'text' }));
vi.mock('@/lib/quiz-registry', () => ({ QUIZ_REGISTRY: { 'SOLO-1': {} } }));
vi.mock('@/hooks', () => ({
  usePracticeContent: () => content.practicePage,
  useStyleTarget: () => ({ styles: stylesContent.practice }),
}));
import PracticePage from '../../../app/(tabs)/practice';

function nodes(node: any): any[] {
  return node && typeof node === 'object' ? [node, ...React.Children.toArray(node.props?.children).flatMap(nodes)] : [];
}
function text(node: any): string {
  if (typeof node === 'string') return node;
  return node && typeof node === 'object' ? React.Children.toArray(node.props?.children).map(text).join('') : '';
}
beforeEach(() => { state.mode = 'SOLO'; state.width = 1280; state.push.mockClear(); });

it('opens the registered solo quiz setup', () => {
  const button = nodes(PracticePage()).find((node) => node.type === 'button' && text(node) === content.practicePage.startQuiz);
  expect(button.props.disabled).toBe(false);
  button.props.onPress();
  expect(state.push).toHaveBeenCalledWith('/setup/SOLO-1');
});
it('switches modes and marks the unavailable VS quiz as coming soon', () => {
  const tab = nodes(PracticePage()).find((node) => node.props.accessibilityRole === 'tab' && text(node) === content.practicePage.vsLabel);
  tab.props.onPress();
  const tree = PracticePage();
  expect(text(tree)).toContain(content.practicePage.quizCards['VS-1'].title);
  expect(text(tree)).not.toContain(content.practicePage.quizCards['SOLO-1'].title);
  expect(nodes(tree).find((node) => node.type === 'button' && text(node) === content.practicePage.comingSoon).props.disabled).toBe(true);
  expect(nodes(tree).find((node) => node.props.accessibilityRole === 'tab' && text(node) === content.practicePage.vsLabel).props.accessibilityState.selected).toBe(true);
  expect(state.push).not.toHaveBeenCalled();
});
it('keeps settings accessible and presents study tools without dead buttons', () => {
  const tree = PracticePage();
  nodes(tree).find((node) => node.props.accessibilityLabel === content.practicePage.settingsLabel).props.onPress();
  expect(state.push).toHaveBeenCalledWith('/settings');
  expect(text(tree)).toContain(content.practicePage.flashCardButton.description);
  expect(text(tree)).toContain(content.practicePage.contentButton.description);
  expect(nodes(tree).filter((node) => node.type === 'button')).toHaveLength(2);
});
it('uses a stacked layout at phone widths and columns on desktop', () => {
  const desktop = nodes(PracticePage());
  expect(desktop.some((node) => node.props.style?.includes?.(stylesContent.practice.bodySmall))).toBe(false);
  state.width = 390;
  expect(nodes(PracticePage()).some((node) => node.props.style?.includes?.(stylesContent.practice.bodySmall))).toBe(true);
});
