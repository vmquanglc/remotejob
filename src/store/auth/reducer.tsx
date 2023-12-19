import { SET_AUTH } from "./types";

export const AuthReducer = (auth = false, { type, payload }) => {
  switch (type) {
    case SET_AUTH:
      if (payload.auth === false) {
        return false;
      }
      return { ...payload.auth, lastUpdated: new Date() };

    default:
      return auth;
  }
};
