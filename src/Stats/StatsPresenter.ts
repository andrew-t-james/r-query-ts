import { SetStateAction } from "react";
import type { StatsPresenterState } from "../types";
import booksRepository from "../Books/BooksRepository";

export default class StatsPresenter {
  load = async (
    callback: (generatedViewModel: SetStateAction<StatsPresenterState>) => void
  ) => {
    await booksRepository.getStats(
      (
        bookCount: number,
        lastAddedBook: string,
        status?: "loading" | "error" | "success"
      ) => {
        const vm = {
          lastAddedBook: null,
          bookCount: null,
          status: null,
        } as StatsPresenterState;

        vm.lastAddedBook = lastAddedBook;
        vm.bookCount = bookCount;
        vm.status = status;

        callback(vm as SetStateAction<StatsPresenterState>);
      }
    );
  };
}
