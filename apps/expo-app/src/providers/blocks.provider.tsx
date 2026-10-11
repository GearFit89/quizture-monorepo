import  { BlocksContext } from "../context";
import { useBlocksState, type Block } from "../hooks"

interface BlockProviderProps {
    children: React.ReactNode;
    data: Record<string, Block<string>>;
    initial: string[];
}
export function BlockProvider({ children, data, initial}: BlockProviderProps) {

    const blockState = useBlocksState({
        data,
        initial: initial.map((id) => data[id]).filter((block): block is Block<string> => Boolean(block))
    });

    return (
        <BlocksContext.Provider value={blockState}>
            {children}
        </BlocksContext.Provider>
    );
}