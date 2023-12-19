import {
	SET_ROW_INFO,
	SET_ASIN_INFO,
	SET_LIST_ROWS,
	SET_INITIAL,
	SET_ASIN_INFO_ERROR,
} from "./types";

export const setRowInfo = (data, index) => ({
	type: SET_ROW_INFO,
	payload: {
		data,
		index,
	},
});
export const setAsinInfo = (data, request_id, assumption) => ({
	type: SET_ASIN_INFO,
	payload: {
		data,
		request_id,
		assumption,
	},
});
export const setAsinInfoError = (request_id) => ({
	type: SET_ASIN_INFO_ERROR,
	payload: {
		request_id,
	},
});
export const setInitialCalReducer = () => ({
	type: SET_INITIAL,
	payload: {},
});

export const setListRows = (data) => ({
	type: SET_LIST_ROWS,
	payload: { data },
});
