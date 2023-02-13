import httpGateway from "../Shared/HttpGateway";
import BookAdderTestHarness from "../TestTools/BookAdderTestHarness";
import { sleep } from "../TestTools/testing";
import { Book, SortOrder } from "../types";

describe("add book", () => {
  let bookAdderTestHarness: BookAdderTestHarness | null = null;
  let bookListViewModel: Book[] = [];
  const basePath = "https://api.logicroom.co/api/jpparkin@gmail.com";

  beforeEach(async () => {
    bookAdderTestHarness = new BookAdderTestHarness();
    bookAdderTestHarness.clearQueryClient();

    await bookAdderTestHarness.init((generatedViewModel: Book[]) => {
      bookListViewModel = generatedViewModel;
    });

    await sleep(1); // have to pause for cache updates
  });

  it("should call api", async () => {
    await bookAdderTestHarness?.addBook();

    expect(httpGateway.post).toHaveBeenCalledWith(`${basePath}/books`, {
      name: "UFT",
      author: "Pete Heard",
      ownerId: "jpparkin@gmail.com",
    });
  });

  it("should load(anchor) and reload books", async () => {
    // anchor
    expect(httpGateway.get).toHaveBeenCalledWith(`${basePath}/allbooks`);
    expect(bookListViewModel?.length).toBe(5);
    expect(bookListViewModel[0].name).toBe("Moby Dick");
    expect(bookListViewModel[4].name).toBe("The Hobbit");

    // reload (pivot)
    await bookAdderTestHarness?.addBook();

    expect(httpGateway.get).toHaveBeenCalledWith(`${basePath}/allbooks`);

    expect(bookListViewModel.length).toBe(6);
    expect(bookListViewModel[0].name).toBe("Moby Dick");
    expect(bookListViewModel[4].name).toBe("The Hobbit");
    expect(bookListViewModel[5].name).toBe("Wind in the willows");
  });

  it("should reset(anchor) and reload books", async () => {
    // anchor
    expect(httpGateway.get).toHaveBeenCalledWith(`${basePath}/allbooks`);
    expect(bookListViewModel?.length).toBe(5);
    expect(bookListViewModel[0].name).toBe("Moby Dick");
    expect(bookListViewModel[4].name).toBe("The Hobbit");

    // reset (pivot)
    await bookAdderTestHarness?.reset();

    expect(httpGateway.get).toHaveBeenCalledWith(`${basePath}/reset`);

    expect(bookListViewModel.length).toBe(4);
    expect(bookListViewModel[0].name).toBe("Moby Dick");
    expect(bookListViewModel[3].name).toBe("I, Robot");
  });

  it("should sort by name asc", async () => {
    // spot check
    expect(bookListViewModel[0].name).toBe("Moby Dick");
    expect(bookListViewModel[4].name).toBe("The Hobbit");

    await bookAdderTestHarness?.bookListPresenter.sortBy("name", SortOrder.Asc);

    expect(bookListViewModel[0].name).toBe("I, Robot");
    expect(bookListViewModel[4].name).toBe("Wind in the willows");
  });

  it("should sort by name desc", async () => {
    // spot check
    expect(bookListViewModel[0].name).toBe("Moby Dick");
    expect(bookListViewModel[4].name).toBe("The Hobbit");

    await bookAdderTestHarness?.bookListPresenter.sortBy(
      "name",
      SortOrder.Desc
    );

    expect(bookListViewModel[0].name).toBe("Wind in the willows");
    expect(bookListViewModel[4].name).toBe("I, Robot");
  });

  it("should filter public and private books", async () => {
    expect(bookListViewModel.length).toBe(5);

    await bookAdderTestHarness?.bookListPresenter.setMode("private");

    expect(bookListViewModel.length).toBe(3);

    await bookAdderTestHarness?.bookListPresenter.setMode("public");

    expect(bookListViewModel.length).toBe(5);
  });

});
