import { SetStateAction } from "react";
import { Book } from "../types";
import booksRepository from "./BooksRepository";

export default class BookListPresenter {
  load = async (
    callback: (generatedViewModel: SetStateAction<Book[]>) => void
  ) => {
    await booksRepository.getBooks((booksPm: Book[]) => {
      const booksVm = booksPm.map((bookPm) => {
        return { name: bookPm.name, author: bookPm.author };
      });
      callback(booksVm as SetStateAction<Book[]>);
    });
  };

  sortBy = async (arg: keyof Book, direction: string) => {
    await booksRepository.sortBy(arg, direction);
  };

  setMode = async (mode: string) => {
    booksRepository.mode = mode === "public" ? "allbooks" : "books";
    await booksRepository.loadApiData();
  };

  reset = async () => {
    await booksRepository.reset();
  };
}
