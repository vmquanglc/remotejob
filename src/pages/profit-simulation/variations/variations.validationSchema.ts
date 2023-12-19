import { isNumber } from "lodash";
import * as Yup from "yup";

export const SCHEMA_PS = Yup.object({
	percent_submit_to_amz_di: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	percent_submit_to_amz_ds: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	percent_submit_to_amz_wh: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	amz_refund_and_chargeback: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	mix_channel_di: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.test("validate-mix_channel_di", `Sum channel mix equals to 100%`, function (item) {
			const { mix_channel_ds, mix_channel_wh, mix_channel_fba } = this.parent;
			if (!isNumber(mix_channel_ds) || !isNumber(mix_channel_wh) || !isNumber(mix_channel_fba))
				return false;
			return 1 - (mix_channel_ds + mix_channel_wh + mix_channel_fba + item) === 0;
		}),
	mix_channel_ds: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.test("validate-mix_channel_ds", `Sum channel mix equals to 100%`, function (item) {
			const { mix_channel_di, mix_channel_wh, mix_channel_fba } = this.parent;
			if (!isNumber(mix_channel_di) || !isNumber(mix_channel_wh) || !isNumber(mix_channel_fba))
				return false;
			return 1 - (mix_channel_di + mix_channel_wh + mix_channel_fba + item) === 0;
		}),
	mix_channel_wh: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.test("validate-mix_channel_wh", `Sum channel mix equals to 100%`, function (item) {
			const { mix_channel_di, mix_channel_ds, mix_channel_fba } = this.parent;
			if (!isNumber(mix_channel_di) || !isNumber(mix_channel_ds) || !isNumber(mix_channel_fba))
				return false;
			return 1 - (mix_channel_di + mix_channel_ds + mix_channel_fba + item) === 0;
		}),
	mix_channel_fba: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.test("validate-mix_channel_fba", `Sum channel mix equals to 100%`, function (item) {
			const { mix_channel_di, mix_channel_ds, mix_channel_wh } = this.parent;
			if (!isNumber(mix_channel_di) || !isNumber(mix_channel_ds) || !isNumber(mix_channel_wh))
				return false;
			return 1 - (mix_channel_di + mix_channel_ds + mix_channel_wh + item) === 0;
		}),
	percent_mkt_fee: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	percent_price_discount: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	period: Yup.string().required("Field is required"),
	product_source: Yup.string().required("Field is required"),
	category: Yup.string().required("Field is required"),
	suggested_duty: Yup.number()
		.typeError("Please type valid value")
		.min(0, "Must >= 0")
		.max(1, "Must <= 100")
		.required("Field is required"),
	type_of_cont_shipping: Yup.string().required("Field is required"),
});
