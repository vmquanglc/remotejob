import { useFormik } from "formik";
import React, { useState } from "react";
import { Grid, Button, Typography, Alert, Box } from "@mui/material";
import { SKUInfoChange } from "src/pages/product-information/sku-info-change";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import { ERole } from "src/interface/groupPermission.interface";
import { get, omit } from "lodash";
import { SCHEMA_EDIT_PRODUCT, SCHEMA_EDIT_PRODUCT_ADMIN } from "./edit-product.validate-schema";
import { useMutation } from "react-query";
import { requestUpdateSKUInfo } from "src/services/product-info/productInfo.services";
import { toastOptions } from "src/components/toast/toast.options";
import { formatDateToString } from "src/utils/date";
import { FORMAT_DATE_FULL, PATH } from "src/constants";
import { PaperLoading } from "src/components/paper-loading";
import { BoxLoading } from "src/components/box-loading";
import { Link } from "react-router-dom";

export const SKUInformationTab = ({ details, categoryTree, dataInput, refetch, dataUpdate }) => {
	const role = useSelector(selectRoleAccount);
	const formik = useFormik({
		initialValues: {
			...details,
			sku: {
				order_proccessing_lead_time: "",
				international_transportation_lead_time: "",
				domestic_lead_time: "",
				sell_type: "",
				life_cycle: "",
				rrp: "",
				...details.sku,
				category: {
					...details?.sku?.category,
					relative_last_category: dataUpdate?.category_id
						? Object.assign(details?.sku?.category?.relative_last_category, {
								id: dataUpdate.category_id,
						  })
						: details?.sku?.category?.relative_last_category,
				},
				...omit(dataUpdate, "category_id"),
			},
		},
		validationSchema: role.code === ERole.sales ? SCHEMA_EDIT_PRODUCT : SCHEMA_EDIT_PRODUCT_ADMIN,
		onSubmit: (value) => {
			onRequestUpdate({
				sku_id: value.id,
				category_id: value.sku.category.relative_last_category.id,
				sell_type: value.sku.sell_type,
				life_cycle: value.sku.life_cycle,
				order_proccessing_lead_time: Number(value.sku.order_proccessing_lead_time),
				international_transportation_lead_time: Number(
					value.sku.international_transportation_lead_time
				),
				domestic_lead_time: Number(value.sku.domestic_lead_time),
			});
		},
	});
	const [isEdit, setEdit] = useState<boolean>(
		details?.product_update_request?.type_sku?.id ? false : true
	);
	const validateChange = () => {
		const keys = [
			"sku.category.relative_root_category.id",
			"sku.category.relative_main_category.id",
			"sku.category.relative_category.id",
			"sku.category.relative_subcategory.id",
			"sku.category.relative_last_category.id",
			"sku.sell_type",
			"sku.life_cycle",
			"sku.order_proccessing_lead_time",
			"sku.international_transportation_lead_time",
			"sku.domestic_lead_time",
		];
		for (const key of keys) {
			if (get(formik, `values[${key}]`)?.toString() !== get(details, `[${key}]`)?.toString()) {
				return true;
			}
		}
		return false;
	};

	const { mutate: onRequestUpdate, isLoading: isLoading } = useMutation(async (data: any) => {
		try {
			const response: any = await requestUpdateSKUInfo(data);
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
						Updating will have an impact at the SKU level
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
							same SKU
						</Box>{" "}
						(regardless of their ASIN, Walmart ID, or Wayfair ID) will be affected accordingly.
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
						details?.product_update_request?.type_sku?.id && (
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
										Cannot Edit SKU Information
									</Typography>
									<Typography variant="body1">
										Approve or Decline{" "}
										<Link
											to={`${PATH.UPDATE_REQUEST_LIST}?id=${details?.product_update_request?.type_sku?.id}`}
											replace
										>
											request update
										</Link>{" "}
										from Sales{` <${details?.product_update_request?.type_sku?.created_by.email}> `}
										before editing SKU Information.
									</Typography>
								</Alert>
							</Grid>
						)}
					{role.code === ERole.sales ? (
						<>{renderMess()}</>
					) : (
						!details?.product_update_request?.type_sku?.id && <>{renderMess()}</>
					)}
					<Grid item xs={12}>
						<SKUInfoChange
							details={details}
							formik={formik}
							isEditing={isEdit}
							role={role.code}
							categoryTree={categoryTree}
							dataInput={dataInput}
						/>
					</Grid>

					<Grid item xs={12} mb={2}>
						{role.code === ERole.sales ? (
							<>
								{details?.product_update_request?.type_sku?.id ? (
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
													disabled={!validateChange() || !!Object.keys(formik.errors).length}
													sx={{ mr: 1 }}
												>
													{"Request Update"}
												</Button>
												{validateChange() && (
													<Button
														type="button"
														size="small"
														variant="outlined"
														onClick={() => {
															formik.resetForm();
															setEdit(false);
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
											disabled={!validateChange() || !!Object.keys(formik.errors).length}
											sx={{ mr: 1 }}
										>
											Request Update
										</Button>
										{validateChange() && (
											<Button
												type="button"
												size="small"
												variant="outlined"
												onClick={() => {
													formik.resetForm();
													setEdit(false);
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
								{!details?.product_update_request?.type_sku?.id && (
									<>
										<Button
											type="submit"
											size="small"
											variant="contained"
											disabled={!validateChange() || !!Object.keys(formik.errors).length}
											sx={{ mr: 1 }}
										>
											Submit
										</Button>
										{validateChange() && (
											<Button
												type="button"
												size="small"
												variant="outlined"
												onClick={() => {
													formik.resetForm();
												}}
											>
												Cancel
											</Button>
										)}
									</>
								)}
							</>
						)}
					</Grid>
				</Grid>
			</BoxLoading>
		</form>
	);
};
