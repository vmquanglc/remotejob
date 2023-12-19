import { keyBy } from "lodash";
import { createSelector } from "@reduxjs/toolkit";

export const selectAuth = (state) => state.auth;
export const selectActivities = createSelector([selectAuth], (auth) => {
	return auth.activities && keyBy(auth.activities, "code");
});
