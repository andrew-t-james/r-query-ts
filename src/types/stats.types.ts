export type StatsPresenterState = {
  status?: "loading" | "error" | "success" | null;
  lastAddedBook?: string | null;
  bookCount?: number | null;
};
