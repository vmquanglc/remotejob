import {
	calBlue,
	calMaxLoadingCapacity,
	calSizeTier,
	calculator,
	rounded,
} from "src/utils/profit-simulation/formulaPS";
import {
	SET_ASIN_INFO,
	SET_ASIN_INFO_ERROR,
	SET_INITIAL,
	SET_LIST_ROWS,
	SET_ROW_INFO,
} from "./types";

export const defaultVariables = {
	percent_submit_to_amz_di: null,
	percent_submit_to_amz_ds: null,
	percent_submit_to_amz_wh: null,
	amz_refund_and_chargeback: null,
	mix_channel_di: null,
	mix_channel_ds: null,
	mix_channel_wh: null,
	mix_channel_fba: null,
	percent_mkt_fee: null,
	percent_price_discount: null,
	period: "",
	product_source: "",
	category: "",
	suggested_duty: null,
	type_of_cont_shipping: "",
};

const initialValues = Array.from(Array(10), (_, index) => ({
	inputs: defaultVariables,
	isViewResult: false,
	isLoading: false,
	isAllowed: index === 0 ? true : false,
	request_id: null,
}));

export const Calculator = (calculatorReducer = initialValues, { type, payload }) => {
	switch (type) {
		case SET_INITIAL:
			return [
				...Array.from(Array(10), (_, index) => ({
					inputs: defaultVariables,
					isViewResult: false,
					isLoading: false,
					isAllowed: index === 0 ? true : false,
					request_id: null,
				})),
			];
		case SET_LIST_ROWS:
			calculatorReducer = payload.data;
			return [...calculatorReducer];
		case SET_ROW_INFO:
			calculatorReducer[payload.index] = payload.data;
			return [...calculatorReducer];
		case SET_ASIN_INFO:
			const idxItem = calculatorReducer.findIndex((item) => item.request_id === payload.request_id);
			if (idxItem > -1) {
				const { max_vol_cont_40, max_wei_cont_40 } = payload.assumption;
				calculatorReducer[idxItem] = {
					...calculatorReducer[idxItem],
					...payload.data,
					isLoading: false,
					fob: rounded({ number: payload?.data?.rrp * 0.2 }),
					fob_previous: rounded({ number: payload?.data?.rrp * 0.2 }),
					rrp_previous: payload?.data?.rrp,
					longest_side_previous: payload?.data?.longest_side,
					median_side_previous: payload?.data?.median_side,
					shortest_side_previous: payload?.data?.shortest_side,
					weight_previous: payload?.data?.weight,
					size_tier: calSizeTier(
						payload?.data?.longest_side,
						payload?.data?.median_side,
						payload?.data?.shortest_side,
						payload?.data?.weight
					),
					is_blue: calBlue(
						payload?.data?.longest_side,
						payload?.data?.median_side,
						payload?.data?.shortest_side,
						payload?.data?.weight
					),
					max_loading_capacity: calMaxLoadingCapacity(
						max_vol_cont_40,
						payload?.data?.longest_side,
						payload?.data?.median_side,
						payload?.data?.shortest_side,
						max_wei_cont_40,
						payload?.data?.weight
					),
					isViewResult: true,
					...calculator(
						payload.assumption,
						payload?.data?.rrp,
						payload?.data?.rrp * 0.2,
						payload?.data?.longest_side,
						payload?.data?.median_side,
						payload?.data?.shortest_side,
						payload?.data?.weight,
						calculatorReducer[idxItem].inputs
					),
				};
			}
			return [...calculatorReducer];
		case SET_ASIN_INFO_ERROR:
			const idx = calculatorReducer.findIndex((item) => item.request_id === payload.request_id);
			if (idx > -1) {
				calculatorReducer[idx] = {
					...calculatorReducer[idx],
					isLoading: false,
					isViewResult: true,
				};
			}
			return [...calculatorReducer];

		default:
			return calculatorReducer;
	}
};
