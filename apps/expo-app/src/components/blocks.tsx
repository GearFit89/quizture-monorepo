import { type Block as BlockData, useBlocks, useStyleTarget } from '@/hooks';
import { Button } from './ui/button';
import { Text } from './ui/text';
import { View } from 'react-native';

interface BlockProps<T> {
  onSelect: (blockId: string, blockData: string) => void;
  block: BlockData<T>;
  postion: 'top' | 'bottom';
}

export function Block<T>({ block, postion, onSelect }: BlockProps<string>) {
  const { toggleBlock } = useBlocks();
  const { styles } = useStyleTarget('quiz');
  const handlePress = () => {
    onSelect(block.id, block.data);
    toggleBlock(block, postion);
  };

  return (
    <Button
      variant={'outline'}
      style={{
        ...styles.block,

        borderRadius: 10,
      }}
      onPress={handlePress}
    >
      <Text>{block.data}</Text>
    </Button>
  );
}

export function BottomBlocks({
  onSelect,
}: {
  onSelect: (blockId: string, blockData: string) => void;
}) {
  const { blocksState } = useBlocks();
  const { styles } = useStyleTarget('quiz');
  const { bottom } = blocksState;

  return (
    <View style={[styles.blockRow, styles.availableBlocks]}>
      {bottom.map((block) => (
        <Block
          key={block.id}
          onSelect={onSelect}
          postion="bottom"
          block={block}
        />
      ))}
    </View>
  );
}

export function TopBlocks({
  onSelect,
}: {
  onSelect: (blockId: string, blockData: string) => void;
}) {
  const { blocksState } = useBlocks();
  const { styles } = useStyleTarget('quiz');
  const { top } = blocksState;

  return (
    <View style={[styles.blockRow, styles.selectedBlocks]}>
      {top.map((block) => (
        <Block 
        key={block.id} 
        onSelect={onSelect} 
        postion="top" 
        block={block} 
        />
      ))}
    </View>
  );
}
