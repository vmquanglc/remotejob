import { Grid, InputAdornment, Paper, TextField, Typography, Button } from "@mui/material";
import { useFormik } from "formik";
import React, { FC, useCallback, useEffect } from "react";
import { IAssumption } from "src/interface/profitSimulation.interface";
import { initialAssumption } from "src/utils/profit-simulation/formulaPS";
import { NumericFormat } from "react-number-format";
import { capitalize, get } from "lodash";
import { toastOptions } from "src/components/toast/toast.options";
import { updateAssumption } from "src/services/profit-simulation/profit.services";
import { useMutation } from "react-query";
import { SCHEMA_ASSUMPTION } from "./assumption.validateSchema";
import { ButtonLoading } from "src/components/button-loading";

interface IProps {
	assumption?: IAssumption;
	isEditing?: boolean;
	isView?: boolean;
	setEditing?: (value?: any) => void;
	refetch?: (value?: any) => void;
}

export const DetailAssumptions: FC<IProps> = ({
	assumption,
	isEditing = false,
	isView = false,
	setEditing,
	refetch,
}) => {
	const formik: any = useFormik({
		initialValues: {
			...initialAssumption,
			...assumption,
		},
		validationSchema: SCHEMA_ASSUMPTION,
		onSubmit: (value) => {
			hasDifferentValue(assumption, value) &&
				onUpdate({
					code: "yes4all",
					data: value,
				});
		},
	});
	const getPropsInput = useCallback(
		(key) => {
			return {
				style: {
					color: isView
						? Number(formik?.values?.[key]) !== Number(formik?.values?.previous?.[key])
							? "#D60000"
							: "inherit"
						: "inherit",
					WebkitTextFillColor: isView
						? Number(formik?.values?.[key]) !== Number(formik?.values?.previous?.[key])
							? "#D60000"
							: "inherit"
						: "inherit",
				},
			};
		},
		[formik]
	);

	const { mutate: onUpdate, isLoading: isUpdating } = useMutation(async (data: any) => {
		try {
			const response: any = await updateAssumption(data);
			if (response?.status !== 200) {
				toastOptions("error", "Save error");
				setEditing(false);
				return false;
			} else {
				toastOptions("success", "Save success");
				refetch && refetch();
				setEditing(false);
				return true;
			}
		} catch (error) {
			toastOptions("error", "Save error");
			setEditing(false);
			return false;
		}
	});
	const value = (formik: any, field: string) => get(formik, `values[${field}]`);
	const touched = (formik: any, field: string) => get(formik, `touched[${field}]`);
	const error = (formik: any, field: string) => get(formik, `errors[${field}]`);

	useEffect(() => {
		formik.setValues({
			...formik.values,
			...assumption,
		});
	}, [assumption]);

	const getValidate = ({ formik, field, required = false }): any => {
		let result: any = {
			onBlur: formik.handleBlur,
			onValueChange: (values: any) => {
				formik.setFieldValue(field, values?.floatValue || NaN);
			},
			value: value(formik, field),
		};

		if (required) {
			result.error = touched(formik, field) && Boolean(error(formik, field));
			result.helperText =
				touched(formik, field) && error(formik, field) && get(formik, `errors[${field}]`);
		}

		return result;
	};

	const hasDifferentValue = (obj1, obj2) => {
		const keys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
		for (const key of keys) {
			if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
				if (obj1[key]?.toString() !== obj2[key]?.toString()) {
					return true;
				}
			} else if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
				return true;
			}
		}
		return false;
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Paper sx={{ p: 2, mb: 2 }}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12} sm={8}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12} sm={6}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography
											variant="body1"
											sx={{
												fontWeight: "700",
												lineHeight: "24px",
											}}
										>
											Cont Cost (monthly update)
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("cont_40_cost_china"),
											}}
											label="Cont 40 Cost - China"
											variant="outlined"
											fullWidth
											size="small"
											name="cont_40_cost_china"
											thousandSeparator=","
											customInput={TextField}
											prefix="$ "
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "cont_40_cost_china",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("cont_20_cost_china"),
											}}
											label="Cont 20 Cost - China"
											variant="outlined"
											fullWidth
											size="small"
											name="cont_20_cost_china"
											thousandSeparator=","
											customInput={TextField}
											prefix="$ "
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "cont_20_cost_china",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("cont_40_cost_vn"),
											}}
											label="Cont 40 Cost - Vietnam"
											variant="outlined"
											fullWidth
											size="small"
											name="cont_40_cost_vn"
											thousandSeparator=","
											customInput={TextField}
											prefix="$ "
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "cont_40_cost_vn",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("cont_20_cost_vn"),
											}}
											label="Cont 20 Cost - Vietnam"
											variant="outlined"
											fullWidth
											size="small"
											name="cont_20_cost_vn"
											thousandSeparator=","
											customInput={TextField}
											prefix="$ "
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "cont_20_cost_vn",
												required: true,
											})}
										/>
									</Grid>
								</Grid>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography
											variant="body1"
											sx={{
												fontWeight: "700",
												lineHeight: "24px",
												mt: { xs: 0, sm: 2 },
											}}
										>
											Competitor Assumption
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("fob_vs_y4a"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Competitor FOB vs Y4A"
											variant="outlined"
											fullWidth
											size="small"
											name="fob_vs_y4a"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "fob_vs_y4a",
												required: true,
											})}
											value={formik.values.fob_vs_y4a * 100}
											onValueChange={(values) => {
												formik.setFieldValue("fob_vs_y4a", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("operation_vs_y4a"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Competitor Operation vs Y4A"
											variant="outlined"
											fullWidth
											size="small"
											name="operation_vs_y4a"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "operation_vs_y4a",
												required: true,
											})}
											value={formik.values.operation_vs_y4a * 100}
											onValueChange={(values) => {
												formik.setFieldValue("operation_vs_y4a", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("insurance"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Competitor Insurance"
											variant="outlined"
											fullWidth
											size="small"
											name="insurance"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "insurance",
												required: true,
											})}
											value={formik.values.insurance * 100}
											onValueChange={(values) => {
												formik.setFieldValue("insurance", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("overhead_and_finance_cost"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Competitor Overhead + Finance Cost"
											variant="outlined"
											fullWidth
											size="small"
											name="overhead_and_finance_cost"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "overhead_and_finance_cost",
												required: true,
											})}
											value={formik.values.overhead_and_finance_cost * 100}
											onValueChange={(values) => {
												formik.setFieldValue("overhead_and_finance_cost", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("refund_and_chargeback"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Return value"
											variant="outlined"
											fullWidth
											size="small"
											name="refund_and_chargeback"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "refund_and_chargeback",
												required: true,
											})}
											value={formik.values.refund_and_chargeback * 100}
											onValueChange={(values) => {
												formik.setFieldValue("refund_and_chargeback", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("mkt_spend_vs_rrp_fba"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Competitor MKT Spend vs RRP - FBA"
											variant="outlined"
											fullWidth
											size="small"
											name="mkt_spend_vs_rrp_fba"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "mkt_spend_vs_rrp_fba",
												required: true,
											})}
											value={formik.values.mkt_spend_vs_rrp_fba * 100}
											onValueChange={(values) => {
												formik.setFieldValue("mkt_spend_vs_rrp_fba", values?.floatValue / 100);
											}}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography
											variant="body1"
											sx={{
												fontWeight: "700",
												lineHeight: "24px",
											}}
										>
											Operation Assumption
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("finance"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="%Finance Cost"
											variant="outlined"
											fullWidth
											size="small"
											name="finance"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "finance",
												required: true,
											})}
											value={formik.values.finance * 100}
											onValueChange={(values) => {
												formik.setFieldValue("finance", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("y4a_insurance"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Y4A Product Liability Insurance"
											variant="outlined"
											fullWidth
											size="small"
											name="y4a_insurance"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "y4a_insurance",
												required: true,
											})}
											value={formik.values.y4a_insurance * 100}
											onValueChange={(values) => {
												formik.setFieldValue("y4a_insurance", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("y4a_overhead"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Y4A Overhead"
											variant="outlined"
											fullWidth
											size="small"
											name="y4a_overhead"
											customInput={TextField}
											prefix="$ "
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "y4a_overhead",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("npd"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="NPD"
											variant="outlined"
											fullWidth
											size="small"
											name="npd"
											customInput={TextField}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "npd",
												required: true,
											})}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("amz_sas_fee"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="AMZ SAS Fee"
											variant="outlined"
											fullWidth
											size="small"
											name="amz_sas_fee"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "amz_sas_fee",
												required: true,
											})}
											value={formik.values.amz_sas_fee * 100}
											onValueChange={(values) => {
												formik.setFieldValue("amz_sas_fee", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("amz_coop_fee"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="AMZ COOP Fee"
											variant="outlined"
											fullWidth
											size="small"
											name="amz_coop_fee"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "amz_coop_fee",
												required: true,
											})}
											value={formik.values.amz_coop_fee * 100}
											onValueChange={(values) => {
												formik.setFieldValue("amz_coop_fee", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("amz_freight_fee"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="AMZ Freight Fee"
											variant="outlined"
											fullWidth
											size="small"
											name="amz_freight_fee"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "amz_freight_fee",
												required: true,
											})}
											value={formik.values.amz_freight_fee * 100}
											onValueChange={(values) => {
												formik.setFieldValue("amz_freight_fee", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("referral_fba_fbm"),
											}}
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											label="Referral Fee for FBA/FBM"
											variant="outlined"
											fullWidth
											size="small"
											name="referral_fba_fbm"
											customInput={TextField}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "referral_fba_fbm",
												required: true,
											})}
											value={formik.values.referral_fba_fbm * 100}
											onValueChange={(values) => {
												formik.setFieldValue("referral_fba_fbm", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<Typography
											variant="body1"
											sx={{
												fontWeight: "700",
												lineHeight: "24px",
											}}
										>
											Net PPM assumption
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("net_ppm_assumption_1"),
											}}
											allowNegative={false}
											fixedDecimalScale
											decimalScale={2}
											label="Net PPM assumption 1"
											variant="outlined"
											fullWidth
											size="small"
											name="net_ppm_assumption_1"
											customInput={TextField}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "net_ppm_assumption_1",
												required: true,
											})}
											value={formik.values.net_ppm_assumption_1}
											onValueChange={(values) => {
												formik.setFieldValue("net_ppm_assumption_1", values?.floatValue);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("net_ppm_assumption_2"),
											}}
											allowNegative={false}
											fixedDecimalScale
											decimalScale={2}
											label="Net PPM assumption 2"
											variant="outlined"
											fullWidth
											size="small"
											name="net_ppm_assumption_2"
											customInput={TextField}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "net_ppm_assumption_2",
												required: true,
											})}
											value={formik.values.net_ppm_assumption_2}
											onValueChange={(values) => {
												formik.setFieldValue("net_ppm_assumption_2", values?.floatValue);
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<NumericFormat
											valueIsNumericString
											inputProps={{
												...getPropsInput("net_ppm_assumption_3"),
											}}
											allowNegative={false}
											fixedDecimalScale
											decimalScale={2}
											label="Net PPM assumption 3"
											variant="outlined"
											fullWidth
											size="small"
											name="net_ppm_assumption_3"
											customInput={TextField}
											disabled={!isEditing || isUpdating}
											{...getValidate({
												formik,
												field: "net_ppm_assumption_3",
												required: true,
											})}
											value={formik.values.net_ppm_assumption_3}
											onValueChange={(values) => {
												formik.setFieldValue("net_ppm_assumption_3", values?.floatValue);
											}}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={12} sm={4}>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12}>
								<Typography
									variant="body1"
									sx={{
										fontWeight: "700",
										lineHeight: "24px",
									}}
								>
									Logistics Assumption
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("max_vol_cont_40"),
									}}
									allowNegative={false}
									decimalScale={0}
									label="Max Volume Cont 40 (inch3)"
									variant="outlined"
									fullWidth
									size="small"
									name="max_vol_cont_40"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "max_vol_cont_40",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("max_vol_cont_20"),
									}}
									allowNegative={false}
									decimalScale={0}
									label="Max Volume Cont 20 (inch3)"
									variant="outlined"
									fullWidth
									size="small"
									name="max_vol_cont_20"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "max_vol_cont_20",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("max_wei_cont_40"),
									}}
									allowNegative={false}
									decimalScale={0}
									label="Max Weight Cont 40 (lb)"
									variant="outlined"
									fullWidth
									size="small"
									name="max_wei_cont_40"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "max_wei_cont_40",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("max_wei_cont_20"),
									}}
									allowNegative={false}
									decimalScale={0}
									label="Max Weight Cont 20 (lb)"
									variant="outlined"
									fullWidth
									size="small"
									name="max_wei_cont_20"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "max_wei_cont_20",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("y4a_operation_vs_amz_misf"),
									}}
									allowNegative={false}
									fixedDecimalScale
									decimalScale={2}
									label="Y4A operation vs AMZ MISF (times)"
									variant="outlined"
									fullWidth
									size="small"
									name="y4a_operation_vs_amz_misf"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "y4a_operation_vs_amz_misf",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("fulfillment_cost"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Fulfillment Cost in Y4A WH/month"
									variant="outlined"
									fullWidth
									size="small"
									name="fulfillment_cost"
									thousandSeparator=","
									prefix="$ "
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "fulfillment_cost",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("fulfillment_max_vol"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Fulfillment maximum volumn (inch3)"
									variant="outlined"
									fullWidth
									size="small"
									name="fulfillment_max_vol"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "fulfillment_max_vol",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("fulfillment_max_wei"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Fulfillment maximum weight (lbs)"
									variant="outlined"
									fullWidth
									size="small"
									name="fulfillment_max_wei"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "fulfillment_max_wei",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("storage_cost"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Storage Cost of Y4A/month"
									variant="outlined"
									fullWidth
									size="small"
									name="storage_cost"
									thousandSeparator=","
									prefix="$ "
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "storage_cost",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("storage_max_vol"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Storage maximum volumn (inch3)"
									variant="outlined"
									fullWidth
									size="small"
									name="storage_max_vol"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "storage_max_vol",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("storage_max_wei"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Storage maximum weight (lbs)"
									variant="outlined"
									fullWidth
									size="small"
									name="storage_max_wei"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "storage_max_wei",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("storage_month"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="Storage month"
									variant="outlined"
									fullWidth
									size="small"
									name="storage_month"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "storage_month",
										required: true,
									})}
								/>
							</Grid>
							<Grid item xs={12}>
								<NumericFormat
									valueIsNumericString
									inputProps={{
										...getPropsInput("no_of_depreciation_year"),
									}}
									allowNegative={false}
									decimalScale={2}
									fixedDecimalScale
									label="No of Depreciation Year"
									variant="outlined"
									fullWidth
									size="small"
									name="no_of_depreciation_year"
									thousandSeparator=","
									customInput={TextField}
									disabled={!isEditing || isUpdating}
									{...getValidate({
										formik,
										field: "no_of_depreciation_year",
										required: true,
									})}
								/>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
			{isEditing && (
				<Grid item xs={12}>
					<ButtonLoading
						loading={isUpdating}
						type="submit"
						size="small"
						variant="contained"
						disabled={!hasDifferentValue(assumption, formik.values)}
						sx={{ mr: { xs: 1, sm: 2 } }}
					>
						Save
					</ButtonLoading>
					<Button
						type="button"
						size="small"
						variant="outlined"
						sx={{ mr: { xs: 1, sm: 2 } }}
						onClick={() => {
							setEditing && setEditing(false);
							formik.setValues({
								...initialAssumption,
								...assumption,
							});
						}}
					>
						Cancel
					</Button>
				</Grid>
			)}
		</form>
	);
};
