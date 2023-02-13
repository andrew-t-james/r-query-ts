import booksRepository from "../Books/BooksRepository";

export default class AddBooksPresenter {
  addBook = async (name: string, author: string) => {
    await booksRepository.addBook({ name: name, author: author });
  };
}
