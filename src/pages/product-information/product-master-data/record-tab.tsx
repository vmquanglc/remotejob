import {
	Alert,
	Box,
	Button,
	Divider,
	Grid,
	List,
	ListItem,
	ListItemText,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { get } from "lodash";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { BoxLoading } from "src/components/box-loading";
import { PaperLoading } from "src/components/paper-loading";
import { toastOptions } from "src/components/toast/toast.options";
import { ERole } from "src/interface/groupPermission.interface";
import { requestUpdateRecord } from "src/services/product-info/productInfo.services";
import { selectRoleAccount } from "src/store/auth/selectors";
import { getValidateNumeric } from "src/utils/formik";
import * as Yup from "yup";
import { RecordChange } from "../record-change";
import { Link } from "react-router-dom";
import { PATH } from "src/constants";
import { mappingTitle } from "../market-place-change";

export const RecordTab = ({ details, dataUpdate, refetch }) => {
	const role = useSelector(selectRoleAccount);
	const formik = useFormik({
		initialValues: {
			cost_to_market_place: null,
			...details,
			...dataUpdate,
		},
		validationSchema: Yup.object({
			cost_to_market_place: Yup.number()
				.typeError("Please type valid value")
				.required("Field is required"),
		}),
		onSubmit: (value) => {
			onRequestUpdate({
				sku_id: value.id,
				cost_to_market_place: value.cost_to_market_place,
			});
		},
	});

	const [isEdit, setEdit] = useState<boolean>(
		details?.product_update_request?.type_record?.id ? false : true
	);

	const validateChange = (keys: string[]) => {
		for (const key of keys) {
			if (get(formik, `values[${key}]`)?.toString() !== get(details, `[${key}]`)?.toString()) {
				return true;
			}
		}
		return false;
	};

	const { mutate: onRequestUpdate, isLoading: isLoading } = useMutation(async (data: any) => {
		try {
			const response: any = await requestUpdateRecord(data);
			if (response?.status !== 200) {
				toastOptions("error", "Request update error");
				return false;
			} else {
				toastOptions("success", "Request update success");
				refetch();
				return true;
			}
		} catch (error) {
			toastOptions("error", "Request update error");
			return false;
		}
	});

	const renderMess = () => {
		return (
			<Grid item xs={12}>
				<Box
					sx={{
						padding: "8px 25px",
						color: "text.primary",
					}}
				>
					<Typography variant="body1" fontWeight="bold" sx={{ mb: "5px" }}>
						Updating will have an impact at the Record level
					</Typography>
					<Typography variant="body1" fontSize={"12px"}>
						When{" "}
						<Box component="span" color="error.main">
							updating
						</Box>{" "}
						the{" "}
						<Box component="span" color="error.main">
							values
						</Box>{" "}
						of the fields{" "}
						<Box component="span" color="error.main">
							below, one and only one
						</Box>{" "}
						ASIN{" "}
						<Box component="span" color="error.main">
							{details.market_place_id}
						</Box>{" "}
						and Vendor Code
						<Box component="span" color="error.main">
							Yes4A will be affected accordingly
						</Box>
						.
						<br />
						Please consider carefully before proceeding with the updates!
					</Typography>
				</Box>
			</Grid>
		);
	};

	return (
		<form onSubmit={formik.handleSubmit}>
			<BoxLoading loading={isLoading}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					{(role.code === ERole.admin || role.code === ERole.manager) &&
						details?.product_update_request?.type_record?.id && (
							<Grid item xs={12}>
								<Alert
									variant="outlined"
									severity="info"
									sx={{
										"& .MuiAlert-icon": {
											marginTop: "5px",
										},
									}}
								>
									<Typography variant="body1" fontWeight="bold" sx={{ mb: "5px" }}>
										Cannot Edit Record
									</Typography>
									<Typography variant="body1">
										Approve or Decline{" "}
										<Link
											to={`${PATH.UPDATE_REQUEST_LIST}?id=${details?.product_update_request?.type_record?.id}`}
											replace
										>
											request update
										</Link>{" "}
										from Sales
										{` <${details?.product_update_request?.type_record?.created_by.email}> `}
										before editing Record.
									</Typography>
								</Alert>
							</Grid>
						)}
					{role.code === ERole.sales ? (
						<>{renderMess()}</>
					) : (
						!details?.product_update_request?.type_record?.id && <>{renderMess()}</>
					)}
					<Grid item xs={12}>
						<RecordChange formik={formik} details={details} isEditing={isEdit} role={role.code} />
					</Grid>

					{role.code === ERole.sales && (
						<>
							<Grid item xs={12}>
								{details?.product_update_request?.type_record?.id ? (
									<>
										{!isEdit ? (
											<>
												<Button
													type="button"
													size="small"
													variant="contained"
													onClick={(e) => {
														e.preventDefault();
														setEdit(true);
													}}
													sx={{ mr: 1 }}
												>
													Edit Request
												</Button>
											</>
										) : (
											<>
												<Button
													type="submit"
													size="small"
													variant="contained"
													disabled={
														!validateChange(["cost_to_market_place"]) ||
														Boolean(formik.errors.cost_to_market_place)
													}
													sx={{ mr: 1 }}
												>
													Request Update
												</Button>
												{validateChange(["cost_to_market_place"]) && (
													<Button
														type="button"
														size="small"
														variant="outlined"
														onClick={() => {
															setEdit(false);
															formik.setFieldValue(
																"cost_to_market_place",
																details?.product_update_request?.type_record?.update_data
																	?.cost_to_market_place
															);
														}}
													>
														Cancel
													</Button>
												)}
											</>
										)}
									</>
								) : (
									<>
										<Button
											type="submit"
											size="small"
											variant="contained"
											disabled={
												!validateChange(["cost_to_market_place"]) ||
												Boolean(formik.errors.cost_to_market_place)
											}
											sx={{ mr: 1 }}
										>
											Request Update
										</Button>
										{validateChange(["cost_to_market_place"]) && (
											<Button
												type="button"
												size="small"
												variant="outlined"
												onClick={() => {
													formik.setFieldValue(
														"cost_to_market_place",
														details?.cost_to_market_place
													);
												}}
											>
												Cancel
											</Button>
										)}
									</>
								)}
							</Grid>
						</>
					)}
					{(role.code === ERole.admin || role.code === ERole.manager) && (
						<>
							{!details?.product_update_request?.type_record?.id && (
								<Grid item xs={12}>
									<Button
										type="button"
										size="small"
										variant="contained"
										disabled={
											!validateChange(["cost_to_market_place"]) ||
											Boolean(get(formik, `errors.cost_to_market_place`))
										}
										onClick={() => {
											console.log("Request cost to amazon sale");
										}}
										sx={{ mr: 1 }}
									>
										Submit
									</Button>
									{validateChange(["cost_to_market_place"]) && (
										<Button
											type="button"
											size="small"
											variant="outlined"
											onClick={() => {
												formik.setFieldValue(
													"cost_to_market_place",
													get(details, "cost_to_market_place")
												);
											}}
										>
											Cancel
										</Button>
									)}
								</Grid>
							)}
						</>
					)}
				</Grid>
			</BoxLoading>
		</form>
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
