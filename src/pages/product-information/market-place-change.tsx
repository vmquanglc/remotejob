import React, { FC } from "react";
import { ERole } from "src/interface/groupPermission.interface";
import {
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	MenuItem,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { EMarketPlace } from "src/interface/productInfo.interface";
import { getValidateFormik, getValidateNumeric } from "src/utils/formik";
import { get, map } from "lodash";
import { convertTimeToGMT7 } from "src/utils/date";
import { FORMAT_DATE_FULL } from "src/constants";
import { MAP_LABEL_REQUEST } from "src/constants/productInfo.constant";

interface IProps {
	formik: any;
	details: any;
	isEditing: boolean;
	role: ERole;
	isViewRequest?: boolean;
	isViewApproved?: boolean;
}
export const mappingTitle = (marketPlace: EMarketPlace) => {
	switch (marketPlace) {
		case EMarketPlace.Amazon:
			return "ASIN";
		case EMarketPlace.Walmart:
			return "Walmart ID";
		case EMarketPlace.Wayfair:
			return "Wayfair ID";
	}
};

export const MarketPlaceChange: FC<IProps> = ({
	formik,
	details,
	isEditing,
	role,
	isViewRequest = false,
	isViewApproved = false,
}) => {
	return (
		<Grid container spacing={{ xs: 2, sm: 2 }}>
			<Grid item xs={12}>
				<Paper sx={{ p: 2 }}>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="body1" fontWeight="bold">
								View
							</Typography>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="small"
								name="details.market_place_id"
								label="Market Place ID"
								fullWidth
								value={details?.market_place_id}
								disabled={true}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="small"
								name="details.channel"
								label="Channel"
								fullWidth
								value={details?.channel}
								disabled={true}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="small"
								name="details.country"
								label="Country"
								fullWidth
								value={details?.country}
								disabled={true}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="small"
								name="details.upc"
								label="UPC"
								fullWidth
								value={details?.upc}
								disabled={true}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="small"
								name="details.vendor_code"
								label="Vendor code"
								fullWidth
								value={details?.vendor_code}
								disabled={true}
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="small"
								name="details.market_place"
								label="Market place"
								fullWidth
								value={details?.market_place}
								disabled={true}
							/>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
			{role === ERole.sales && (
				<>
					<Grid item xs={12} sm={8}>
						<Paper sx={{ p: 2 }}>
							<Grid container spacing={{ xs: 2, sm: 2 }}>
								<Grid item xs={12} sm={6}>
									<Grid container spacing={{ xs: 2, sm: 2 }}>
										<Grid item xs={12}>
											<Typography variant="body1" fontWeight="bold">
												Applied
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<NumericFormat
												label="RRP"
												decimalScale={2}
												variant="outlined"
												fullWidth
												size="small"
												name="details.rrp"
												thousandSeparator=","
												customInput={TextField}
												prefix="$ "
												value={details?.rrp}
												disabled={true}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												size="small"
												name="details.product_type"
												label="Product Type"
												fullWidth
												value={details?.product_type}
												disabled={true}
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Grid container spacing={{ xs: 2, sm: 2 }}>
										<Grid item xs={12}>
											<Typography variant="body1" fontWeight="bold">
												Request to Sales Manager - Apply to all Vendor Code sharing{" "}
												{mappingTitle(details.market_place)}
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<NumericFormat
												inputProps={{
													style: {
														color:
															Number(formik.values?.rrp) !== details?.rrp ? "#D60000" : "inherit",
														WebkitTextFillColor:
															Number(formik.values?.rrp) !== details?.rrp ? "#D60000" : "inherit",
													},
												}}
												size="small"
												name="rrp"
												label="RRP"
												fullWidth
												decimalScale={2}
												thousandSeparator=","
												customInput={TextField}
												disabled={!isEditing}
												prefix="$ "
												{...getValidateNumeric({
													formik,
													field: "rrp",
													required: true,
												})}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												size="small"
												name="product_type"
												label="Product Type"
												fullWidth
												{...getValidateFormik({
													formik,
													field: "product_type",
													required: true,
												})}
												disabled={!isEditing}
												select
												sx={{
													"& .MuiInputBase-root .MuiInputBase-input": {
														color:
															formik.values.product_type !== details.product_type
																? "error.main"
																: "inherit",
													},
													"& .MuiInputBase-input.Mui-disabled": {
														color:
															formik.values.product_type !== details.product_type
																? "error.main"
																: "inherit",
														WebkitTextFillColor:
															formik.values.product_type !== details.product_type
																? "#D60000"
																: "inherit",
													},
												}}
											>
												{map(["Active", "Inactive"], (item) => (
													<MenuItem key={item} value={item}>
														{item}
													</MenuItem>
												))}
											</TextField>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</>
			)}

			{(role === ERole.admin || role === ERole.manager) && (
				<>
					<Grid item xs={12} sm={4}>
						<Paper sx={{ p: 2 }}>
							<Grid container spacing={{ xs: 2, sm: 2 }}>
								<Grid item xs={12}>
									<Grid container spacing={{ xs: 2, sm: 2 }}>
										<Grid item xs={12}>
											<Typography variant="body1" fontWeight="bold">
												Update - Apply to all Vendor Code sharing{" "}
												{mappingTitle(details.market_place)}
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<NumericFormat
												inputProps={{
													style: {
														color:
															Number(formik.values?.rrp) !== details?.rrp ? "#D60000" : "inherit",
														WebkitTextFillColor:
															Number(formik.values?.rrp) !== details?.rrp ? "#D60000" : "inherit",
													},
												}}
												size="small"
												name="rrp"
												label="RRP"
												fullWidth
												decimalScale={2}
												disabled={!isEditing}
												thousandSeparator=","
												customInput={TextField}
												prefix="$ "
												{...getValidateNumeric({
													formik,
													field: "rrp",
													required: true,
												})}
											/>
										</Grid>
										<Grid item xs={12}>
											<TextField
												size="small"
												name="product_type"
												label="Product Type"
												fullWidth
												{...getValidateFormik({
													formik,
													field: "product_type",
													required: true,
												})}
												disabled={!isEditing}
												select
												sx={{
													"& .MuiInputBase-root .MuiInputBase-input": {
														color:
															formik.values.product_type !== details.product_type
																? "error.main"
																: "inherit",
													},
													"& .MuiInputBase-input.Mui-disabled": {
														color:
															formik.values.product_type !== details.product_type
																? "error.main"
																: "inherit",
														WebkitTextFillColor:
															formik.values.product_type !== details.product_type
																? "#D60000"
																: "inherit",
													},
												}}
											>
												{map(["Active", "Inactive"], (item) => (
													<MenuItem key={item} value={item}>
														{item}
													</MenuItem>
												))}
											</TextField>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Paper>
					</Grid>
				</>
			)}
			{(role === ERole.sales || isViewRequest) && (
				<>
					{details?.product_update_request?.type_market_place?.id && (
						<Grid item xs={12} sm={4}>
							<Paper>
								<Typography sx={{ fontWeight: "bold", padding: "9px 0", textAlign: "center" }}>
									Request information
								</Typography>
								<Divider />
								<List>
									<ItemRequestInfo
										primary="Request type"
										second={`Edit ${
											MAP_LABEL_REQUEST[details?.product_update_request?.type_market_place?.type]
										}`}
									/>
									<ItemRequestInfo
										primary="SKU"
										second={
											details?.product_update_request?.type_market_place?.additional_data?.sku
										}
									/>
									<ItemRequestInfo
										primary="Sales request"
										second={details?.product_update_request?.type_market_place?.created_by?.email}
									/>
									<ItemRequestInfo
										primary="Request time"
										second={convertTimeToGMT7(
											details?.product_update_request?.type_market_place?.created_at,
											FORMAT_DATE_FULL
										)}
									/>
									<ItemRequestInfo
										primary="Sales Manager"
										second={
											details?.product_update_request?.type_market_place?.created_by?.manager?.email
										}
									/>
									{isViewApproved && (
										<>
											<ItemRequestInfo
												primary="Decision"
												second={
													<Typography
														color={
															details?.product_update_request?.type_market_place?.is_approved
																? "primary.main"
																: "error.main"
														}
													>
														{details?.product_update_request?.type_market_place?.is_approved
															? "Approved"
															: "Decline"}
													</Typography>
												}
											/>
											{details?.product_update_request?.type_market_place?.reason && (
												<ItemRequestInfo
													primary="Reason"
													second={details?.product_update_request?.type_market_place?.reason}
												/>
											)}
											<ItemRequestInfo
												primary="Decision time"
												second={convertTimeToGMT7(
													details?.product_update_request?.type_market_place?.approved_at
												)}
											/>
										</>
									)}
								</List>
							</Paper>
						</Grid>
					)}
				</>
			)}
		</Grid>
	);
};
const ItemRequestInfo = ({ primary, second }) => (
	<ListItem
		sx={{
			gap: "20px",
			padding: "3px 16px",
			"& .MuiListItemText-root": {
				flex: "0 0 calc(50% - 10px)",
				maxWidth: "calc(50% - 10px)",
				width: "calc(50% - 10px)",
			},
		}}
	>
		<ListItemText sx={{ textAlign: "right" }}>
			<Typography fontWeight={"bold"} color={"primary.main"}>
				{primary}
			</Typography>
		</ListItemText>
		<ListItemText>
			<Typography color={"primary.main"}>{second}</Typography>
		</ListItemText>
	</ListItem>
);
