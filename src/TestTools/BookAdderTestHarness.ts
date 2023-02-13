import { QueriesObserver, MutationObserver } from "@tanstack/react-query";
import BookListPresenter from "../Books/BooksListPresenter";
import AddBooksPresenter from "../AddBook/AddBookPresenter";
import queryClient from "../Shared/queryClient";
import httpGateway from "../Shared/HttpGateway";
import booksRepository from "../Books/BooksRepository";
import GetPublicBooksStub from "../TestTools/GetPublicBooksStub";
import GetPrivateBooksStub from "../TestTools/GetPrivateBooksStub";
import { MutationKeys, QueryKeys } from "../types";

export default class BookAdderTestHarness {
  addBooksPresenter;
  bookListPresenter;

  constructor() {
    this.addBooksPresenter = new AddBooksPresenter();
    this.bookListPresenter = new BookListPresenter();
  }

  clearQueryClient() {
    queryClient.clear();
  }

  async init(callback: any) {
    jest.clearAllMocks();

    booksRepository.booksPm = new QueriesObserver(queryClient, [
      {
        queryKey: [QueryKeys.Books, QueryKeys.Books],
        queryFn: () => booksRepository.fetchBooks(QueryKeys.Books),
      },
      {
        queryKey: [QueryKeys.Books, QueryKeys.AllBooks],
        queryFn: () => booksRepository.fetchBooks(QueryKeys.AllBooks),
      },
    ]);

    this.bookListPresenter.setMode("public");

    httpGateway.get = jest.fn().mockImplementation((path) => {
      if (path === "https://api.logicroom.co/api/jpparkin@gmail.com/books") {
        return GetPrivateBooksStub();
      } else if (
        path === "https://api.logicroom.co/api/jpparkin@gmail.com/allbooks"
      ) {
        return GetPublicBooksStub();
      }
    });

    await this.bookListPresenter.load(callback);
  }

  async addBook() {
    jest.clearAllMocks();

    booksRepository.lastAddedBookPm = new MutationObserver(queryClient, {
      mutationKey: [MutationKeys.LastAddedBook],
      mutationFn: booksRepository.addBook,
    });

    const pivotedStub = GetPublicBooksStub();
    pivotedStub.result.push(pivotedStub.result[2]);

    httpGateway.post = jest.fn();

    httpGateway.get = jest.fn().mockImplementation(() => {
      return pivotedStub;
    });

    await this.addBooksPresenter.addBook("UFT", "Pete Heard");
  }

  async reset() {
    jest.clearAllMocks();

    const pivotedStub = GetPublicBooksStub();
    pivotedStub.result.pop();

    httpGateway.post = jest.fn();

    httpGateway.get = jest.fn().mockImplementation(() => {
      return pivotedStub;
    });

    await this.bookListPresenter.reset();
  }
}
