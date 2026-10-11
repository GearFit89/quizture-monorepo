import { useQuery } from "@tanstack/react-query";
import { Question } from "@bq/shared/types";
import { multiQuestionFilter } from "@bq/shared/services/filter.service";
import { useMemo } from "react";
import type { AppFilterCriteria } from "@bq/shared/types";
import { storage } from "@/lib/storage";

// Dynamic import function - fetches/loads the mock JSON on demand
async function fetchQuestions(): Promise<Question[]> {
  const module = await import("@bq/shared/mock-data/questions.json");
 const questionArray = Object.entries(module.default).map(([key, value]) => ({
  id: key,
  type: 'question' as const,
  ...value,
}));
  return questionArray as unknown as  Question[];
}

export function useQuestions() {
  return useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    staleTime: Infinity, // Static mock data never goes stale during session
    gcTime: 1000 * 60 * 60 * 24, // Keeps query cached for 24 hours
  });
}


export function useFilteredQuestions ({ filterCriteria }: { filterCriteria: AppFilterCriteria}) {
  const { data,  ...rest} = useQuestions()

  const questions = useMemo(()=>{
      
          if(!data) return [];
          if(!filterCriteria) return data;
          const filtered = multiQuestionFilter(data, filterCriteria, true);
          console.debug("filtered: ", filtered)
          storage.setJSON("filteredQuestions", filtered)


          return filtered;

      }, [data, filterCriteria])

      return {
        
        questions,
        ...rest
      }
}