import React, { FC } from "react";
import { ERole } from "src/interface/groupPermission.interface";
import {
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { NumericFormat } from "react-number-format";
import { getValidateNumeric } from "src/utils/formik";
import { get } from "lodash";
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

export const RecordChange: FC<IProps> = ({
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
												size="small"
												name={`details.cost_to_market_place`}
												label={"Cost to Market Place"}
												fullWidth
												value={details?.[`cost_to_market_place`]}
												disabled={true}
												thousandSeparator=","
												customInput={TextField}
												prefix="$ "
											/>
										</Grid>
									</Grid>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Grid container spacing={{ xs: 2, sm: 2 }}>
										<Grid item xs={12}>
											<Typography variant="body1" fontWeight="bold">
												Request to Sales Manager - Only apply to this Vendor Code
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<NumericFormat
												inputProps={{
													style: {
														color:
															Number(get(formik, `values.cost_to_market_place`)) !==
															get(details, `cost_to_market_place`)
																? "#D60000"
																: "inherit",
														WebkitTextFillColor:
															Number(get(formik, `values.cost_to_market_place`)) !==
															get(details, `cost_to_market_place`)
																? "#D60000"
																: "inherit",
													},
												}}
												size="small"
												name={`cost_to_market_place`}
												label={"Cost to Market Place"}
												fullWidth
												decimalScale={2}
												thousandSeparator=","
												customInput={TextField}
												disabled={!isEditing}
												prefix="$ "
												{...getValidateNumeric({
													formik,
													field: "cost_to_market_place",
													required: true,
												})}
											/>
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
												Update - Only apply to this Vendor Code
											</Typography>
										</Grid>
										<Grid item xs={12}>
											<NumericFormat
												inputProps={{
													style: {
														color:
															Number(get(formik, `values.cost_to_market_place`)) !==
															get(details, `cost_to_market_place`)
																? "#D60000"
																: "inherit",
														WebkitTextFillColor:
															Number(get(formik, `values.cost_to_market_place`)) !==
															get(details, `cost_to_market_place`)
																? "#D60000"
																: "inherit",
													},
												}}
												size="small"
												name={`cost_to_market_place`}
												label={"Cost to Market Place"}
												fullWidth
												decimalScale={2}
												thousandSeparator=","
												disabled={!isEditing}
												customInput={TextField}
												prefix="$ "
												{...getValidateNumeric({
													formik,
													field: "cost_to_market_place",
													required: true,
												})}
											/>
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
					{details?.product_update_request?.type_record?.id && (
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
											MAP_LABEL_REQUEST[details?.product_update_request?.type_record?.type]
										}`}
									/>
									<ItemRequestInfo
										primary="SKU"
										second={details?.product_update_request?.type_record?.additional_data?.sku}
									/>
									<ItemRequestInfo
										primary="Sales request"
										second={details?.product_update_request?.type_record?.created_by?.email}
									/>
									<ItemRequestInfo
										primary="Request time"
										second={convertTimeToGMT7(
											details?.product_update_request?.type_record?.created_at,
											FORMAT_DATE_FULL
										)}
									/>
									<ItemRequestInfo
										primary="Sales Manager"
										second={
											details?.product_update_request?.type_record?.created_by?.manager?.email
										}
									/>
									{isViewApproved && (
										<>
											<ItemRequestInfo
												primary="Decision"
												second={
													<Typography
														color={
															details?.product_update_request?.type_record?.is_approved
																? "primary.main"
																: "error.main"
														}
													>
														{details?.product_update_request?.type_record?.is_approved
															? "Approved"
															: "Decline"}
													</Typography>
												}
											/>
											{details?.product_update_request?.type_record?.reason && (
												<ItemRequestInfo
													primary="Reason"
													second={details?.product_update_request?.type_record?.reason}
												/>
											)}
											<ItemRequestInfo
												primary="Decision time"
												second={convertTimeToGMT7(
													details?.product_update_request?.type_record?.approved_at
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
