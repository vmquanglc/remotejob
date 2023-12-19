import React, { useEffect, useState } from "react";
import { Grid, TextField, Button, Divider } from "@mui/material";
import { getValidateFormik } from "src/utils/formik";
import { useFormik } from "formik";

import { updateInfoRole } from "src/services/settings/permission.services";
import { toastOptions } from "src/components/toast/toast.options";
import { useMutation } from "react-query";
import { ButtonLoading } from "src/components/button-loading";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";

export const InformationTab = ({ data, isView, onClose, onUpdateListing }) => {
	const activities = useSelector(selectActivities);
	const formik = useFormik({
		initialValues: {
			id: data?.id || "",
			code: data?.code || "",
			name: data?.name || "",
			description: data?.description || "",
		},
		onSubmit: (values) => {
			onUpdateInfoRole(values);
		},
	});

	useEffect(() => {
		formik.setValues({
			id: data?.id || "",
			code: data?.code || "",
			name: data?.name || "",
			description: data?.description || "",
		});
	}, [data]);

	const [loading, setLoading] = useState<boolean>(false);
	const { mutate: onUpdateInfoRole } = useMutation(async (data: any) => {
		if (!activities.hasOwnProperty("info_edit_in_role")) {
			toastOptions("error", `You are not authorized to do`);
			onClose();
			return;
		}
		setLoading(true);
		try {
			const response: any = await updateInfoRole(data);
			if (response?.status !== 200) {
				toastOptions("error", "Update role information error");
				setLoading(false);
				onClose();
				return false;
			} else {
				toastOptions("success", "Update role information success!");
				setLoading(false);
				onUpdateListing(data);
				onClose();
				return true;
			}
		} catch (error) {
			toastOptions("error", "Update role information error");
			setLoading(false);
			onClose();
			return false;
		}
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={6}>
					<TextField
						fullWidth
						size="medium"
						name="code"
						variant="outlined"
						label="Code"
						disabled
						placeholder={"Code"}
						{...getValidateFormik({
							formik,
							field: "code",
						})}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						fullWidth
						size="medium"
						name="name"
						variant="outlined"
						label="Role"
						placeholder={"Role"}
						disabled={isView || loading}
						{...getValidateFormik({
							formik,
							field: "name",
						})}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						size="medium"
						name="description"
						variant="outlined"
						placeholder={"Description"}
						label={"Description"}
						multiline
						sx={{
							"& .MuiOutlinedInput-root": {
								padding: "0",
							},
						}}
						disabled={isView || loading}
						rows={6}
						{...getValidateFormik({
							formik,
							field: "description",
						})}
					/>
				</Grid>
				{!isView && (
					<>
						<Grid item xs={12}>
							<Divider />
						</Grid>
						<Grid item xs={12} textAlign="right">
							<ButtonLoading
								loading={loading}
								variant="contained"
								type="submit"
								size="medium"
								disabled={!activities.hasOwnProperty("info_edit_in_role")}
								sx={{
									mr: 2,
								}}
							>
								Save
							</ButtonLoading>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								onClick={onClose}
								disabled={loading}
							>
								Cancel
							</Button>
						</Grid>
					</>
				)}
			</Grid>
		</form>
	);
};
