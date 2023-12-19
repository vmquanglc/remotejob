import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { get } from "lodash";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { BoxLoading } from "src/components/box-loading";
import { toastOptions } from "src/components/toast/toast.options";
import { ERole } from "src/interface/groupPermission.interface";
import { requestUpdateMarketPlace } from "src/services/product-info/productInfo.services";
import { selectRoleAccount } from "src/store/auth/selectors";
import * as Yup from "yup";
import { MarketPlaceChange, mappingTitle } from "../market-place-change";
import { Link } from "react-router-dom";
import { PATH } from "src/constants";

export const MarketPlaceTab = ({ details, dataUpdate, refetch }) => {
	const role = useSelector(selectRoleAccount);
	const formik = useFormik({
		initialValues: {
			product_type: "",
			rrp: null,
			...details,
			...dataUpdate,
		},
		validationSchema: Yup.object({
			product_type: Yup.string().required("Field is required"),
			rrp: Yup.number().typeError("Please type valid value").required("Field is required"),
		}),
		onSubmit: (value) => {
			onRequestUpdate({
				sku_id: value.id,
				product_type: value.product_type,
				rrp: value.rrp,
			});
		},
	});

	const [isEdit, setEdit] = useState<boolean>(
		details?.product_update_request?.type_market_place?.id ? false : true
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
			const response: any = await requestUpdateMarketPlace(data);
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
						Updating will have an impact at the Market Place level
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
							below, all other products
						</Box>{" "}
						with the{" "}
						<Box component="span" color="error.main">
							same {mappingTitle(details.market_place)}
						</Box>{" "}
						(regardless of their Vendor Code){" "}
						<Box component="span" color="error.main">
							will be affected accordingly
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
						details?.product_update_request?.type_market_place?.id && (
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
										Cannot Edit Market Place
									</Typography>
									<Typography variant="body1">
										Approve or Decline{" "}
										<Link
											to={`${PATH.UPDATE_REQUEST_LIST}?id=${details?.product_update_request?.type_market_place?.id}`}
											replace
										>
											request update
										</Link>{" "}
										from Sales
										{` <${details?.product_update_request?.type_market_place?.created_by.email}> `}
										before editing Market Place.
									</Typography>
								</Alert>
							</Grid>
						)}
					{role.code === ERole.sales ? (
						<>{renderMess()}</>
					) : (
						!details?.product_update_request?.type_market_place?.id && <>{renderMess()}</>
					)}
					<Grid item xs={12}>
						<MarketPlaceChange
							formik={formik}
							details={details}
							isEditing={isEdit}
							role={role.code}
						/>
					</Grid>
					{role.code === ERole.sales && (
						<>
							<Grid item xs={12}>
								{details?.product_update_request?.type_market_place?.id ? (
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
														!validateChange(["product_type", "rrp"]) ||
														Boolean(formik.errors.product_type)
													}
													sx={{ mr: 1 }}
												>
													Request Update
												</Button>
												{validateChange(["product_type", "rrp"]) && (
													<Button
														type="button"
														size="small"
														variant="outlined"
														onClick={() => {
															setEdit(false);
															formik.setFieldValue(
																"product_type",
																details?.product_update_request?.type_market_place?.update_data
																	?.product_type
															);
															formik.setFieldValue(
																"rrp",
																details?.product_update_request?.type_market_place?.update_data?.rrp
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
												!validateChange(["product_type", "rrp"]) ||
												Boolean(formik.errors.product_type)
											}
											sx={{ mr: 1 }}
										>
											Request Update
										</Button>
										{validateChange(["product_type", "rrp"]) && (
											<Button
												type="button"
												size="small"
												variant="outlined"
												onClick={(e) => {
													e.preventDefault();
													formik.setFieldValue("product_type", details?.product_type);
													formik.setFieldValue("rrp", details?.rrp);
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
							{!details?.product_update_request?.type_market_place?.id && (
								<Grid item xs={12}>
									<Button
										type="submit"
										size="small"
										variant="contained"
										disabled={
											!validateChange(["product_type", "rrp"]) ||
											Boolean(formik.errors.product_type)
										}
										sx={{ mr: 1 }}
									>
										Submit
									</Button>
									{validateChange(["product_type", "rrp"]) && (
										<Button
											type="button"
											size="small"
											variant="outlined"
											onClick={(e) => {
												e.preventDefault();
												formik.setFieldValue("product_type", details?.product_type);
												formik.setFieldValue("rrp", details?.rrp);
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
