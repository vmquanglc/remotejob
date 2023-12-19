export interface IAssumption {
	cont_40_cost_china?: number;
	cont_20_cost_china?: number;
	cont_40_cost_vn?: number;
	cont_20_cost_vn?: number;
	finance?: number;
	y4a_insurance?: number;
	y4a_overhead?: number;
	npd?: number;
	amz_sas_fee?: number;
	amz_coop_fee?: number;
	amz_freight_fee?: number;
	referral_fba_fbm?: number;
	max_vol_cont_40?: number;
	max_vol_cont_20?: number;
	max_wei_cont_40?: number;
	max_wei_cont_20?: number;
	y4a_operation_vs_amz_misf?: number;
	fulfillment_cost?: number;
	fulfillment_max_vol?: number;
	fulfillment_max_wei?: number;
	storage_cost?: number;
	storage_max_vol?: number;
	storage_max_wei?: number;
	storage_month?: number;
	no_of_depreciation_year?: number;
	fob_vs_y4a?: number;
	operation_vs_y4a?: number;
	insurance?: number;
	overhead_and_finance_cost?: number;
	refund_and_chargeback?: number;
	mkt_spend_vs_rrp_fba?: number;
	net_ppm_assumption_1?: number;
	net_ppm_assumption_2?: number;
	net_ppm_assumption_3?: number;
	category?: string[];
	materials?: string[];
	product_source?: string[];
	suggested_duty?: any;
}
export enum ESource {
	China = "China",
	Vietnam = "VietNam",
}

export enum ETypeCont {
	Cont40 = "Cont40",
	Cont20 = "Cont20",
}

export enum ISizeTier {
	smallStandardSize = "Small standard-size",
	largeStandardSize = "Large standard-size",
	smallOversize = "Small oversize",
	mediumOversize = "Medium oversize",
	largeOversize = "Large oversize",
	specialOversize = "Special oversize",
}

export enum EChannel {
	internal = "internal",
	external = "external",
}

export interface IInputs {
	percent_submit_to_amz_di: number | null;
	percent_submit_to_amz_ds: number | null;
	percent_submit_to_amz_wh: number | null;
	amz_refund_and_chargeback: number | null;
	mix_channel_di: number | null;
	mix_channel_ds: number | null;
	mix_channel_wh: number | null;
	mix_channel_fba: number | null;
	percent_mkt_fee: number | null;
	percent_price_discount: number | null;
	period: string;
	product_source: ESource;
	category: string;
	suggested_duty: number | null;
	type_of_cont_shipping: ETypeCont | "";
}
