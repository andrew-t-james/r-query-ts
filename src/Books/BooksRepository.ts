import { QueriesObserver, MutationObserver } from "@tanstack/react-query";
import httpGateway from "../Shared/HttpGateway";
import queryClient from "../Shared/queryClient";
import { Book, BookDto, MutationKeys, QueryKeys, SortOrder } from "../types";

class BooksRepository {
  basePath = "https://api.logicroom.co/api/jpparkin@gmail.com";
  booksPm;
  lastAddedBookPm;
  mode = "books";

  constructor() {
    this.booksPm = new QueriesObserver(queryClient, [
      {
        queryKey: [QueryKeys.Books, QueryKeys.Books],
        queryFn: () => this.fetchBooks(QueryKeys.Books),
        enabled: this.mode === QueryKeys.Books,
      },
      {
        queryKey: [QueryKeys.Books, QueryKeys.AllBooks],
        queryFn: () => this.fetchBooks(QueryKeys.AllBooks),
        enabled: this.mode === QueryKeys.AllBooks,
      },
    ]);

    this.lastAddedBookPm = new MutationObserver(queryClient, {
      mutationKey: [MutationKeys.LastAddedBook],
      mutationFn: this.addBook,
    });
  }

  getBooks = async (callback: (booksPm: Book[]) => void) => {
    this.booksPm.subscribe((result) => {
      const books = this.getBooksFromResult(result);
      if (books?.result) {
        callback(books.result);
      } else {
        callback([]);
      }
    });

    await this.loadApiData();
  };

  addBook = async (programmersModel: { name: any; author: any }) => {
    let dto = {
      name: programmersModel.name,
      author: programmersModel.author,
      ownerId: "jpparkin@gmail.com",
    };
    await httpGateway.post(`${this.basePath}/books`, dto);

    this.loadApiData();
  };

  sortBy = async (arg: keyof Book, direction: string) => {
    let books = queryClient.getQueryData<{ result: Book[]; status: string }>([
      QueryKeys.Books,
      this.mode,
    ]);

    let sortedBooks;
    if (direction === SortOrder.Asc) {
      sortedBooks = books?.result.sort((a: Book, b: Book) =>
        a[arg].localeCompare(b[arg])
      );
    } else {
      sortedBooks = books?.result.sort((a: Book, b: Book) =>
        b[arg].localeCompare(a[arg])
      );
    }

    queryClient.setQueryData(["books", this.mode], {
      success: true,
      result: sortedBooks,
    });
  };

  getStats = async (
    callback: (
      bookCount: number,
      lastAddedBook: string,
      status?: "loading" | "error" | "success" | undefined
    ) => void
  ) => {
    this.booksPm.subscribe((result) => {
      let bookCount = 0;
      let bookName = "";
      const allBooks = queryClient.getQueryData<{
        result: Book[];
        status: string;
      }>([QueryKeys.Books, this.mode]);

      if (allBooks) {
        bookCount = allBooks.result.length;
        bookName = allBooks.result[allBooks.result.length - 1].name;
      }

      callback(bookCount, bookName, result[0]?.status);
    });

    await this.loadApiData();
  };

  fetchBooks = async (mode: string) => {
    return await httpGateway.get(`${this.basePath}/${mode}`);
  };

  postBook = async (dto: BookDto) => {
    await httpGateway.post(`${this.basePath}/books`, dto);
  };

  loadApiData = async () => {
    await queryClient.invalidateQueries([QueryKeys.Books]);
  };

  getBooksFromResult = (result: string | any[]) => {
    if (result.length === 2) {
      if (this.mode === "books") {
        return result[0].data;
      } else {
        return result[1].data;
      }
    } else {
      return null;
    }
  };

  reset = async () => {
    await httpGateway.get(`${this.basePath}/reset`);
    await this.loadApiData();
  };
}

const booksRepository = new BooksRepository();

export default booksRepository;
