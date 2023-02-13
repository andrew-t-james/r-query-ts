import type { StatsPresenterState } from "../types";
import BookAdderTestHarness from "../TestTools/BookAdderTestHarness";
import StatsPresenter from "./StatsPresenter";

describe("stats", () => {
  let statsViewModel: StatsPresenterState = {};
  let bookAdderTestHarness: BookAdderTestHarness;

  beforeEach(async () => {
    jest.resetAllMocks();

    bookAdderTestHarness = new BookAdderTestHarness();
    bookAdderTestHarness.clearQueryClient();

    await bookAdderTestHarness.init(() => {});

    await new StatsPresenter().load((generatedViewModel: any) => {
      statsViewModel = generatedViewModel;
    });
  });

  it("should show bookCount", async () => {
    expect(statsViewModel.lastAddedBook).toBe("The Hobbit");
    expect(statsViewModel.bookCount).toBe(5);
  });

  it("should show last added book", async () => {
    await bookAdderTestHarness.addBook();
    expect(statsViewModel.lastAddedBook).toBe("Wind in the willows");
  });
});
