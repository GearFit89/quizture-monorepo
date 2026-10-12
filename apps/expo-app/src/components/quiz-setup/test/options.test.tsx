import { beforeEach, expect, it, vi } from 'vitest';
import content from '../../../lib/content/content.json';
import { stylesContent } from '../../../lib/styles/content';
const state = vi.hoisted(() => ({ data: { difficultyLevel: 'easy', mode: 'normal' }, setDifficulty: vi.fn(), setMode: vi.fn() }));
vi.mock('@/hooks', () => ({ useQuizSetup: () => state, useSetupContent: () => content.setup, useStyleTarget: (key: keyof typeof stylesContent) => ({ styles: stylesContent[key] }) }));
vi.mock('@/hooks/quiz-setup.hook', () => ({ useQuizSetup: () => state }));
vi.mock('react-native', () => ({ Pressable: 'pressable', View: 'view' }));
vi.mock('@/components/ui/text', () => ({ Text: 'text' }));
vi.mock('@/components/icon', () => ({ default: 'icon' }));
import { DifficultyOption } from '../difficulty-option';
import ModeOption from '../mode-option';
beforeEach(() => { vi.clearAllMocks(); state.data = { difficultyLevel: 'easy', mode: 'normal' }; });
it('lets difficulty options select without a custom callback', () => {
  const element = DifficultyOption({ value: 'hard' })! as any;
  expect(element.props.disabled).not.toBe(true);
  expect(element.props.accessibilityState.selected).toBe(false);
  element.props.onPress();
  expect(state.setDifficulty).toHaveBeenCalledWith('hard');
});
it('renders localized difficulty descriptions and the selected border', () => {
  const element = DifficultyOption({ value: 'easy' })! as any;
  expect(element.props.accessibilityState.selected).toBe(true);
  const card = element.props.children;
  expect(card.props.style).toContain(stylesContent.difficultyOption.selected);
  expect(card.props.children[1].props.children).toBe(content.setup.difficultyOptions.easy.description);
});
it('reflects mode selection from setup state rather than independent click toggles', () => {
  const normal = () => ModeOption({ value: 'normal', title: 'Normal', icon: 'bookmark' }) as any;
  const timed = () => ModeOption({ value: 'timed', title: 'Timed', icon: 'timer' }) as any;
  expect(normal().props.accessibilityState.selected).toBe(true);
  timed().props.onPress();
  expect(state.setMode).toHaveBeenCalledWith('timed');
  state.data.mode = 'timed';
  expect(normal().props.accessibilityState.selected).toBe(false);
  expect(timed().props.style).toContain(stylesContent.modeOption.pressedBorder);
});
