import { createSelector } from "@reduxjs/toolkit";

export const selectCalculatorReducer = (state) => state.calculator;
export const selectCalculator = createSelector([selectCalculatorReducer], (calculator) => {
	return calculator;
});
