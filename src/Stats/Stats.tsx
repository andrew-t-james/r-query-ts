import React, { useState, useEffect, SetStateAction, useMemo } from "react";
import StatsPresenter from "./StatsPresenter";
import type { StatsPresenterState } from "../types";

export default function StatsComponent() {
  const statsPresenter = useMemo(() => new StatsPresenter(), []);
  const [stateViewModel, copyViewModelToStateViewModel] =
    useState<StatsPresenterState>({});

  useEffect(() => {
    statsPresenter.load(
      (generatedViewModel: SetStateAction<StatsPresenterState>) => {
        copyViewModelToStateViewModel(generatedViewModel);
      }
    );
  }, [statsPresenter]);

  return (
    <div>
      <h5>Last Added Book (ui)</h5>

      {stateViewModel?.status === "loading" ? (
        <div>Loading...</div>
      ) : (
        <>
          {stateViewModel.lastAddedBook}

          <h5>Book Count</h5>
          {stateViewModel.bookCount}
        </>
      )}
    </div>
  );
}
