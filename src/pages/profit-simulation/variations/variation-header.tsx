import React, { useEffect, FC, useState } from "react";
import {
	Grid,
	Typography,
	TextField,
	InputAdornment,
	MenuItem,
	FormHelperText,
	FormGroup,
	Collapse,
	Button,
	Stack,
	Select,
	Box,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import { getValidateFormik } from "src/utils/formik";
import { get, isNumber, map } from "lodash";
import { ETypeCont, IAssumption, IInputs } from "src/interface/profitSimulation.interface";
import { useFormik } from "formik";
import { SCHEMA_PS } from "./variations.validationSchema";
import { rounded } from "src/utils/profit-simulation/formulaPS";
import { NumericFormat } from "react-number-format";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { DEFAULT_FILTER } from "src/constants/profitSimulation.constant";
import { ToolTip } from "src/components/tooltip";

interface IProps {
	getInputs: (value: IInputs) => void;
	suggestDuty: IAssumption;
	inputs?: any;
	isView?: boolean;
	isLoading?: boolean;
	row?: number;
	setRow?: (value: number) => void;
	lengthRows: number;
}

export const VariationHeader: FC<IProps> = ({
	getInputs,
	suggestDuty,
	inputs,
	isView = false,
	isLoading = false,
	row,
	setRow,
	lengthRows = 10,
}) => {
	const formik = useFormik({
		initialValues: {
			...DEFAULT_FILTER,
			...inputs,
		},
		validationSchema: SCHEMA_PS,
		onSubmit: (value) => {
			getInputs({
				percent_submit_to_amz_di: +value.percent_submit_to_amz_di,
				percent_submit_to_amz_ds: +value.percent_submit_to_amz_ds,
				percent_submit_to_amz_wh: +value.percent_submit_to_amz_wh,
				amz_refund_and_chargeback: +value.amz_refund_and_chargeback,
				mix_channel_di: +value.mix_channel_di,
				mix_channel_ds: +value.mix_channel_ds,
				mix_channel_wh: +value.mix_channel_wh,
				mix_channel_fba: +value.mix_channel_fba,
				percent_mkt_fee: +value.percent_mkt_fee,
				percent_price_discount: +value.percent_price_discount,
				period: value.period,
				product_source: value.product_source,
				category: value.category,
				suggested_duty: +value.suggested_duty,
				type_of_cont_shipping: value.type_of_cont_shipping,
			});
		},
	});

	const [checked, setChecked] = useState<boolean>(true);

	useEffect(() => {
		formik.setValues({
			...formik.values,
			...inputs,
		});
	}, [inputs]);

	const helpTextMixChannel = (formik) => {
		let helpText =
			(get(formik, `touched.mix_channel_di`) && get(formik, `errors.mix_channel_di`)) ||
			(get(formik, `touched.mix_channel_ds`) && get(formik, `errors.mix_channel_ds`)) ||
			(get(formik, `touched.mix_channel_wh`) && get(formik, `errors.mix_channel_wh`)) ||
			(get(formik, `touched.mix_channel_fba`) && get(formik, `errors.mix_channel_fba`));
		return helpText;
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container>
				<Grid item xs={12}>
					<Stack direction={"row"} alignItems={"center"} gap={"5px"} mb={1}>
						<Typography
							variant="body1"
							color={"text.primary"}
							sx={{
								fontWeight: "700",
								alignItems: "center",
							}}
						>
							Assumption is applied to
						</Typography>
						{isNumber(row) && (
							<Select
								fullWidth
								size="small"
								variant="outlined"
								value={row}
								multiple={false}
								sx={{
									width: 90,
									minHeight: "25px",
									borderRadius: "30px",
									"& .MuiInputBase-input": {
										padding: "3px 24px 3px 16px !important",
									},
								}}
								onChange={(e: any) => {
									setRow(e.target.value);
								}}
							>
								{Array.from(Array(lengthRows), (_, index) => index).map((item) => {
									return (
										<MenuItem key={item} value={item}>
											Row {item + 1}
										</MenuItem>
									);
								})}
							</Select>
						)}
						<Button
							variant="text"
							onClick={() => setChecked((prev) => !prev)}
							sx={{ minWidth: "20px", padding: "0 3px" }}
						>
							{!checked ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
						</Button>
					</Stack>
				</Grid>
				<Grid item xs={12}>
					<Collapse
						in={checked}
						sx={{
							paddingTop: "10px",
							marginBottom: checked ? "20px" : 0,
						}}
					>
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12} sm={6}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography
											variant="body1"
											sx={{ display: "flex", gap: "5px" }}
											color="text.primary"
										>
											% Cost price - Y4A sell to AMZ
											<ToolTip
												title="% Cost price calculated on RRP that Y4A sell to AMZ"
												fontSize="small"
											/>
										</Typography>
									</Grid>
									<Grid item xs={12} sm={4}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="percent_submit_to_amz_di"
											variant="outlined"
											disabled={isView || isLoading || isLoading}
											label="% DI"
											customInput={TextField}
											error={
												get(formik, `touched.percent_submit_to_amz_di`) &&
												Boolean(get(formik, `errors.percent_submit_to_amz_di`))
											}
											helperText={
												get(formik, `touched.percent_submit_to_amz_di`) &&
												get(formik, `errors.percent_submit_to_amz_di`)
											}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.percent_submit_to_amz_di * 100}
											onValueChange={(values) => {
												formik.setFieldValue("percent_submit_to_amz_di", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="percent_submit_to_amz_ds"
											variant="outlined"
											label="% DS"
											disabled={isView || isLoading}
											customInput={TextField}
											error={
												get(formik, `touched.percent_submit_to_amz_ds`) &&
												Boolean(get(formik, `errors.percent_submit_to_amz_ds`))
											}
											helperText={
												get(formik, `touched.percent_submit_to_amz_ds`) &&
												get(formik, `errors.percent_submit_to_amz_ds`)
											}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.percent_submit_to_amz_ds * 100}
											onValueChange={(values) => {
												formik.setFieldValue("percent_submit_to_amz_ds", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="percent_submit_to_amz_wh"
											variant="outlined"
											label="% WH"
											disabled={isView || isLoading}
											customInput={TextField}
											error={
												get(formik, `touched.percent_submit_to_amz_wh`) &&
												Boolean(get(formik, `errors.percent_submit_to_amz_wh`))
											}
											helperText={
												get(formik, `touched.percent_submit_to_amz_wh`) &&
												get(formik, `errors.percent_submit_to_amz_wh`)
											}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.percent_submit_to_amz_wh * 100}
											onValueChange={(values) => {
												formik.setFieldValue("percent_submit_to_amz_wh", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="amz_refund_and_chargeback"
											variant="outlined"
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													%Return/YA4 revenue <ToolTip title="Return value" fontSize="small" />
												</Box>
											}
											disabled={isView || isLoading}
											customInput={TextField}
											error={
												get(formik, `touched.amz_refund_and_chargeback`) &&
												Boolean(get(formik, `errors.amz_refund_and_chargeback`))
											}
											helperText={
												get(formik, `touched.amz_refund_and_chargeback`) &&
												get(formik, `errors.amz_refund_and_chargeback`)
											}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.amz_refund_and_chargeback * 100}
											onValueChange={(values) => {
												formik.setFieldValue("amz_refund_and_chargeback", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="percent_mkt_fee"
											variant="outlined"
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													% Total MKT budget/MSRP
													<ToolTip
														title="Total marketing budget includes promotion, coupon, SEM"
														fontSize="small"
													/>
												</Box>
											}
											disabled={isView || isLoading}
											customInput={TextField}
											error={
												get(formik, `touched.percent_mkt_fee`) &&
												Boolean(get(formik, `errors.percent_mkt_fee`))
											}
											helperText={
												get(formik, `touched.percent_mkt_fee`) &&
												get(formik, `errors.percent_mkt_fee`)
											}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.percent_mkt_fee * 100}
											onValueChange={(values) => {
												formik.setFieldValue("percent_mkt_fee", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="percent_price_discount"
											variant="outlined"
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													% Price Discount & Promotion
													<ToolTip
														title="Discount/promotion is used to calculate AMZ Net PPM"
														fontSize="small"
													/>
												</Box>
											}
											disabled={isView || isLoading}
											customInput={TextField}
											error={
												get(formik, `touched.percent_price_discount`) &&
												Boolean(get(formik, `errors.percent_price_discount`))
											}
											helperText={
												get(formik, `touched.percent_price_discount`) &&
												get(formik, `errors.percent_price_discount`)
											}
											InputProps={{
												endAdornment: <InputAdornment position="end">%</InputAdornment>,
											}}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.percent_price_discount * 100}
											onValueChange={(values) => {
												formik.setFieldValue("percent_price_discount", values?.floatValue / 100);
											}}
										/>
									</Grid>
								</Grid>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item xs={12}>
										<Typography variant="body1" sx={{ display: "flex", gap: "5px" }} color="text.primary">
											Channel mix
											<ToolTip
												title="Sale volume ratio allocated by each channel"
												fontSize="small"
											/>
										</Typography>
									</Grid>
									<Grid item xs={12}>
										<FormGroup>
											<Grid container spacing={{ xs: 2, sm: 2 }}>
												<Grid item xs={12} sm={3} md={3}>
													<NumericFormat
														allowNegative={false}
														decimalScale={2}
														fixedDecimalScale
														fullWidth
														size="small"
														name="mix_channel_di"
														variant="outlined"
														label="%DI"
														disabled={isView || isLoading}
														customInput={TextField}
														error={
															get(formik, `touched.mix_channel_di`) &&
															Boolean(get(formik, `errors.mix_channel_di`))
														}
														InputProps={{
															endAdornment: <InputAdornment position="end">%</InputAdornment>,
														}}
														onKeyDown={(e: any) => {
															if (e.keyCode === 13) {
																e.target.blur();
															}
														}}
														onBlur={(e) => {
															formik.handleBlur(e);
															formik.handleSubmit();
														}}
														value={formik.values.mix_channel_di * 100}
														onValueChange={(values) => {
															formik.setFieldValue("mix_channel_di", values?.floatValue / 100);
														}}
													/>
												</Grid>
												<Grid item xs={12} sm={3} md={3}>
													<NumericFormat
														allowNegative={false}
														decimalScale={2}
														fixedDecimalScale
														fullWidth
														size="small"
														name="mix_channel_ds"
														variant="outlined"
														label="% DS"
														disabled={isView || isLoading}
														customInput={TextField}
														error={
															get(formik, `touched.mix_channel_ds`) &&
															Boolean(get(formik, `errors.mix_channel_ds`))
														}
														InputProps={{
															endAdornment: <InputAdornment position="end">%</InputAdornment>,
														}}
														onKeyDown={(e: any) => {
															if (e.keyCode === 13) {
																e.target.blur();
															}
														}}
														onBlur={(e) => {
															formik.handleBlur(e);
															formik.handleSubmit();
														}}
														value={formik.values.mix_channel_ds * 100}
														onValueChange={(values) => {
															formik.setFieldValue("mix_channel_ds", values?.floatValue / 100);
														}}
													/>
												</Grid>
												<Grid item xs={12} sm={3} md={3}>
													<NumericFormat
														allowNegative={false}
														decimalScale={2}
														fixedDecimalScale
														fullWidth
														size="small"
														name="mix_channel_wh"
														variant="outlined"
														label="% WH"
														disabled={isView || isLoading}
														customInput={TextField}
														error={
															get(formik, `touched.mix_channel_wh`) &&
															Boolean(get(formik, `errors.mix_channel_wh`))
														}
														InputProps={{
															endAdornment: <InputAdornment position="end">%</InputAdornment>,
														}}
														onKeyDown={(e: any) => {
															if (e.keyCode === 13) {
																e.target.blur();
															}
														}}
														onBlur={(e) => {
															formik.handleBlur(e);
															formik.handleSubmit();
														}}
														value={formik.values.mix_channel_wh * 100}
														onValueChange={(values) => {
															formik.setFieldValue("mix_channel_wh", values?.floatValue / 100);
														}}
													/>
												</Grid>
												<Grid item xs={12} sm={3} md={3}>
													<NumericFormat
														allowNegative={false}
														decimalScale={2}
														fixedDecimalScale
														fullWidth
														size="small"
														name="mix_channel_fba"
														variant="outlined"
														label="% FBA"
														disabled={isView || isLoading}
														customInput={TextField}
														error={
															get(formik, `touched.mix_channel_fba`) &&
															Boolean(get(formik, `errors.mix_channel_fba`))
														}
														InputProps={{
															endAdornment: <InputAdornment position="end">%</InputAdornment>,
														}}
														onKeyDown={(e: any) => {
															if (e.keyCode === 13) {
																e.target.blur();
															}
														}}
														onBlur={(e) => {
															formik.handleBlur(e);
															formik.handleSubmit();
														}}
														value={formik.values.mix_channel_fba * 100}
														onValueChange={(values) => {
															formik.setFieldValue("mix_channel_fba", values?.floatValue / 100);
														}}
													/>
												</Grid>
											</Grid>
											<FormHelperText error sx={{ marginTop: 0 }}>
												{helpTextMixChannel(formik)}
											</FormHelperText>
										</FormGroup>
									</Grid>
									<Grid item xs={12} sm={3}>
										<NumericFormat
											allowNegative={false}
											decimalScale={2}
											fixedDecimalScale
											fullWidth
											size="small"
											name="suggested_duty"
											variant="outlined"
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													% Duties & Tariffs
													<ToolTip
														title="Custom taxes, fees, and duties calculated on FOB price"
														fontSize="small"
													/>
												</Box>
											}
											disabled={
												!(formik.values.category && formik.values.product_source) ||
												isView ||
												isLoading
											}
											customInput={TextField}
											error={
												get(formik, `touched.suggested_duty`) &&
												Boolean(get(formik, `errors.suggested_duty`))
											}
											helperText={
												get(formik, `touched.suggested_duty`) &&
												get(formik, `errors.suggested_duty`)
											}
											onKeyDown={(e: any) => {
												if (e.keyCode === 13) {
													e.target.blur();
												}
											}}
											onBlur={(e) => {
												formik.handleBlur(e);
												formik.handleSubmit();
											}}
											value={formik.values.suggested_duty * 100}
											onValueChange={(values) => {
												formik.setFieldValue("suggested_duty", values?.floatValue / 100);
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={3}>
										<TextField
											fullWidth
											size="small"
											name="product_source"
											variant="outlined"
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													Product source
													<ToolTip
														title="Product source is used to calculate shipping fee"
														fontSize="small"
													/>
												</Box>
											}
											select={!isView}
											{...getValidateFormik({
												formik,
												field: "product_source",
												required: true,
												handleChange: () => {
													formik.handleSubmit();
												},
											})}
											onBlur={(e) => {
												formik.handleBlur(e);
											}}
											disabled={!suggestDuty?.product_source?.length || isView || isLoading}
										>
											{map(suggestDuty?.product_source || [], (item) => (
												<MenuItem key={item} value={item}>
													<Typography variant="inherit">{item}</Typography>
												</MenuItem>
											))}
										</TextField>
									</Grid>
									<Grid item xs={12} sm={3}>
										<TextField
											fullWidth
											size="small"
											name="type_of_cont_shipping"
											variant="outlined"
											select={!isView}
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													Type of Cont Shipping
													<ToolTip
														title="Type of Cont Shipping is used to calculate transportation cost"
														fontSize="small"
													/>
												</Box>
											}
											disabled={isView || isLoading}
											{...getValidateFormik({
												formik,
												field: "type_of_cont_shipping",
												required: true,
												handleChange: () => {
													formik.handleSubmit();
												},
											})}
											onBlur={(e) => {
												formik.handleBlur(e);
											}}
										>
											{map(
												[
													{ name: "Cont 40", id: ETypeCont.Cont40 },
													{ name: "Cont 20", id: ETypeCont.Cont20 },
												],
												({ name, id }) => (
													<MenuItem key={id} value={id}>
														<Typography variant="inherit">{name}</Typography>
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
									<Grid item xs={12} sm={3}>
										<TextField
											fullWidth
											size="small"
											name="period"
											variant="outlined"
											label={
												<Box sx={{ display: "flex", gap: "5px" }}>
													Sales Period
													<ToolTip
														title="Sales Period is used to calculate FBA monthly storage fee"
														fontSize="small"
													/>
												</Box>
											}
											disabled={isView || isLoading}
											select={!isView}
											{...getValidateFormik({
												formik,
												field: "period",
												required: true,
												handleChange: () => {
													formik.handleSubmit();
												},
											})}
											onBlur={(e) => {
												formik.handleBlur(e);
											}}
										>
											{map(
												[
													{ name: "January- September", id: "January– September" },
													{ name: "October- December", id: "October– December" },
												],
												({ name, id }) => (
													<MenuItem key={id} value={id}>
														<Typography variant="inherit">{name}</Typography>
													</MenuItem>
												)
											)}
										</TextField>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Collapse>
				</Grid>
			</Grid>
		</form>
	);
};
