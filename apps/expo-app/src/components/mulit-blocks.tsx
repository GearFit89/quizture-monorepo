import { useSelector } from '@xstate/react';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useBlocks, useStyleTarget, useQuestionActor } from '@/hooks';
import { BlockProvider } from '@/providers/blocks.provider';
import { BottomBlocks, TopBlocks } from './blocks';
import { createAnswerBlocks } from '@/quiz/answer-blocks';

interface BlocksProps {
  onChange: (answer: string) => void;
}

function BlockSelection({ onChange }: Pick<BlocksProps, 'onChange'>) {
  const { blocksState } = useBlocks();
  const { styles } = useStyleTarget('quiz');
  useEffect(() => {
    onChange(blocksState.top.map((block) => block.data).join(' '));
  }, [blocksState.top, onChange]);
  return <View style={styles.answerControls}>
    <TopBlocks onSelect={() => {}} />
    <BottomBlocks onSelect={() => {}} />
  </View>;
}

export function Blocks({ onChange }: BlocksProps) {
  const actor = useQuestionActor()!;
  const answer = useSelector(actor, (snapshot) => snapshot.context.question.answer);
  const blocks = useMemo(() => createAnswerBlocks(answer), [answer]);
  const data = useMemo(() => Object.fromEntries(blocks.map((block) => [block.id, block])), [blocks]);
  return <BlockProvider data={data} initial={blocks.map((block) => block.id)}>
    <BlockSelection onChange={onChange} />
  </BlockProvider>;
}
