import { useState, useCallback, useMemo, useContext } from 'react';
import { BlocksContext } from '@/context';
interface BlockStateProps {
  data: Record<string, Block<string>>;

  // The initial state of the blocks, which is an array of block IDs that should be in the bottom position.
  initial: Block<string>[];
}
export function useBlocksState({ data, initial }: BlockStateProps) {
  const [blocksState, setBlocksState] = useState<BlocksState>({
    top: [],
    bottom: initial,
    
  });

  const toggleBlock = useCallback(
    (block: Block<string>, currentPosition: 'top' | 'bottom') => {
      setBlocksState((prevState) => {
       
        return currentPosition === 'top'
          ? {
              ...prevState,
              top: prevState.top.filter((b) => b.id !== block.id),
              bottom: [...prevState.bottom, block],
            }
          : {
              ...prevState,
              top: [...prevState.top, block],
              bottom: prevState.bottom.filter((b) => b.id !== block.id),
            };
      });
    },
    [],
  );

  return useMemo(
    () => ({
      blocksState,
      toggleBlock,
      setBlocksState
    }),
    [blocksState, toggleBlock],
  );
}
export interface Block<T> {
  id: string;
  data: T;
}
export interface BlocksState {
  top: Block<string>[];
  bottom: Block<string>[];

 
}

export interface BlocksContextValue {
  blocksState: BlocksState;
  toggleBlock: (block: Block<string>, currentPosition: 'top' | 'bottom') => void;
  setBlocksState: React.Dispatch<React.SetStateAction<BlocksState>>;
}

export  function useBlocks() {
  
 const context = useContext(BlocksContext);
    if (!context) {
      throw new Error('useBlocks must be used within a BlockProvider');
    }
    return context;
  
}