// Extracted from https://github.com/gitfrosh/lotr-api/tree/release/backend/models

export interface PaginationOptions {
  pagination?: {
    limit?: number;
    page?: number;
    offset?: number;
  };
}

export interface SortOptions<T> {
  sort?: {
    direction: 'asc' | 'desc';
    key: Extract<keyof T, string>;
  };
}

export type ListQueryOptions<T> = PaginationOptions & SortOptions<T> & FilterOptions

export interface FilterOptions {
  additionalOptions?: string;
}

export type Book = {
  _id: string;
  name: string;
}

export type BookChapter = {
  chapterName: string;
}

export type Chapter = {
  _id: string;
  chapterName: string;
  book: string;
  bookName: string;
  ChapterData: string;
}

export type Character = {
  _id: string;
  name: string;
  wikiUrl: string;
  race: string;
  birth?: string | number | null;
  gender?: string;
  death?: string | number;
  hair?: string;
  height?: string;
  realm?: string;
  spouse?: string;
}

export type Movie = {
  _id: string;
  name: string;
  runtimeInMinutes: number;
  budgetInMillions: number;
  boxOfficeRevenueInMillions: number;
  academyAwardNominations: number;
  academyAwardWins: number;
  rottenTomatoesScore: number;
}

export type Quote = {
  _id: string;
  dialog: string;
  movie: string;
  character: string;
}