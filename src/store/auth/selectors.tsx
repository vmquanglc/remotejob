import { createSelector } from "@reduxjs/toolkit";

export const selectAuth = (state) => state.auth;
export const selectRoleAccount = createSelector([selectAuth], (auth) => {
	return auth?.role;
});
