import {
	Autocomplete,
	Button,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	MenuItem,
	Radio,
	RadioGroup,
	TextField,
	Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { keyBy, map } from "lodash";
import React, { FC } from "react";
import { ButtonLoading } from "src/components/button-loading";
import { DEPARTMENT_YES4ALL, LIST_ROLE, LIST_STATUS } from "src/constants";
import { getValidateFormik } from "src/utils/formik";
import { regexEmail } from "src/utils/regex";
import * as Yup from "yup";

interface IProps {
	onClose: (value?: boolean) => void;
	onSubmit: (value: any) => void;
	title: string;
	data?: any;
	dataRoles: any[];
	dataDepartment: any[];
	loading: boolean;
	isEdit: boolean;
}

export const PopupAccount: FC<IProps> = ({
	onClose,
	title,
	data = {},
	onSubmit,
	dataRoles,
	dataDepartment,
	loading,
	isEdit,
}) => {
	const formik = useFormik({
		initialValues: {
			first_name: "",
			status: true,
			last_name: "",
			email: "",
			manager: {
				id: "",
				email: "",
				first_name: "",
				full_name: "",
				last_name: "",
				department: { id: "", name: "" },
			},
			department: { id: "", name: "" },
			role: {
				code: "",
				description: "",
				id: "",
				name: "",
			},
			...data,
		},
		validationSchema: Yup.object({
			first_name: Yup.string()
				.min(2, "At least 2 characters")
				.max(32, "The string must be at most 32 characters")
				.required("Field is required"),
			last_name: Yup.string()
				.min(2, "At least 2 characters")
				.max(32, "The string must be at most 32 characters")
				.required("Field is required"),
			role: Yup.object({
				code: Yup.string().required("Field is required"),
				id: Yup.string().required("Field is required"),
				name: Yup.string().required("Field is required"),
			}),
			department: Yup.object({
				id: Yup.string().required("Field is required"),
				name: Yup.string().required("Field is required"),
			}),
			manager: Yup.object({
				id: Yup.string().required("Field is required"),
				email: Yup.string().required("Field is required"),
			}),
			email: Yup.string()
				.email("Field must be a valid")
				.min(12, "Email must be at least 12 characters")
				.max(50, "Email must be at most 50 characters")
				.matches(regexEmail, {
					message: "Field must be a valid",
				})
				.required("Field is required"),
		}),
		onSubmit: onSubmit,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12}>
					<Typography variant="h6">{title}</Typography>
				</Grid>
				<Grid item xs={12} sm={5}>
					<TextField
						size="medium"
						name="first_name"
						disabled={loading}
						label={"First name"}
						fullWidth
						{...getValidateFormik({
							formik,
							field: "first_name",
							required: true,
						})}
					/>
				</Grid>
				<Grid item xs={12} sm={7}>
					<TextField
						size="medium"
						name="last_name"
						disabled={loading}
						label="Last name"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "last_name",
							required: true,
						})}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField
						size="medium"
						name="email"
						disabled={isEdit}
						label="Email"
						fullWidth
						{...getValidateFormik({
							formik,
							field: "email",
							required: true,
						})}
					/>
				</Grid>
				<Grid item xs={12} sm={12}>
					<TextField
						fullWidth
						disabled={loading}
						label="Role"
						size="medium"
						select
						name="role.id"
						{...getValidateFormik({
							formik,
							field: "role.id",
							required: true,
						})}
						onChange={(e) => {
							const item = dataRoles?.find((item) => item.id === e.target.value);
							formik.setFieldValue("role", item);
						}}
					>
						{map(dataRoles, ({ name, id }) => (
							<MenuItem key={id} value={id}>
								<Typography variant="inherit">{name}</Typography>
							</MenuItem>
						))}
					</TextField>
				</Grid>
				{isEdit && (
					<Grid item xs={12} sm={12}>
						<FormControl
							fullWidth
							disabled={loading}
							sx={{
								"& .MuiFormLabel-root.Mui-focused": {
									color: (theme) => theme.palette.text.secondary,
								},
							}}
						>
							<FormLabel color="secondary">Status</FormLabel>
							<RadioGroup
								row
								defaultValue={formik.values.status ? "active" : "deactive"}
								name="radio-status-group"
								onChange={(e) => {
									formik.setFieldValue("status", e.target.value === "active" ? true : false);
								}}
							>
								<FormControlLabel
									value={LIST_STATUS[0].value}
									control={<Radio />}
									label={LIST_STATUS[0].label}
									sx={{ width: "calc(50% - 18px)" }}
								/>
								<FormControlLabel
									value={LIST_STATUS[1].value}
									control={<Radio />}
									label={LIST_STATUS[1].label}
									sx={{ width: "calc(50% - 18px)" }}
								/>
							</RadioGroup>
						</FormControl>
					</Grid>
				)}
				<Grid
					item
					sm={12}
					sx={{
						paddingTop: "9px !important",
					}}
				>
					<TextField
						fullWidth
						label={`Organization: Yes4All`}
						size="medium"
						select
						disabled={loading}
						name="department.id"
						{...getValidateFormik({
							formik,
							field: "department.id",
							required: true,
						})}
						onChange={(e) => {
							const department = dataDepartment.find((item) => item.id === e.target.value);
							formik.setFieldValue("department", department);
							formik.setFieldValue("manager", department.managers[0]);
						}}
					>
						{dataDepartment.map(({ id, name, managers }) => (
							<MenuItem key={id} value={id} disabled={!managers.length}>
								{name}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						label="Line Manager"
						size="medium"
						select
						disabled={loading || !formik.values.department.id}
						name="manager.id"
						{...getValidateFormik({
							formik,
							field: "manager.id",
							required: true,
						})}
						onChange={(e) => {
							const manager = keyBy(dataDepartment, "id")?.[
								formik.values.department.id
							]?.managers.find((item) => item.id === e.target.value);
							formik.setFieldValue("manager", manager);
						}}
					>
						{keyBy(dataDepartment, "id")?.[formik.values.department.id]?.managers?.map(
							({ id, email }) => (
								<MenuItem key={id} value={id}>
									{email}
								</MenuItem>
							)
						)}
					</TextField>
				</Grid>
				<Grid item xs={12} sm={12} textAlign="right">
					<ButtonLoading
						loading={loading}
						variant="contained"
						type="submit"
						size="medium"
						sx={{
							mr: 1,
						}}
					>
						Save
					</ButtonLoading>
					<Button
						variant="outlined"
						type="button"
						size="medium"
						disabled={loading}
						onClick={() => {
							onClose();
							formik.resetForm();
						}}
					>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};
