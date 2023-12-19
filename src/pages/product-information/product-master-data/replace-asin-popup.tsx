import { CheckBox, CheckBoxOutlineBlank } from "@mui/icons-material";
import {
	Autocomplete,
	Box,
	Button,
	Checkbox,
	Divider,
	Grid,
	MenuItem,
	TextField,
	Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { get, map } from "lodash";
import React, { FC } from "react";
import { NumericFormat } from "react-number-format";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router";
import { ButtonLoading } from "src/components/button-loading";
import BasicDialog from "src/components/modal";
import { Skeleton } from "src/components/skeleton";
import { toastOptions } from "src/components/toast/toast.options";
import { PATH } from "src/constants";
import {
	getStatusReplaceAsin,
	submitPreviewReplaceAsin,
} from "src/services/product-info/productInfo.services";
import { getValidateFormik, getValidateNumeric } from "src/utils/formik";
import { regexSKU } from "src/utils/regex";
import * as Yup from "yup";

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	id: string | number;
}

export const ReplaceAsinPopup: FC<IProps> = ({ open, setOpen, id }) => {
	const { data: data, isLoading: isLoadingInputData }: any = useQuery(
		[`get-status-${id}`],
		async () => {
			try {
				const response = await getStatusReplaceAsin(id);
				if (response.status === 200) {
					return response;
				}
				return undefined;
			} catch (error) {
				return undefined;
			}
		}
	);

	const formik = useFormik({
		initialValues: {
			vendor_code: [],
			upc: null,
		},
		validationSchema: Yup.object().shape({
			vendor_code: Yup.array()
				.min(1, "At least one item needs to be here")
				.required("At least one item needs to be here"),
			upc: Yup.string().required("Field is required"),
		}),
		onSubmit: (value) => {
			onSubmitToPreview({
				data: {
					vendor_codes: value.vendor_code,
					sku_code: data?.data?.replace_asin_info?.sku_code,
					sku_code_new: data?.data?.replace_asin_info?.sku_code_new,
					upc_new: value.upc,
				},
				product_id: id,
			});
		},
	});
	const navigate = useNavigate();

	const { mutate: onSubmitToPreview, isLoading: isLoading } = useMutation(async (data: any) => {
		try {
			const response: any = await submitPreviewReplaceAsin(data);
			if (response?.status !== 200) {
				toastOptions("error", "Request update error");
				return false;
			} else {
				toastOptions("success", "Request update success");
				setOpen(false);
				navigate(`${PATH.PREVIEW_SPREADSHEET_LIST}`);
				return true;
			}
		} catch (error) {
			toastOptions("error", "Request update error");
			return false;
		}
	});
	const renderMess = (status: string, asin: string, preview_ticket_id: number) => {
		switch (status) {
			case "previewing":
				return (
					<Typography variant="body1">
						ASIN {asin} will be replaced by a new one, which is waiting to be previewed,{" "}
						<Box
							component={"span"}
							sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
							onClick={() =>
								navigate(`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${preview_ticket_id}`)
							}
						>
							click here
						</Box>{" "}
						to preview
					</Typography>
				);
			case "requesting":
				return (
					<Typography variant="body1">
						ASIN {asin} will be replaced by a new one, which is waiting for approval,{" "}
						<Box
							component={"span"}
							sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
							onClick={() =>
								navigate(`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${preview_ticket_id}`)
							}
						>
							click here
						</Box>{" "}
						to preview
					</Typography>
				);
			case "waiting_sync":
				return (
					<Typography variant="body1">
						ASIN {asin} will be replaced by a new one, which is being uploaded to Amazon, click here{" "}
						to view spreadsheet upload status.
					</Typography>
				);
			case "inactive":
				return (
					<Typography variant="body1">
						Product type of ASIN {asin} is Inactive, switch it to Active in order to replace ASIN.
					</Typography>
				);
			default:
				return "";
		}
	};

	return (
		<BasicDialog
			open={open}
			disabledBackdropClick
			handleClose={() => setOpen(false)}
			PaperProps={{
				sx: {
					margin: "15px",
					width: "100%",
					maxWidth: "400px",
					background: "#F2F1FA",
				},
			}}
		>
			<Skeleton isLoading={isLoadingInputData}>
				<form onSubmit={formik.handleSubmit}>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6" fontWeight={"bold"}>
								{data?.data?.replace_asin_info?.status !== "avaiable"
									? "Cannot Replace ASIN"
									: `Replace ASIN`}
							</Typography>
						</Grid>
						{data?.data?.replace_asin_info?.status !== "avaiable" ? (
							<>
								<Grid item xs={12}>
									{renderMess(
										data?.data?.replace_asin_info?.status,
										data?.data?.market_place_id,
										data?.data?.replace_asin_info?.preview_ticket_id
									)}
								</Grid>
							</>
						) : (
							<>
								<Grid item xs={12}>
									<Grid container>
										<Grid item xs={12}>
											<Typography variant="body1" pb={"5px"}>
												Current Information:
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="body1" pb={"5px"}>
												SKU: {data?.data?.sku?.code}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="body1" pb={"5px"}>
												ASIN: {data?.data?.market_place_id}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="body1" pb={"5px"}>
												UPC: {data?.data?.upc}
											</Typography>
										</Grid>
										<Grid item xs={6}>
											<Typography variant="body1" pb={"5px"}>
												Vendor Code: {data?.data?.vendor_code}
											</Typography>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12}>
									<Divider />
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1">
										Add new SKU, UPC to create new ASIN on Amazon, replace current ASIN
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Autocomplete
										multiple
										clearIcon={<></>}
										options={["YES4A", "YES4B"] || []}
										getOptionLabel={(option: any) => option}
										onChange={(_, option) => {
											formik.setFieldValue("vendor_code", option);
										}}
										value={formik.values.vendor_code || []}
										disableCloseOnSelect
										renderOption={(props, option, { selected }) => (
											<MenuItem
												{...props}
												disabled={!data?.data?.replace_asin_info?.vendor_codes?.includes(option)}
											>
												<Checkbox
													icon={<CheckBoxOutlineBlank fontSize="small" />}
													checkedIcon={<CheckBox fontSize="small" />}
													style={{ marginRight: 8 }}
													checked={selected}
												/>
												{option}
											</MenuItem>
										)}
										ChipProps={{
											sx: {
												fontSize: "12px",
												height: "26px",
												"&.MuiAutocomplete-tag": {
													margin: "1px 3px",
												},
											},
										}}
										limitTags={2}
										onBlur={formik.handleBlur}
										renderInput={(params) => (
											<TextField
												{...params}
												size="medium"
												name="vendor_code"
												label="Vendor code"
												fullWidth
												error={
													get(formik, "touched.vendor_code") &&
													Boolean(get(formik, "errors.vendor_code"))
												}
												helperText={
													(get(formik, "touched.vendor_code") &&
														get(formik, "errors.vendor_code")) ||
													""
												}
												sx={{
													"& .MuiOutlinedInput-root": {
														background: "#fff",
													},
												}}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										size="medium"
										value={data?.data?.replace_asin_info?.sku_code || ""}
										label="Current SKU"
										fullWidth
										disabled
										sx={{
											"& .MuiOutlinedInput-root": {
												background: "#fff",
											},
										}}
									/>
								</Grid>
								<Grid item xs={6}>
									<TextField
										size="medium"
										name="sku"
										label="New SKU"
										disabled
										value={data?.data?.replace_asin_info?.sku_code_new || ""}
										fullWidth
										sx={{
											"& .MuiOutlinedInput-root": {
												background: "#fff",
											},
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<NumericFormat
										size="medium"
										name="upc"
										label="New UPC"
										fullWidth
										sx={{
											"& .MuiOutlinedInput-root": {
												background: "#fff",
											},
										}}
										decimalScale={0}
										customInput={TextField}
										{...getValidateNumeric({
											formik,
											field: "upc",
											required: true,
										})}
									/>
								</Grid>
								<Grid item xs={12}>
									<Divider />
								</Grid>
								<Grid item xs={12}>
									<Typography variant="body1">
										After the replacement is completed, product type of ASIN{" "}
										{data?.data?.market_place_id} will be switch from <strong>Active</strong> to{" "}
										<strong>Inactive</strong> on SMS - applied to all Vendor Code
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Divider />
								</Grid>
								<Grid item xs={12} sm={12} textAlign="right">
									<ButtonLoading
										loading={false}
										disabled={
											!!Object.keys(formik.errors).length ||
											!formik.values.upc ||
											!formik.values.vendor_code?.length
										}
										variant="contained"
										type="submit"
										size="medium"
										sx={{
											mr: 1,
										}}
										onClick={() => {}}
									>
										Submit to Preview
									</ButtonLoading>
									<Button
										variant="outlined"
										type="button"
										size="medium"
										disabled={false}
										onClick={() => {
											setOpen(false);
										}}
									>
										Cancel
									</Button>
								</Grid>
							</>
						)}
					</Grid>
				</form>
			</Skeleton>
		</BasicDialog>
	);
};
