import {
	EChannel,
	ESource,
	ETypeCont,
	IAssumption,
	ISizeTier,
} from "src/interface/profitSimulation.interface";

export const initialAssumption = {
	cont_40_cost_china: 0,
	cont_20_cost_china: 0,
	cont_40_cost_vn: 0,
	cont_20_cost_vn: 0,
	finance: 0,
	y4a_insurance: 0,
	y4a_overhead: 0,
	npd: 0,
	amz_sas_fee: 0,
	amz_coop_fee: 0,
	amz_freight_fee: 0,
	referral_fba_fbm: 0,
	max_vol_cont_40: 0,
	max_vol_cont_20: 0,
	max_wei_cont_40: 0,
	max_wei_cont_20: 0,
	y4a_operation_vs_amz_misf: 0,
	fulfillment_cost: 0,
	fulfillment_max_vol: 0,
	fulfillment_max_wei: 0,
	storage_cost: 0,
	storage_max_vol: 0,
	storage_max_wei: 0,
	storage_month: 0,
	no_of_depreciation_year: 0,
	fob_vs_y4a: 0,
	operation_vs_y4a: 0,
	insurance: 0,
	overhead_and_finance_cost: 0,
	refund_and_chargeback: 0,
	mkt_spend_vs_rrp_fba: 0,
	net_ppm_assumption_1: 0,
	net_ppm_assumption_2: 0,
	net_ppm_assumption_3: 0,
};

export const rounded = ({ number, decimals = 2 }: { number: number; decimals?: number }) => {
	let decimal = "1";

	for (let i = 0; i < decimals; i++) {
		decimal += "0";
	}
	return Math.round(number * Number(decimal)) / Number(decimal) || 0;
};

export const roundUp = ({ number, decimals = 2 }: { number: number; decimals?: number }) => {
	let decimal = "1";

	for (let i = 0; i < decimals; i++) {
		decimal += "0";
	}
	return Math.ceil(number * Number(decimal)) / Number(decimal) || 0;
};

export const calLG = (long: number, median: number, shortest: number) => {
	return (+median + +shortest) * 2 + +long || 0;
};

export const calVolcuft = (long: number, median: number, shortest: number) => {
	return (+long * +median * +shortest) / 1728 || 0;
};

export const calVolM3 = (long: number, median: number, shortest: number) => {
	return +long * +median * +shortest * Math.pow(0.0254, 3) || 0;
};
export const calWOz = (weight: number) => {
	return +weight * 16 || 0;
};

export const calDimW = (long: number, median: number, shortest: number) => {
	return (+long * +median * +shortest) / 139 || 0;
};

export const calSpeW = (long: number, median: number, shortest: number, weight: number) => {
	return (+weight * 0.453592) / calVolM3(+long, +median, +shortest) || 0;
};

export const calDensity = (long: number, median: number, shortest: number, weight: number) => {
	return +weight / calVolcuft(+long, +median, +shortest) || 0;
};

export const calScenarioSelection = (value: number) => {
	//value return from calDensity func
	if (+value < 5) return "Best case";
	else if (+value < 10) return "Best- Medium case";
	else if (+value < 20) return "Medium case";
	else if (+value < 50) return "Medium - Worst case";
	else return "Worst case";
};

export const calTransCost = (
	source: ESource, // "China" or "Vietnam"
	type: ETypeCont | "", //Type of Cont Shipping: "Cont 40" or "Cont 20"
	assumption: IAssumption,
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	let contCostChina = 0;
	let contCostVietnam = 0;
	let maxVolCont = ETypeCont.Cont40 ? +assumption.max_vol_cont_40 : +assumption.max_vol_cont_20;
	let maxWeiCont = ETypeCont.Cont40 ? +assumption.max_wei_cont_40 : +assumption.max_wei_cont_20;

	if (source === ESource.Vietnam) {
		contCostVietnam =
			type === ETypeCont.Cont40 ? +assumption.cont_40_cost_vn : +assumption.cont_20_cost_vn;
		return (
			contCostVietnam / Math.min(maxVolCont / (+long * +median * +shortest), maxWeiCont / +weight)
		);
	}
	if (source === ESource.China) {
		contCostChina =
			type === ETypeCont.Cont40 ? +assumption.cont_40_cost_china : +assumption.cont_20_cost_china;
	}

	const scenario = calScenarioSelection(calDensity(+long, +median, +shortest, +weight));

	const bestCase =
		(0.5 / 0.95) * (contCostChina / maxVolCont) * +long * +median * +shortest +
		(0.5 / 0.95) * (contCostChina / maxWeiCont) * +weight;

	const worstCase =
		contCostChina / Math.min(maxVolCont / +long / +median / +shortest, maxWeiCont / +weight);
	switch (scenario) {
		case "Best case":
			return bestCase || 0;
		case "Worst case":
			return worstCase || 0;
		case "Medium case":
			return (bestCase + worstCase) / 2 || 0;
		case "Best- Medium case":
			return (bestCase + (bestCase + worstCase) / 2) / 2 || 0;
		case "Medium - Worst case":
			return ((bestCase + worstCase) / 2 + worstCase) / 2 || 0;
	}
};

export const calY4ATransportCost = (
	source: ESource, // "China" or "Vietnam"
	type: ETypeCont | "", //Type of Cont Shipping: "Cont 40" or "Cont 20"
	assumption: IAssumption,
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	let contCostChina = 0;
	let contCostVietnam = 0;
	let maxVolCont = ETypeCont.Cont40 ? +assumption.max_vol_cont_40 : +assumption.max_vol_cont_20;
	let maxWeiCont = ETypeCont.Cont40 ? +assumption.max_wei_cont_40 : +assumption.max_wei_cont_20;

	if (source === ESource.Vietnam) {
		contCostVietnam =
			type === ETypeCont.Cont40 ? +assumption.cont_40_cost_vn : +assumption.cont_20_cost_vn;
		return (
			contCostVietnam / Math.min(maxVolCont / (+long * +median * +shortest), maxWeiCont / +weight)
		);
	}
	contCostChina =
		type === ETypeCont.Cont40 ? +assumption.cont_40_cost_china : +assumption.cont_20_cost_china;

	const scenario = calScenarioSelection(calDensity(+long, +median, +shortest, +weight));

	const bestCase =
		(0.5 / 0.95) * (contCostChina / maxVolCont) * +long * +median * +shortest +
		(0.5 / 0.95) * (contCostChina / maxWeiCont) * +weight;

	const worstCase =
		contCostChina / Math.min(maxVolCont / +long / +median / +shortest, maxWeiCont / +weight);

	switch (scenario) {
		case "Best case":
			return bestCase || 0;
		case "Worst case":
			return worstCase || 0;
		case "Medium case":
			return (bestCase + worstCase) / 2 || 0;
		case "Best- Medium case":
			return (bestCase + (bestCase + worstCase) / 2) / 2 || 0;
		case "Medium - Worst case":
			return ((bestCase + worstCase) / 2 + worstCase) / 2 || 0;
	}
};
export const calY4AFulfillmentCost = (
	assumption: IAssumption,
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	const { fulfillment_cost, fulfillment_max_vol, fulfillment_max_wei, y4a_operation_vs_amz_misf } =
		assumption;
	return (
		(((0.5 * fulfillment_cost) / fulfillment_max_vol) * +long * +median * +shortest +
			((0.5 * fulfillment_cost) / fulfillment_max_wei) * +weight) *
			y4a_operation_vs_amz_misf || 0
	);
};

export const calY4AStorageCost = (
	assumption: IAssumption,
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	const { storage_cost, storage_max_vol, storage_max_wei, storage_month } = assumption;
	return (
		(((0.5 * storage_cost) / storage_max_vol) * +long * +median * +shortest +
			((0.5 * storage_cost) / storage_max_wei) * +weight) *
			storage_month || 0
	);
};

export const calSizeTier = (long: number, median: number, shortest: number, weight: number) => {
	//IF(AND(MAX($K$7,$K$14)<=1,$K$4<=15,$K$5<=12,$K$6<=0.75),"Small standard-size", IF(AND(MAX($K$7,$K$14)<=20,$K$4<=18,$K$5<=14,$K$6<=8),"Large standard-size"IF(AND(MAX($K$7,$K$14)<=70,$K$4<=60,$K$5<=30, $K$10<=130),"Small oversize",IF(AND(MAX($K$7,$K$14)<=150,$K$4<=108,$K$10<=130),"Medium oversize",IF(AND(MAX($K$7,$K$14)<=150,$K$4<=108,$K$10<=165),"Large oversize","Special oversize")))))
	if (!long || !median || !shortest || !weight) return undefined;
	const max = Math.max(weight, (+long * +median * +shortest) / 139);
	if (max <= 1 && +long <= 15 && +median <= 12 && +shortest <= 0.75)
		return ISizeTier.smallStandardSize;
	if (max <= 20 && +long <= 18 && +median <= 14 && +shortest <= 8)
		return ISizeTier.largeStandardSize;
	if (max <= 70 && +long <= 60 && +median <= 30 && calLG(+long, +median, +shortest) <= 130)
		return ISizeTier.smallOversize;
	if (max <= 150 && +long <= 108 && calLG(+long, +median, +shortest) <= 130)
		return ISizeTier.mediumOversize;
	if (max <= 150 && long <= 108 && calLG(+long, +median, +shortest) <= 165)
		return ISizeTier.largeOversize;
	return ISizeTier.specialOversize;
};

export const calBlue = (long: number, median: number, shortest: number, weight: number) => {
	if (!long || !median || !shortest || !weight) return null;
	const sizeTier = calSizeTier(+long, +median, +shortest, +weight);
	if (sizeTier === ISizeTier.smallStandardSize || sizeTier === ISizeTier.largeStandardSize)
		return false;
	return true;
};

export const calMaxLoadingCapacity = (
	max_vol_cont_40,
	new_longest_side,
	new_median_side,
	new_shortest_side,
	max_wei_cont_40,
	new_weight
) => {
	if (
		!max_vol_cont_40 ||
		!new_longest_side ||
		!new_median_side ||
		!new_shortest_side ||
		!max_wei_cont_40 ||
		!new_weight
	)
		return "";
	return rounded({
		number: Math.min(
			max_vol_cont_40 / new_longest_side / new_median_side / new_shortest_side,
			max_wei_cont_40 / new_weight
		),
		decimals: 0,
	});
};

export const calOutBoundShippingWeight = (
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	const sizeTier = calSizeTier(+long, +median, +shortest, +weight);
	if (sizeTier === ISizeTier.smallStandardSize || sizeTier === ISizeTier.specialOversize)
		return weight;
	return Number(Math.max(+weight, calDimW(+long, +median, +shortest)));
};

export const calReferralFee = (rrp: number, referral_fba_fbm: number, price_discount: number) => {
	return rrp * (1 - price_discount) * referral_fba_fbm > 0.3
		? Number(rrp * (1 - price_discount) * referral_fba_fbm)
		: 0.3;
};

export const calFBAFeeFulFillmentFee = (
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	const sizeTier = calSizeTier(+long, +median, +shortest, +weight);
	const outBoundShippingWeight = calOutBoundShippingWeight(+long, +median, +shortest, +weight);
	switch (sizeTier) {
		case ISizeTier.smallStandardSize:
			if (outBoundShippingWeight <= 0.25) return 3.22;
			else if (outBoundShippingWeight <= 0.5) return 3.4;
			else if (outBoundShippingWeight <= 0.75) return 3.58;
			else if (outBoundShippingWeight <= 1) return 3.77;
			else return 0;
		case ISizeTier.largeStandardSize:
			if (outBoundShippingWeight <= 0.25) return 3.86;
			else if (outBoundShippingWeight <= 0.5) return 4.08;
			else if (outBoundShippingWeight <= 0.75) return 4.24;
			else if (outBoundShippingWeight <= 1) return 4.75;
			else if (outBoundShippingWeight <= 1.5) return 5.4;
			else if (outBoundShippingWeight <= 2) return 5.69;
			else if (outBoundShippingWeight <= 2.5) return 6.1;
			else if (outBoundShippingWeight <= 3) return 6.39;
			else if (outBoundShippingWeight <= 20) {
				return rounded({
					number:
						7.17 + roundUp({ number: (outBoundShippingWeight - 3) / 0.5, decimals: 0 }) * 0.16,
				});
			} else return 0;
		case ISizeTier.smallOversize:
			return roundUp({
				number: 9.73 + 0.42 * roundUp({ number: outBoundShippingWeight - 1, decimals: 0 }),
			});
		case ISizeTier.mediumOversize:
			return roundUp({
				number: 19.05 + 0.42 * roundUp({ number: outBoundShippingWeight - 1, decimals: 0 }),
			});
		case ISizeTier.largeOversize:
			if (outBoundShippingWeight <= 90) return 89.98;
			else
				return roundUp({
					number: 89.98 + 0.83 * roundUp({ number: outBoundShippingWeight - 90, decimals: 0 }),
				});
		case ISizeTier.specialOversize:
			if (outBoundShippingWeight <= 90) return 158.49;
			else
				return roundUp({
					number: 158.49 + 0.83 * roundUp({ number: outBoundShippingWeight - 90, decimals: 0 }),
				});
	}
};

export const calFBAFeeInventoryStorageMISF = (
	period: string,
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	const sizeTier = calSizeTier(+long, +median, +shortest, +weight);
	if (period === "January– September") {
		if (sizeTier === ISizeTier.smallStandardSize || sizeTier === ISizeTier.largeStandardSize) {
			return 0.87 * calVolcuft(+long, +median, +shortest);
		}
		return 0.56 * calVolcuft(+long, +median, +shortest);
	} else {
		if (sizeTier === ISizeTier.smallStandardSize || sizeTier === ISizeTier.largeStandardSize) {
			return 2.4 * calVolcuft(+long, +median, +shortest);
		}
		return 1.4 * calVolcuft(+long, +median, +shortest);
	}
};

export const calFBAFeeDIP = (long: number, median: number, shortest: number, weight: number) => {
	const sizeTier = calSizeTier(+long, +median, +shortest, +weight);
	const max = Math.max(calDimW(+long, +median, +shortest), +weight);
	if (sizeTier === ISizeTier.smallStandardSize || sizeTier === ISizeTier.largeStandardSize) {
		if (max <= 1) return 0.3;
		else if (max <= 2) return 0.4;
		else return 0.4 + 0.1 * (max - 2);
	} else {
		if (max <= 5) return 1.3;
		else return 1.3 + 0.2 * (max - 5);
	}
};

export const calFOBandDuty = (assumption: IAssumption, fob: number, suggested_duty: number) => {
	return +assumption.fob_vs_y4a * fob * (1 + suggested_duty);
};

export const calShipment = (
	assumption: IAssumption,
	source: ESource, // "China" or "Vietnam"
	type: ETypeCont | "", //Type of Cont Shipping: "Cont 40" or "Cont 20"
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	let contCostChina = 0;
	let contCostVietnam = 0;
	let maxVolCont = ETypeCont.Cont40 ? assumption.max_vol_cont_40 : assumption.max_vol_cont_20;
	let maxWeiCont = ETypeCont.Cont40 ? assumption.max_wei_cont_40 : assumption.max_wei_cont_20;

	if (source === ESource.Vietnam) {
		contCostVietnam =
			type === ETypeCont.Cont40 ? assumption.cont_40_cost_vn : assumption.cont_20_cost_vn;
		return contCostVietnam / Math.min(maxVolCont / (long * median * shortest), maxWeiCont / weight);
	}
	if (source === ESource.China) {
		contCostChina =
			type === ETypeCont.Cont40 ? assumption.cont_40_cost_china : assumption.cont_20_cost_china;
	}
	return contCostChina / Math.min(maxVolCont / long / median / shortest, maxWeiCont / weight);
};

export const calOperation = (
	assumption: IAssumption,
	long: number,
	median: number,
	shortest: number,
	weight: number
) => {
	return (
		(calY4AFulfillmentCost(assumption, long, median, shortest, weight) +
			calY4AStorageCost(assumption, long, median, shortest, weight)) *
		assumption.operation_vs_y4a
	);
};

export const calCompetitorBEP = (
	assumption: IAssumption,
	fob: number,
	suggested_duty: number,
	source: ESource, // "China" or "Vietnam"
	type: ETypeCont | "", //Type of Cont Shipping: "Cont 40" or "Cont 20"
	long: number,
	median: number,
	shortest: number,
	weight: number,
	period: string
) => {
	const { insurance, overhead_and_finance_cost, refund_and_chargeback, mkt_spend_vs_rrp_fba } =
		assumption;

	return (
		(calFOBandDuty(assumption, fob, suggested_duty) +
			calShipment(assumption, source, type, long, median, shortest, weight) +
			calOperation(assumption, long, median, shortest, weight) +
			calFBAFeeFulFillmentFee(long, median, shortest, weight) +
			calFBAFeeInventoryStorageMISF(period, long, median, shortest, weight)) /
		(1 -
			(insurance + overhead_and_finance_cost + refund_and_chargeback + mkt_spend_vs_rrp_fba + 0.15))
	);
};

export const calCMValueDIPrice = (
	channelCM: EChannel,
	rrp: number,
	percent_submit_to_amz_di: number,
	suggested_duty: number,
	fob: number,
	amz_refund_and_chargeback: number,
	percent_mkt_fee: number,
	assumption: IAssumption
) => {
	if (channelCM === EChannel.internal) {
		return (
			rrp * percent_submit_to_amz_di -
			suggested_duty * fob -
			fob -
			rrp * percent_submit_to_amz_di * assumption.y4a_insurance -
			rrp * percent_submit_to_amz_di * amz_refund_and_chargeback -
			rrp * percent_mkt_fee -
			rrp * percent_submit_to_amz_di * assumption.npd -
			rrp * percent_submit_to_amz_di * assumption.finance
		);
	}

	return (
		rrp * percent_submit_to_amz_di -
		suggested_duty * fob -
		fob -
		rrp * percent_submit_to_amz_di * assumption.y4a_insurance -
		rrp * percent_submit_to_amz_di * amz_refund_and_chargeback -
		rrp * percent_submit_to_amz_di * amz_refund_and_chargeback * 0.2 -
		rrp * percent_mkt_fee +
		0.5 * rrp * percent_submit_to_amz_di * amz_refund_and_chargeback
	);
};

export const calCMValueDSPrice = (
	channelCM: EChannel,
	rrp: number,
	percent_submit_to_amz_ds: number,
	suggested_duty: number,
	fob: number,
	assumption: IAssumption,
	amz_refund_and_chargeback: number,
	percent_mkt_fee: number,
	long: number,
	median: number,
	shortest: number,
	weight: number,
	source: ESource,
	type: ETypeCont | ""
) => {
	if (channelCM === EChannel.internal) {
		return (
			rrp * percent_submit_to_amz_ds -
			suggested_duty * fob -
			fob -
			rrp * percent_submit_to_amz_ds * assumption.y4a_insurance -
			rrp * percent_submit_to_amz_ds * amz_refund_and_chargeback -
			rrp * percent_mkt_fee -
			calY4ATransportCost(source, type, assumption, long, median, shortest, weight) -
			calY4AFulfillmentCost(assumption, long, median, shortest, weight) -
			calY4AStorageCost(assumption, long, median, shortest, weight) -
			rrp * percent_submit_to_amz_ds * assumption.amz_coop_fee -
			rrp * percent_submit_to_amz_ds * assumption.finance
		);
	}
	return (
		rrp * percent_submit_to_amz_ds -
		suggested_duty * fob -
		fob -
		rrp * percent_submit_to_amz_ds * assumption.y4a_insurance -
		rrp * percent_submit_to_amz_ds * amz_refund_and_chargeback -
		rrp * percent_submit_to_amz_ds * amz_refund_and_chargeback * 0.2 -
		rrp * percent_mkt_fee -
		calY4ATransportCost(source, type, assumption, long, median, shortest, weight) -
		rrp * percent_submit_to_amz_ds * assumption.amz_coop_fee +
		rrp * percent_submit_to_amz_ds * amz_refund_and_chargeback * 0.5
	);
};

export const calCMValueWHPrice = (
	channelCM: EChannel,
	rrp: number,
	percent_submit_to_amz_wh: number,
	suggested_duty: number,
	fob: number,
	assumption: IAssumption,
	amz_refund_and_chargeback: number,
	percent_mkt_fee: number,
	long: number,
	median: number,
	shortest: number,
	weight: number,
	source: ESource,
	type: ETypeCont | ""
) => {
	if (channelCM === EChannel.internal) {
		return (
			rrp * percent_submit_to_amz_wh -
			suggested_duty * fob -
			fob -
			rrp * percent_submit_to_amz_wh * assumption.y4a_insurance -
			rrp * percent_submit_to_amz_wh * amz_refund_and_chargeback -
			rrp * percent_mkt_fee -
			calY4ATransportCost(source, type, assumption, long, median, shortest, weight) -
			calY4AFulfillmentCost(assumption, long, median, shortest, weight) -
			calY4AStorageCost(assumption, long, median, shortest, weight) -
			rrp * percent_submit_to_amz_wh * assumption.amz_coop_fee -
			rrp * percent_submit_to_amz_wh * assumption.amz_freight_fee -
			rrp * percent_submit_to_amz_wh * assumption.finance
		);
	}
	return (
		rrp * percent_submit_to_amz_wh -
		suggested_duty * fob -
		fob -
		rrp * percent_submit_to_amz_wh * assumption.y4a_insurance -
		rrp * percent_submit_to_amz_wh * amz_refund_and_chargeback -
		rrp * percent_submit_to_amz_wh * amz_refund_and_chargeback * 0.2 -
		rrp * percent_mkt_fee -
		calY4ATransportCost(source, type, assumption, long, median, shortest, weight) -
		rrp * percent_submit_to_amz_wh * assumption.amz_coop_fee -
		rrp * percent_submit_to_amz_wh * assumption.amz_freight_fee +
		rrp * percent_submit_to_amz_wh * amz_refund_and_chargeback * 0.5
	);
};

export const calCMValueFBAPrice = (
	channelCM: EChannel,
	rrp: number,
	suggested_duty: number,
	fob: number,
	amz_refund_and_chargeback: number,
	percent_mkt_fee: number,
	assumption: IAssumption,
	long: number,
	median: number,
	shortest: number,
	weight: number,
	source: ESource,
	type: ETypeCont | "",
	period: string,
	price_discount: number
) => {
	if (channelCM === EChannel.internal) {
		return (
			rrp -
			suggested_duty * fob -
			fob -
			rrp * assumption.y4a_insurance -
			rrp * amz_refund_and_chargeback -
			rrp * percent_mkt_fee -
			calY4ATransportCost(source, type, assumption, long, median, shortest, weight) -
			calY4AFulfillmentCost(assumption, long, median, shortest, weight) -
			calY4AStorageCost(assumption, long, median, shortest, weight) -
			calReferralFee(rrp, assumption.referral_fba_fbm, price_discount) -
			calFBAFeeFulFillmentFee(long, median, shortest, weight) -
			calFBAFeeInventoryStorageMISF(period, long, median, shortest, weight) -
			calFBAFeeDIP(long, median, shortest, weight) -
			rrp * assumption.finance
		);
	}
	return (
		rrp * (1 - price_discount) -
		suggested_duty * fob -
		fob -
		rrp * (1 - price_discount) * assumption.y4a_insurance -
		rrp * (1 - price_discount) * amz_refund_and_chargeback -
		rrp * (1 - price_discount) * amz_refund_and_chargeback * 0.2 -
		rrp * percent_mkt_fee -
		calY4ATransportCost(source, type, assumption, long, median, shortest, weight) -
		calReferralFee(rrp, assumption.referral_fba_fbm, price_discount) -
		calFBAFeeFulFillmentFee(long, median, shortest, weight) -
		calFBAFeeInventoryStorageMISF(period, long, median, shortest, weight) -
		calFBAFeeDIP(long, median, shortest, weight) +
		rrp * (1 - price_discount) * amz_refund_and_chargeback * 0.5
	);
};

export const calCMMixChannel = (
	DI: number,
	DS: number,
	WH: number,
	FBA: number,
	mixDI: number,
	mixDS: number,
	mixWH: number,
	mixFBA: number
) => {
	return DI * mixDI + DS * mixDS + WH * mixWH + FBA * mixFBA;
};

export const calDIPercent = (
	cMValueDIPrice: number,
	rrp: number,
	percent_submit_to_amz_di: number
) => {
	return cMValueDIPrice / (rrp * percent_submit_to_amz_di);
};

export const calDSPercent = (
	cMValueDSPrice: number,
	rrp: number,
	percent_submit_to_amz_ds: number
) => {
	return cMValueDSPrice / (rrp * percent_submit_to_amz_ds);
};

export const calWHPercent = (
	cMValueWHPrice: number,
	rrp: number,
	percent_submit_to_amz_wh: number
) => {
	return cMValueWHPrice / (rrp * percent_submit_to_amz_wh);
};

export const calFBAPercent = (
	channelCM: EChannel,
	cMValueFBAPrice: number,
	rrp: number,
	price_discount: number
) => {
	if (channelCM === EChannel.internal) {
		return cMValueFBAPrice / rrp;
	}
	return cMValueFBAPrice / (rrp * (1 - price_discount));
};

export const calCMPercentMixChannel = (
	DI: number,
	DS: number,
	WH: number,
	FBA: number,
	mixDI: number,
	mixDS: number,
	mixWH: number,
	mixFBA: number,
	percent_submit_to_amz_di: number,
	percent_submit_to_amz_ds: number,
	percent_submit_to_amz_wh: number,
	rrp: number
) => {
	return (
		calCMMixChannel(DI, DS, WH, FBA, mixDI, mixDS, mixWH, mixFBA) /
		(mixDI * percent_submit_to_amz_di * rrp +
			percent_submit_to_amz_ds * mixDS * rrp +
			percent_submit_to_amz_wh * mixWH * rrp +
			mixFBA * rrp)
	);
};

export const calNetProfitDI = (
	assumption: IAssumption,
	DI: number,
	rrp: number,
	percent_submit_to_amz_di: number
) => {
	return DI - assumption.y4a_overhead - rrp * percent_submit_to_amz_di * assumption.amz_sas_fee;
};

export const calNetProfitDS = (
	assumption: IAssumption,
	DS: number,
	rrp: number,
	percent_submit_to_amz_ds: number
) => {
	return DS - assumption.y4a_overhead - rrp * percent_submit_to_amz_ds * assumption.amz_sas_fee;
};

export const calNetProfitWH = (
	assumption: IAssumption,
	WH: number,
	rrp: number,
	percent_submit_to_amz_wh: number
) => {
	return WH - assumption.y4a_overhead - rrp * percent_submit_to_amz_wh * assumption.amz_sas_fee;
};

export const calNetProfitFBA = (assumption: IAssumption, FBA: number) => {
	return FBA - assumption.y4a_overhead;
};

export const calNetProfitMixChannel = (
	netDI: number,
	netDS: number,
	netWH: number,
	netFBA: number,
	mixDI: number,
	mixDS: number,
	mixWH: number,
	mixFBA: number
) => {
	return netDI * mixDI + netDS * mixDS + netWH * mixWH + netFBA * mixFBA;
};

export const calNetPPMDI = (
	assumption: IAssumption,
	rrp: number,
	price_discount: number,
	percent_submit_to_amz_di: number
) => {
	//($Q$5-$G$19*$Q$5)-$G$9*$Q$5+$B$43+$B$44+$B$45 +$G$19*$Q$5
	return (
		rrp -
		price_discount * rrp -
		percent_submit_to_amz_di * rrp +
		assumption.net_ppm_assumption_1 +
		assumption.net_ppm_assumption_2 +
		assumption.net_ppm_assumption_3 +
		price_discount * rrp
	);
};

export const calNetPPMDS = (
	assumption: IAssumption,
	rrp: number,
	price_discount: number,
	percent_submit_to_amz_ds: number
) => {
	//($Q$5-$G$19*$Q$5) - $G$10*$Q$5 + $B$15*$G$10*$Q$5 + $G$19*$Q$5 + $B$43 + $B$44 + $B$45

	return (
		rrp -
		price_discount * rrp -
		percent_submit_to_amz_ds * rrp +
		assumption.amz_coop_fee * percent_submit_to_amz_ds * rrp +
		price_discount * rrp +
		assumption.net_ppm_assumption_1 +
		assumption.net_ppm_assumption_2 +
		assumption.net_ppm_assumption_3
	);
};

export const calNetPPMWH = (
	assumption: IAssumption,
	rrp: number,
	price_discount: number,
	percent_submit_to_amz_wh: number
) => {
	//($Q$5-$G$19*$Q$5) - $G$11*$Q$5 + ($B$15+$B$16)*$G$11*$Q$5 + $G$19*$Q$5

	return (
		rrp -
		price_discount * rrp -
		percent_submit_to_amz_wh * rrp +
		(assumption.amz_coop_fee + assumption.amz_freight_fee) * percent_submit_to_amz_wh * rrp +
		price_discount * rrp
	);
};

export const calNetPPMChannelMix = (
	assumption: IAssumption,
	mixDI: number,
	mixDS: number,
	mixWH: number,
	netPPMDI: number,
	netPPMDS: number,
	netPPMWH: number
) => {
	//($G$20/sum($G$20:$G$22))*$Q$45 + ($G$21/sum($G$20:$G$22))*$Q$46 + ($G$22/sum($G$20:$G$22))*$Q$47 + $B$43 + $B$44 + $B$45

	return (
		(mixDI / (mixDI + mixDS + mixWH)) * netPPMDI +
		(mixDS / (mixDI + mixDS + mixWH)) * netPPMDS +
		(mixWH / (mixDI + mixDS + mixWH)) * netPPMWH +
		assumption.net_ppm_assumption_1 +
		assumption.net_ppm_assumption_2 +
		assumption.net_ppm_assumption_3
	);
};

export const calNetPPMDIPercent = (rrp: number, price_discount: number, netPPMDI: number) => {
	return netPPMDI / (rrp - rrp * price_discount);
};

export const calNetPPMDSPercent = (rrp: number, price_discount: number, netPPMDS: number) => {
	return netPPMDS / (rrp - rrp * price_discount);
};

export const calNetPPMWHPercent = (rrp: number, price_discount: number, netPPMWH: number) => {
	return netPPMWH / (rrp - rrp * price_discount);
};

export const calNetPPMChannelMixPercent = (
	rrp: number,
	price_discount: number,
	netPPMChannelMix: number
) => {
	return netPPMChannelMix / (rrp - rrp * price_discount);
};
export const calculator = (
	assumption,
	rrp,
	fob,
	longest_side,
	median_side,
	shortest_side,
	weight,
	filter
) => {
	if (rrp && fob && longest_side && median_side && shortest_side && weight) {
		const {
			percent_price_discount,
			percent_submit_to_amz_di,
			percent_submit_to_amz_ds,
			percent_submit_to_amz_wh,
			amz_refund_and_chargeback,
			percent_mkt_fee,
			suggested_duty,
			product_source,
			type_of_cont_shipping,
			period,
			mix_channel_di,
			mix_channel_ds,
			mix_channel_wh,
			mix_channel_fba,
		} = filter;

		return {
			inputs: filter,
			isViewResult: true,
			competitor_bep: calCompetitorBEP(
				assumption,
				fob,
				suggested_duty,
				product_source,
				type_of_cont_shipping,
				longest_side,
				median_side,
				shortest_side,
				weight,
				period
			),
			cm_in_di: calCMValueDIPrice(
				EChannel.internal,
				rrp,
				percent_submit_to_amz_di,
				suggested_duty,
				fob,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				assumption
			),
			cm_in_ds: calCMValueDSPrice(
				EChannel.internal,
				rrp,
				percent_submit_to_amz_ds,
				suggested_duty,
				fob,
				assumption,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				longest_side,
				median_side,
				shortest_side,
				weight,
				product_source,
				type_of_cont_shipping
			),
			cm_in_wh: calCMValueWHPrice(
				EChannel.internal,
				rrp,
				percent_submit_to_amz_wh,
				suggested_duty,
				fob,
				assumption,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				longest_side,
				median_side,
				shortest_side,
				weight,
				product_source,
				type_of_cont_shipping
			),
			cm_in_fba: calCMValueFBAPrice(
				EChannel.internal,
				rrp,
				suggested_duty,
				fob,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				assumption,
				longest_side,
				median_side,
				shortest_side,
				weight,
				product_source,
				type_of_cont_shipping,
				period,
				percent_price_discount
			),
			cm_in_mix_channel: calCMMixChannel(
				calCMValueDIPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				calCMValueDSPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueWHPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueFBAPrice(
					EChannel.internal,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				),
				mix_channel_di,
				mix_channel_ds,
				mix_channel_wh,
				mix_channel_fba
			),
			cm_in_percent_di: calDIPercent(
				calCMValueDIPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				rrp,
				percent_submit_to_amz_di
			),
			cm_in_percent_ds: calDSPercent(
				calCMValueDSPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				rrp,
				percent_submit_to_amz_ds
			),
			cm_in_percent_wh: calWHPercent(
				calCMValueWHPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				rrp,
				percent_submit_to_amz_wh
			),
			cm_in_percent_fba: calFBAPercent(
				EChannel.internal,
				calCMValueFBAPrice(
					EChannel.internal,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				),
				rrp,
				percent_price_discount
			),
			cm_in_percent_mix_channel: calCMPercentMixChannel(
				calCMValueDIPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				calCMValueDSPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueWHPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueFBAPrice(
					EChannel.internal,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				),
				mix_channel_di,
				mix_channel_ds,
				mix_channel_wh,
				mix_channel_fba,
				percent_submit_to_amz_di,
				percent_submit_to_amz_ds,
				percent_submit_to_amz_wh,
				rrp
			),
			cm_ex_di: calCMValueDIPrice(
				EChannel.external,
				rrp,
				percent_submit_to_amz_di,
				suggested_duty,
				fob,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				assumption
			),
			cm_ex_ds: calCMValueDSPrice(
				EChannel.external,
				rrp,
				percent_submit_to_amz_ds,
				suggested_duty,
				fob,
				assumption,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				longest_side,
				median_side,
				shortest_side,
				weight,
				product_source,
				type_of_cont_shipping
			),
			cm_ex_wh: calCMValueWHPrice(
				EChannel.external,
				rrp,
				percent_submit_to_amz_wh,
				suggested_duty,
				fob,
				assumption,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				longest_side,
				median_side,
				shortest_side,
				weight,
				product_source,
				type_of_cont_shipping
			),
			cm_ex_fba: calCMValueFBAPrice(
				EChannel.external,
				rrp,
				suggested_duty,
				fob,
				amz_refund_and_chargeback,
				percent_mkt_fee,
				assumption,
				longest_side,
				median_side,
				shortest_side,
				weight,
				product_source,
				type_of_cont_shipping,
				period,
				percent_price_discount
			),
			cm_ex_mix_channel: calCMMixChannel(
				calCMValueDIPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				calCMValueDSPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueWHPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueFBAPrice(
					EChannel.external,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				),
				mix_channel_di,
				mix_channel_ds,
				mix_channel_wh,
				mix_channel_fba
			),
			cm_ex_percent_di: calDIPercent(
				calCMValueDIPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				rrp,
				percent_submit_to_amz_di
			),
			cm_ex_percent_ds: calDSPercent(
				calCMValueDSPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				rrp,
				percent_submit_to_amz_ds
			),
			cm_ex_percent_wh: calWHPercent(
				calCMValueWHPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				rrp,
				percent_submit_to_amz_wh
			),
			cm_ex_percent_fba: calFBAPercent(
				EChannel.external,
				calCMValueFBAPrice(
					EChannel.external,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				),
				rrp,
				percent_price_discount
			),
			cm_ex_percent_mix_channel: calCMPercentMixChannel(
				calCMValueDIPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				calCMValueDSPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueWHPrice(
					EChannel.external,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				calCMValueFBAPrice(
					EChannel.external,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				),
				mix_channel_di,
				mix_channel_ds,
				mix_channel_wh,
				mix_channel_fba,
				percent_submit_to_amz_di,
				percent_submit_to_amz_ds,
				percent_submit_to_amz_wh,
				rrp
			),
			net_profit_di: calNetProfitDI(
				assumption,
				calCMValueDIPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_di,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption
				),
				rrp,
				percent_submit_to_amz_di
			),
			net_profit_ds: calNetProfitDS(
				assumption,
				calCMValueDSPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_ds,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				rrp,
				percent_submit_to_amz_ds
			),
			net_profit_wh: calNetProfitWH(
				assumption,
				calCMValueWHPrice(
					EChannel.internal,
					rrp,
					percent_submit_to_amz_wh,
					suggested_duty,
					fob,
					assumption,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping
				),
				rrp,
				percent_submit_to_amz_wh
			),
			net_profit_fba: calNetProfitFBA(
				assumption,
				calCMValueFBAPrice(
					EChannel.internal,
					rrp,
					suggested_duty,
					fob,
					amz_refund_and_chargeback,
					percent_mkt_fee,
					assumption,
					longest_side,
					median_side,
					shortest_side,
					weight,
					product_source,
					type_of_cont_shipping,
					period,
					percent_price_discount
				)
			),
			net_profit_mix_channel: calNetProfitMixChannel(
				calNetProfitDI(
					assumption,
					calCMValueDIPrice(
						EChannel.internal,
						rrp,
						percent_submit_to_amz_di,
						suggested_duty,
						fob,
						amz_refund_and_chargeback,
						percent_mkt_fee,
						assumption
					),
					rrp,
					percent_submit_to_amz_di
				),
				calNetProfitDS(
					assumption,
					calCMValueDSPrice(
						EChannel.internal,
						rrp,
						percent_submit_to_amz_ds,
						suggested_duty,
						fob,
						assumption,
						amz_refund_and_chargeback,
						percent_mkt_fee,
						longest_side,
						median_side,
						shortest_side,
						weight,
						product_source,
						type_of_cont_shipping
					),
					rrp,
					percent_submit_to_amz_ds
				),
				calNetProfitWH(
					assumption,
					calCMValueWHPrice(
						EChannel.internal,
						rrp,
						percent_submit_to_amz_wh,
						suggested_duty,
						fob,
						assumption,
						amz_refund_and_chargeback,
						percent_mkt_fee,
						longest_side,
						median_side,
						shortest_side,
						weight,
						product_source,
						type_of_cont_shipping
					),
					rrp,
					percent_submit_to_amz_wh
				),
				calNetProfitFBA(
					assumption,
					calCMValueFBAPrice(
						EChannel.internal,
						rrp,
						suggested_duty,
						fob,
						amz_refund_and_chargeback,
						percent_mkt_fee,
						assumption,
						longest_side,
						median_side,
						shortest_side,
						weight,
						product_source,
						type_of_cont_shipping,
						period,
						percent_price_discount
					)
				),
				mix_channel_di,
				mix_channel_ds,
				mix_channel_wh,
				mix_channel_fba
			),
			net_ppm_di: calNetPPMDI(assumption, rrp, percent_price_discount, percent_submit_to_amz_di),
			net_ppm_ds: calNetPPMDS(assumption, rrp, percent_price_discount, percent_submit_to_amz_ds),
			net_ppm_wh: calNetPPMWH(assumption, rrp, percent_price_discount, percent_submit_to_amz_wh),
			net_ppm_mix_channel: calNetPPMChannelMix(
				assumption,
				mix_channel_di,
				mix_channel_ds,
				mix_channel_wh,
				calNetPPMDI(assumption, rrp, percent_price_discount, percent_submit_to_amz_di),
				calNetPPMDS(assumption, rrp, percent_price_discount, percent_submit_to_amz_ds),
				calNetPPMWH(assumption, rrp, percent_price_discount, percent_submit_to_amz_wh)
			),
			net_ppm_percent_di: calNetPPMDIPercent(
				rrp,
				percent_price_discount,
				calNetPPMDI(assumption, rrp, percent_price_discount, percent_submit_to_amz_di)
			),
			net_ppm_percent_ds: calNetPPMDSPercent(
				rrp,
				percent_price_discount,
				calNetPPMDS(assumption, rrp, percent_price_discount, percent_submit_to_amz_ds)
			),
			net_ppm_percent_wh: calNetPPMWHPercent(
				rrp,
				percent_price_discount,
				calNetPPMWH(assumption, rrp, percent_price_discount, percent_submit_to_amz_wh)
			),
			net_ppm_percent_mix_channel: calNetPPMWHPercent(
				rrp,
				percent_price_discount,
				calNetPPMChannelMix(
					assumption,
					mix_channel_di,
					mix_channel_ds,
					mix_channel_wh,
					calNetPPMDI(assumption, rrp, percent_price_discount, percent_submit_to_amz_di),
					calNetPPMDS(assumption, rrp, percent_price_discount, percent_submit_to_amz_ds),
					calNetPPMWH(assumption, rrp, percent_price_discount, percent_submit_to_amz_wh)
				)
			),
		};
	}
	return {};
};
