import type {
  BibleKey,
  BookRange,
  Question,
  QuizQuestion,
  RefObject,
} from "./types";

export function shortenText(text: string, maxLength: number): string {
  const words = text.split(" ");
  if (words.length <= maxLength) return text;
  return words.slice(0, maxLength - 3) + "...";
}
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 *
 * @param items
 * @param criteria
 * @param shoulIncludeMissingKeys If the item is null or undefined it will be
 * added if this is true or not if not false.  It also uses loose equality
 * that also checks if null for each item
 * @returns
 */

export function multiFilter<T extends Record<string, any>>(
  items: T[],
  criteria: Partial<T>,
  shoulIncludeMissingKeys: boolean = false,
): T[] | undefined {
  if (!items || !criteria) return;
  return items.filter((item) => {
    return Object.keys(criteria).every((key) => {
      if (item[key] === undefined) {
        // If the key doesn't exist on the item skip it, based on the shouldInclude option
        return shoulIncludeMissingKeys;
      }
      if (Array.isArray(criteria[key])) {
        return criteria[key].includes(item[key]);
      }

      return item[key] === criteria[key];
    });
  });
}
//= ================================ BIBLE UTILS ======================================
/** This will shorten a book ofthe Bible to its common abbreviation

**/
const bookMap = new Map<string, string>([
  ["Genesis", "Gen"],
  ["Exodus", "Exod"],
  ["Leviticus", "Lev"],
  ["Numbers", "Num"],
  ["Deuteronomy", "Deut"],
  ["Joshua", "Josh"],
  ["Judges", "Judg"],
  ["Ruth", "Ruth"],
  ["1 Samuel", "1 Sam"],
  ["2 Samuel", "2 Sam"],
  ["1 Kings", "1 Kgs"],
  ["2 Kings", "2 Kgs"],
  ["1 Chronicles", "1 Chr"],
  ["2 Chronicles", "2 Chr"],
  ["Ezra", "Ezra"],
  ["Nehemiah", "Neh"],
  ["Esther", "Esth"],
  ["Job", "Job"],
  ["Psalms", "Ps"],
  ["Proverbs", "Prov"],
  ["Ecclesiastes", "Eccl"],
  ["Song of Solomon", "Song"],
  ["Isaiah", "Isa"],
  ["Jeremiah", "Jer"],
  ["Lamentations", "Lam"],
  ["Ezekiel", "Ezek"],
  ["Daniel", "Dan"],
  ["Hosea", "Hos"],
  ["Joel", "Joel"],
  ["Amos", "Amos"],
  ["Obadiah", "Obad"],
  ["Jonah", "Jonah"],
  ["Micah", "Mic"],
  ["Nahum", "Nah"],
  ["Habakkuk", "Hab"],
  ["Zephaniah", "Zeph"],
  ["Haggai", "Hag"],
  ["Zechariah", "Zech"],
  ["Malachi", "Mal"],
  ["Matthew", "Matt"],
  ["Mark", "Mark"],
  ["Luke", "Luke"],
  ["John", "John"],
  ["Acts", "Acts"],
  ["Romans", "Rom"],
  ["1 Corinthians", "1 Cor"],
  ["2 Corinthians", "2 Cor"],
  ["Galatians", "Gal"],
  ["Ephesians", "Eph"],
  ["Philippians", "Phil"],
  ["Colossians", "Col"],
  ["1 Thessalonians", "1 Thess"],
  ["2 Thessalonians", "2 Thess"],
  ["1 Timothy", "1 Tim"],
  ["2 Timothy", "2 Tim"],
  ["Titus", "Titus"],
  ["Philemon", "Phlm"],
  ["Hebrews", "Heb"],
  ["James", "Jas"],
  ["1 Peter", "1 Pet"],
  ["2 Peter", "2 Pet"],
  ["1 John", "1 John"],
  ["2 John", "2 John"],
  ["3 John", "3 John"],
  ["Jude", "Jude"],
  ["Revelation", "Rev"],
]);
export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** This will shorten a book ofthe Bible to its common abbreviation

**/
export function abbreviateBook(book: string): string {
  return (
    bookMap.get(book.at(0)?.toUpperCase() + book.toLowerCase().slice(1)) ?? book
  ); // Returns the abbreviation or the original string if not found
}

export const BIBLE_BOOKS = {
  Matthew: { chps: 28 },
  Mark: { chps: 16 },
  Luke: { chps: 24 },
  John: { chps: 21 },
};

export const getChapters = (bookName: BibleKey): number[] =>
  Array.from({ length: BIBLE_BOOKS[bookName].chps ?? 0 }).map((_, i) => i + 1);

export const getBookRange = Object.keys(BIBLE_BOOKS).reduce<BookRange>(
  (acc, b): BookRange => {
    const bibleKey = b as BibleKey;
    acc[bibleKey] = getChapters(bibleKey).map(String);
    return acc;
  },

  {},
);

export function extractRefObject(ref: string): RefObject {
  // Matches: "1 John 3:4", "John 8:9", "3 John 7:9", "John 9:0-8"
  // (\d+\s+)? makes the leading book number and its trailing space optional together
  const refRegex = /(?:(\d+)\s+)?(\w+)\s+(\d+):(\d+)(?:-(\d+))?/;
  const matches = ref.match(refRegex);

  if (!matches) {
    console.error(`${ref} is malformed`);
    throw new Error(`${ref} is malformed`);
  }

  // If a book number exists (like '1'), combine it with the book name
  const bookNumber = matches[1] ? `${matches[1]} ` : "";
  const bookName = matches[2];

  const book = `${bookNumber}${bookName}`;
  const chapter = matches[3] as string;
  const verse = matches[4] as string;
  const verseRange = matches[5] ?? "";

  return {
    book,
    chapter,
    verse,
    verseRange,
  };
}
export function excartRefString({
  book,
  chapter,
  verse,
  verseRange,
}: RefObject): string {
  const stableVerseRange = verseRange ? `-${verseRange}` : "";
  return `${book} ${chapter}:${verse}${stableVerseRange}`;
}

export interface QuestionObj {
  type: string;
  question?: string;
  ref?: string;
  answer?: string;
  verse?: string;
  numVerses?: number;
}

export interface QuestionOptions {
  questions: QuestionObj[];
  questNum: number;
  chanceRange: (min: number, max: number) => number;
  updateUsers: (payload: Record<string, any>) => void | Promise<void>;
  finish: () => void | Promise<void>;
  QUESTION_TYPES?: Record<string, string>;
}

export function processQuestion({
  questions,
  questNum,
  chanceRange,
  updateUsers,
  finish,
  QUESTION_TYPES = { ACCORDING: "according", SQ: "sq" },
}: QuestionOptions) {
  // 1. Fetch & validate the question object
  const questObj = questions[questNum];

  let questionHead = "";

  if (!questObj) {
    console.error(
      "no question object found for quest num ",
      questNum,
      "questions array",
    );
    // wait updateUsers({ end: true });
    // await finish();
    return null;
  }

  // 2. Resolve question type
  const types = ["ftv", "quote"];
  const type =
    questObj.type === "ftv/quote" ? types[chanceRange(0, 1)] : questObj.type;

  // 3. Extract base question text
  let question =
    type === "quote" ? (questObj.ref as string) : (questObj.question as string);

  // 5. Build question header & format text based on type
  if (type === QUESTION_TYPES.ACCORDING) {
    question = "According to " + question;
  } else {
    const verseText = questObj.numVerses ? `${questObj.numVerses} Verse` : "";
    const typeText =
      type === QUESTION_TYPES.SQ
        ? "Situation Question"
        : type.charAt(0).toUpperCase() + type.slice(1);

    const header = `${verseText} ${typeText}`.trim();
    questionHead = header;
  }

  // 6. Handle FTV (Finish the Verse) specific logic
  if (type === "ftv") {
    const sourceText = questObj.answer || questObj.verse || "";
    const wordList = sourceText ? sourceText.split(" ") : [];

    // Takes the first 5 words as the starting prompt for FTV
    question = wordList.slice(0, 5).join(" ");

    if (!question) {
      console.error("question ftv is not working", questObj);
      return null;
    }
  }

  return { question, type, questionData: questObj, questionHead };
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
} // Mocks and Interface definitions for context

// Removed the useless `if(question.question)` and external fetch call
async function getVerse(question: Question): Promise<string> {
  // Mock response for testing
  if (question.question) return question.question;
  return "For God so loved the world, that he gave his only Son";
}

interface ProcessQuestionTypeReturn {
  head: string;
  body: string;
  answer?: string;
}

// 2. Fixed syntax and return type (needs Promise wrapper for async)
export async function processQuestionType(
  question: Question,
): Promise<ProcessQuestionTypeReturn> {
  if (!question) {
    throw new Error("Question object is completely missing.");
  }

  switch (question.type) {
    case "ftv": {
      const numToQuote = question.verseRange
        ? Number(question.verseRange) - Number(question.chapter)
        : 1;

      const head = `${numToQuote} Verse Finish the Verse:`;

      const answer = await getVerse(question);
      const body = answer.split(" ").slice(0, 5).join(" ");

      return { head, body, answer };
    }

    case "quote": {
      const numToQuote = question.verseRange
        ? Number(question.verseRange) - Number(question.chapter)
        : 1;

      const head = `${numToQuote} Verse Quote:`;

      const answer = await getVerse(question);
      const body = `Quote ${excartRefString(question)}`;

      return { head, body, answer };
    }

    default: {
      if (!question.question) {
        console.error(
          `Question: ${question.id} .question is missing \n ${JSON.stringify(
            question,
            null,
            2,
          )}`,
        );
        throw new Error("Question is malformed, no question text found");
      }

      const head = "Question:";
      const body = question.question;

      return { head, body };
    }
  }
}
/**
 *
 * @param min An interger to represent the least number, that is inclusive
 * @param max An interger to represent the max, that is inclusive
 * @returns A random integer between the min and max values, inclusive of min and inclusive of max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomWords(pool: Record<string, any>[]): string[] {
  const randomQuestionIndex = randomInt(0, pool.length - 1);

  const words = pool[randomQuestionIndex].body.split(" ");

  const randomWordIndex = randomInt(0, words.length - 1);

  return [words[randomWordIndex]];
}

export function getRandomQuestionWords(
  questionsPool: QuizQuestion[],
  n: number,
): string[] {
  let randomWords: string[] = [];
  for (let i = 0; i < n; i++) {
    const words = getRandomWords(questionsPool);

    randomWords = [...randomWords, ...words];
  }
  return randomWords;
}
