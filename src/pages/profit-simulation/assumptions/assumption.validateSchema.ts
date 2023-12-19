import * as Yup from "yup";

export const SCHEMA_ASSUMPTION = Yup.object({
	cont_40_cost_china: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	cont_20_cost_china: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	cont_40_cost_vn: Yup.number().typeError("Please type valid value").required("Field is required"),
	cont_20_cost_vn: Yup.number().typeError("Please type valid value").required("Field is required"),
	finance: Yup.number().typeError("Please type valid value").required("Field is required"),
	y4a_insurance: Yup.number().typeError("Please type valid value").required("Field is required"),
	y4a_overhead: Yup.number().typeError("Please type valid value").required("Field is required"),
	npd: Yup.number().typeError("Please type valid value").required("Field is required"),
	amz_sas_fee: Yup.number().typeError("Please type valid value").required("Field is required"),
	amz_coop_fee: Yup.number().typeError("Please type valid value").required("Field is required"),
	amz_freight_fee: Yup.number().typeError("Please type valid value").required("Field is required"),
	referral_fba_fbm: Yup.number().typeError("Please type valid value").required("Field is required"),
	max_vol_cont_40: Yup.number().typeError("Please type valid value").required("Field is required"),
	max_vol_cont_20: Yup.number().typeError("Please type valid value").required("Field is required"),
	max_wei_cont_40: Yup.number().typeError("Please type valid value").required("Field is required"),
	max_wei_cont_20: Yup.number().typeError("Please type valid value").required("Field is required"),
	y4a_operation_vs_amz_misf: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	fulfillment_cost: Yup.number().typeError("Please type valid value").required("Field is required"),
	fulfillment_max_vol: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	fulfillment_max_wei: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	storage_cost: Yup.number().typeError("Please type valid value").required("Field is required"),
	storage_max_vol: Yup.number().typeError("Please type valid value").required("Field is required"),
	storage_max_wei: Yup.number().typeError("Please type valid value").required("Field is required"),
	storage_month: Yup.number().typeError("Please type valid value").required("Field is required"),
	no_of_depreciation_year: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	fob_vs_y4a: Yup.number().typeError("Please type valid value").required("Field is required"),
	operation_vs_y4a: Yup.number().typeError("Please type valid value").required("Field is required"),
	insurance: Yup.number().typeError("Please type valid value").required("Field is required"),
	overhead_and_finance_cost: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	refund_and_chargeback: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
	mkt_spend_vs_rrp_fba: Yup.number()
		.typeError("Please type valid value")
		.required("Field is required"),
});
