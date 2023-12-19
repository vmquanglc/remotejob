import { SET_AUTH } from "./types";

export const setAuth = (auth: any) => ({
  type: SET_AUTH,
  payload: {
    auth,
  },
});
