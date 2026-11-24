import type  { BibleKey, BookRange, RefObject } from "./types";

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

export function multiFilter<T extends Record<string, any> >(
  items: T[],
  criteria: Partial<T>,
  shoulIncludeMissingKeys: boolean = false,
): T[] | undefined {
  if (!items || !criteria) return;
  return items.filter((item) => {
    return Object.keys(criteria).every((key) => {
      if (item[key] == null) { 
        // If the key doesn't exist on the item skip it, based on the shouldInclude option
        return shoulIncludeMissingKeys
      }
      if (Array.isArray(criteria[key])) {
        return criteria[key].includes(item[key]);
      }
      

      return item[key] === criteria[key];
    });
  });
}
//================================= BIBLE UTILS ======================================
/**This will shorten a book ofthe Bible to its common abbreviation

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

/**This will shorten a book ofthe Bible to its common abbreviation

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

export const getBookRange = Object.keys(BIBLE_BOOKS).reduce<BookRange>((acc, b): BookRange=> {
  const bibleKey = b as BibleKey;
  acc[bibleKey] = getChapters(bibleKey).map(String)
  return acc;

}

, {})

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
  const verse = matches[4] as string
  const verseRange = matches[5] ?? ""; 

  return {
    book,
    chapter,
    verse,
    verseRange
  };
}
export function excartRefString ({book, chapter, verse, verseRange}: RefObject): string{
  const stableVerseRange = verseRange ? `-${verseRange}` : ""
  return `${book} ${chapter}:${verse}${stableVerseRange}`

}