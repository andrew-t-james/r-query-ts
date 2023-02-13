export type Book = {
  author: string;
  name: string;
  id: string;
  ownerId: string;
};

export type BookDto = Omit<Book, "id">;

export const QueryKeys = {
  Books: "books",
  AllBooks: "allbooks",
} as const;

export const MutationKeys = {
  LastAddedBook: "lastAddedbook",
} as const;
