/** Distinct IDs preserve repeated words; callers reset the selection per question. */
export function createAnswerBlocks(answer: string, random = Math.random) {
  const blocks = answer.trim().split(/\s+/).filter(Boolean).map((data, index) => ({ id: String(index), data }));
  for (let i = blocks.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  }
  return blocks;
}
