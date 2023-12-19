import { Box, Button, Divider, Grid, MenuItem, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { map } from "lodash";
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
	getStatusAddVendor,
	submitPreviewAddVendor,
} from "src/services/product-info/productInfo.services";
import { getValidateFormik, getValidateNumeric } from "src/utils/formik";
import * as Yup from "yup";

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	sku: any;
	id: number | string;
}

export const AddVendorCodePopup: FC<IProps> = ({ open, setOpen, sku, id }) => {
	const { data: data, isLoading: isLoadingInputData }: any = useQuery(
		[`get-input-data-${id}`],
		async () => {
			try {
				const response = await getStatusAddVendor(id);
				if (response.status === 200) {
					const statusAdd = Object.values(response?.data?.vendor_code_status).reduce(
						(object: any, item: any, index) => {
							const draftObj = { ...object };
							if (!draftObj[item.status]) {
								draftObj[item.status] = [];
							}
							draftObj[item.status] = [
								...draftObj[item.status],
								Object.keys(response?.data?.vendor_code_status)[index],
							];
							return draftObj;
						},
						{}
					);
					return {
						...response,
						data: {
							...response.data,
							status: statusAdd,
						},
					};
				}
				return undefined;
			} catch (error) {
				return undefined;
			}
		}
	);

	const formik = useFormik({
		initialValues: {
			vendor_code: "",
			list_price: null,
			cost_price: null,
		},
		validationSchema: Yup.object().shape({
			vendor_code: Yup.string().required("Field is required"),
			list_price: Yup.number().typeError("Please type valid value").required("Field is required"),
			cost_price: Yup.number().typeError("Please type valid value").required("Field is required"),
		}),
		onSubmit: (value) => {
			onSubmitToPreview({
				data: value,
				product_id: id,
			});
		},
	});

	const navigate = useNavigate();

	const { mutate: onSubmitToPreview, isLoading: isLoading } = useMutation(async (data: any) => {
		try {
			const response: any = await submitPreviewAddVendor(data);
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

	const renderMess = (status) => {
		if (status?.avaiable?.length === 2) {
			return `ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is allowed to add more Vendor Code YES4A and YES4B.`;
		}
		if (status?.previewing?.length === 2) {
			return (
				<>
					{`Adding YES4A, YES4B to ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is being waited to preview,`}
					<Box
						component={"span"}
						sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
						onClick={() =>
							navigate(
								`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${data?.data?.vendor_code_status?.YES4A?.preview_ticket_id}`
							)
						}
					>
						preview YES4A
					</Box>
					,
					<Box
						component={"span"}
						sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
						onClick={() =>
							navigate(
								`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${data?.data?.vendor_code_status?.YES4B?.preview_ticket_id}`
							)
						}
					>
						preview YES4B
					</Box>
				</>
			);
		}
		if (status?.requesting?.length === 2) {
			return (
				<>
					{`Adding YES4A, YES4B to ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is being waited to approval,`}
					<Box
						component={"span"}
						sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
						onClick={() =>
							navigate(
								`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${data?.data?.vendor_code_status?.YES4A?.preview_ticket_id}`
							)
						}
					>
						view YES4A request
					</Box>
					,
					<Box
						component={"span"}
						sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
						onClick={() =>
							navigate(
								`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${data?.data?.vendor_code_status?.YES4B?.preview_ticket_id}`
							)
						}
					>
						view YES4B request
					</Box>
					.
				</>
			);
		}
		if (status?.waiting_sync?.length === 2) {
			return `Adding YES4A, YES4B to ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is being uploaded to Amazon, view spreadsheet upload status request.`;
		}
		if (status?.existed?.length === 2) {
			return `ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) already has Vendor Code YES4A and YES4B`;
		}
		return (
			<>
				{status?.avaiable?.length ? (
					<>
						<span>{`ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is allowed to add more Vendor Code ${status?.avaiable?.[0]}.`}</span>
						<br />
					</>
				) : (
					``
				)}
				{status?.previewing?.length ? (
					<>
						<span>
							{`Adding ${status?.previewing?.[0]} to ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is being waited to preview, `}
							<Box
								component={"span"}
								sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
								onClick={() =>
									navigate(
										`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${
											data?.data?.vendor_code_status?.[status?.previewing?.[0]]?.preview_ticket_id
										}`
									)
								}
							>
								{`preview ${status?.previewing?.[0]}`}
							</Box>
							.
						</span>
						<br />
					</>
				) : (
					``
				)}
				{status?.requesting?.length ? (
					<>
						<span>
							{`Adding ${status?.requesting?.[0]} to ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is being waited to approval, `}
							<Box
								component={"span"}
								sx={{ cursor: "pointer", color: "#006EC9", textDecoration: "underline" }}
								onClick={() =>
									navigate(
										`${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/${
											data?.data?.vendor_code_status?.[status?.requesting?.[0]]?.preview_ticket_id
										}`
									)
								}
							>
								{`view  ${status?.requesting?.[0]} `}
							</Box>
							request.
						</span>
						<br />
					</>
				) : (
					``
				)}
				{status?.waiting_sync?.length ? (
					<>
						<span>{`Adding ${status?.waiting_sync?.[0]} to ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) is being uploaded to Amazon, view spreadsheet upload status request.`}</span>
						<br />
					</>
				) : (
					``
				)}

				{status?.existed?.length ? (
					<span>{`ASIN ${data?.data?.market_place_id} (SKU ${sku?.code}) already has Vendor Code ${status?.existed?.[0]}`}</span>
				) : (
					``
				)}
			</>
		);
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
								{!data?.data?.status?.avaiable?.length
									? "Cannot add Vendor Code"
									: `Add Vendor Code to SKU ${sku?.code}`}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1" sx={{}}>
								{renderMess(data?.data?.status)}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							{!!data?.data?.status?.avaiable?.length && (
								<Typography variant="body1">You have selected requests below:</Typography>
							)}
							{!data?.data?.status?.avaiable?.length && (
								<Typography variant="body1">Cannot add more Vendor Code.</Typography>
							)}
						</Grid>
						{!!data?.data?.status?.avaiable?.length && (
							<>
								<Grid item xs={12}>
									<TextField
										size="medium"
										name="vendor_code"
										label="Vendor code"
										fullWidth
										sx={{
											"& .MuiOutlinedInput-root": {
												background: "#fff",
											},
										}}
										select
										{...getValidateFormik({
											formik,
											field: "vendor_code",
											required: true,
										})}
									>
										{map(
											[
												{
													label: "YES4A",
													value: "YES4A",
													disabled: !data?.data?.status?.avaiable?.includes("YES4A"),
												},
												{
													label: "YES4B",
													value: "YES4B",
													disabled: !data?.data?.status?.avaiable?.includes("YES4B"),
												},
											],
											(item: any) => (
												<MenuItem key={item.value} value={item.value} disabled={item.disabled}>
													{item.label}
												</MenuItem>
											)
										)}
									</TextField>
								</Grid>
								<Grid item xs={12}>
									<NumericFormat
										inputProps={{
											style: {
												background: "#fff",
											},
										}}
										size="medium"
										name={`list_price`}
										label={"List price"}
										fullWidth
										thousandSeparator=","
										decimalScale={2}
										customInput={TextField}
										prefix="$ "
										{...getValidateNumeric({
											formik,
											field: "list_price",
											required: true,
										})}
									/>
								</Grid>
								<Grid item xs={12}>
									<NumericFormat
										inputProps={{
											style: {
												background: "#fff",
											},
										}}
										size="medium"
										decimalScale={2}
										name={`cost_price`}
										label={"Cost price"}
										fullWidth
										thousandSeparator=","
										customInput={TextField}
										prefix="$ "
										{...getValidateNumeric({
											formik,
											field: "cost_price",
											required: true,
										})}
									/>
								</Grid>
								<Grid item xs={12}>
									<Divider />
								</Grid>
								<Grid item xs={12} sm={12} textAlign="right">
									<ButtonLoading
										loading={false}
										disabled={
											!!Object.keys(formik.errors).length ||
											!formik.values.cost_price ||
											!formik.values.list_price ||
											!formik.values.vendor_code
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
