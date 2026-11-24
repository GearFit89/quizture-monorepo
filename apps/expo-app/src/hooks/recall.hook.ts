import { useCallback, useMemo, useState } from "react";
import type { AppQuestion, QuizQuestion } from "@bq/shared/types";
import { useContent } from "./content.hook";
import type { Content } from "@/lib/content/types";
import {
  buildRecallItems,
  isRecallCorrect,
  summarizeResults,
  type RandomFn,
  type RecallBlock,
  type RecallResult,
} from "@/lib/recall/recall";

export type RecallStatus = "answering" | "checked" | "review";

const selectRecall = (c: Content) => c.recall;

export function useRecallContent() {
  return useContent(selectRecall);
}

export function useRecallQuiz(
  quizQuestions: QuizQuestion[],
  questions: AppQuestion[],
  random: RandomFn = Math.random,
) {
  const [round, setRound] = useState(0);
  const items = useMemo(
    () => buildRecallItems(quizQuestions, questions, random),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [quizQuestions, questions, round],
  );
  const [index, setIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<RecallStatus>("answering");
  const [results, setResults] = useState<RecallResult[]>([]);

  const item = items[index];
  const blocksById = useMemo(
    () => new Map<string, RecallBlock>(item?.blocks.map((block) => [block.id, block]) ?? []),
    [item],
  );
  const selectedBlocks = useMemo(
    () => selectedIds.map((id) => blocksById.get(id)).filter((b): b is RecallBlock => Boolean(b)),
    [selectedIds, blocksById],
  );
  const currentResult = status === "checked" ? results[results.length - 1] : undefined;
  const isLast = index >= items.length - 1;

  const selectBlock = useCallback(
    (id: string) => {
      if (status !== "answering") return;
      setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    },
    [status],
  );

  const removeBlock = useCallback(
    (id: string) => {
      if (status !== "answering") return;
      setSelectedIds((prev) => prev.filter((selected) => selected !== id));
    },
    [status],
  );

  const clear = useCallback(() => {
    if (status === "answering") setSelectedIds([]);
  }, [status]);

  const submit = useCallback(() => {
    if (!item || status !== "answering" || selectedBlocks.length === 0) return;
    const selectedWords = selectedBlocks.map((block) => block.word);
    const correct = isRecallCorrect(selectedWords, item.answerWords);
    setResults((prev) => [
      ...prev,
      { item: { ...item, quizQuestion: { ...item.quizQuestion, correct } }, selectedWords, correct },
    ]);
    setStatus("checked");
  }, [item, selectedBlocks, status]);

  const next = useCallback(() => {
    if (status !== "checked") return;
    setSelectedIds([]);
    if (isLast) {
      setStatus("review");
      return;
    }
    setIndex((prev) => prev + 1);
    setStatus("answering");
  }, [isLast, status]);

  const restart = useCallback(() => {
    setRound((prev) => prev + 1);
    setIndex(0);
    setSelectedIds([]);
    setResults([]);
    setStatus("answering");
  }, []);

  const summary = useMemo(() => summarizeResults(results), [results]);

  return {
    items,
    item,
    index,
    total: items.length,
    status,
    isLast,
    selectedIds,
    selectedBlocks,
    currentResult,
    results,
    summary,
    selectBlock,
    removeBlock,
    clear,
    submit,
    next,
    restart,
  };
}

export type RecallQuizState = ReturnType<typeof useRecallQuiz>;
