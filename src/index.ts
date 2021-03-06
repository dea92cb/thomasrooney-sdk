import { URLSearchParams } from 'url';
import fetch from 'cross-fetch';
import { Book, BookChapter, Chapter, Character, ListQueryOptions, Movie, Quote } from './models';
import { retryLoop } from './utils';

export * from './models';

export class LotrClient {
  public book = {
    list: (options?: ListQueryOptions<Book>) => this.getList<Book>('/book', options),
    get: (id: string) => this.get<Book>(`/book/${id}`),
    listChapters: (id: string, options?: ListQueryOptions<BookChapter>) => this.getList<BookChapter>(`/book/${id}/chapter`, options),
  };
  public movie = {
    list: (options?: ListQueryOptions<Movie>) => this.getList<Movie>('/movie', options),
    get: (id: string) => this.get<Movie>(`/movie/${id}`),
    listQuotes: (id: string, options?: ListQueryOptions<Quote>) => this.getList<Quote>(`/movie/${id}/quote`, options),
  };
  public character = {
    list: (options?: ListQueryOptions<Character>) => this.getList<Character>('/character', options),
    get: (id: string) => this.get<Character>(`/character/${id}`),
    listQuotes: (id: string, options?: ListQueryOptions<Quote>) => this.getList<Quote>(`/character/${id}/quote`, options),
  };
  public quote = {
    list: (options?: ListQueryOptions<Quote>) => this.getList<Quote>('/quote', options),
    get: (id: string) => this.get<Quote>(`/quote/${id}`),
  };
  public chapter = {
    list: (options?: ListQueryOptions<Chapter>) => this.getList<Chapter>('/chapter', options),
    get: (id: string) => this.get<Chapter>(`/chapter/${id}`),
  };
  constructor(private options: {apiKey: string}) {
  }
  private constructQuery<T>(options: ListQueryOptions<T>): string {
    const searchParams = new URLSearchParams();

    if (options.pagination) {
      Object.entries(options.pagination).forEach(([option, value]) => searchParams.set(option, String(value)));
    }

    if (options.sort) {
      searchParams.set('sort', `${options.sort.key}:${options.sort.direction}`);
    }

    let qs = searchParams.toString();

    if (options.additionalOptions) {
      qs += '&' + options.additionalOptions;
    }

    if (qs) {
      qs = '?' + qs;
    }

    return qs;
  }

  private async getList<T>(path: string, options: ListQueryOptions<T> = {}): Promise<T[]> {
    const headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${this.options.apiKey}`,
    };
    const query = this.constructQuery(options);
    const fullPath = `https://the-one-api.dev/v2${path}${query}`;
    const rawData = await fetch(fullPath, {
      headers: headers,
    });

    const rawResponse = await retryLoop(() => rawData.json(), 5, `couldn't get JSON from ${fullPath}. Response was ${rawData.status} ${rawData.statusText}`);

    const responseItems = rawResponse.docs;
    if (!Array.isArray(responseItems)) {
      throw new Error(`unexpected response from ${fullPath}: ${JSON.stringify(rawResponse)}. Expected docs array`);
    }
    return responseItems;
  }

  private async get<T>(path: string): Promise<T> {
    const items = await this.getList<T>(path);
    if (items.length !== 1) {
      throw new Error(`could not find single item with ID ${path}`);
    }
    return items[0];
  }
}