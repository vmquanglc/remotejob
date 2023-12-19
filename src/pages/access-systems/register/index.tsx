import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
	FormControl,
	IconButton,
	InputAdornment,
	OutlinedInput,
	TextField,
	Typography,
	Grid,
	Button,
	FormHelperText,
	FormLabel,
	MenuItem,
	Divider,
	Alert,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";
import * as Yup from "yup";
import { IAlertState, LayoutAuth } from "src/components/layout-auth";
import { delay, get, keyBy, map, omit } from "lodash";
import { regexEmail, regexPassword } from "src/utils/regex";
import { useMutation, useQuery } from "react-query";
import { getOrganizations, registerAccount } from "src/services/auth";
import { ButtonLoading } from "src/components/button-loading";
interface IPassword {
	showPassword: boolean;
	showRePassword: boolean;
}

export default function Register() {
	const navigate = useNavigate();
	const [departments, setDepartments] = useState({});
	const [showPassword, setShowPassword] = useState<IPassword>({
		showPassword: false,
		showRePassword: false,
	});
	const handleClickShowPassword = (name) => {
		setShowPassword((show) => ({
			...show,
			[name]: !show[`${name}`],
		}));
	};

	const formik = useFormik({
		initialValues: {
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			rePassword: "",
			manager_id: "",
			department_id: "",
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
			department_id: Yup.string().required("Field is required"),
			manager_id: Yup.string().required("Field is required"),
			email: Yup.string()
				.email("Field must be a valid")
				.min(12, "Email must be at least 12 characters")
				.max(50, "Email must be at most 50 characters")
				.matches(regexEmail, {
					message: "Field must be a valid",
				})
				.required("Field is required"),

			password: Yup.string()
				.min(8, "Password must be at least 8 characters")
				.max(32, "Password must be at most 32 characters")
				.matches(regexPassword, {
					message:
						"Password must be 8-32 characters, with at least 1 digit, 1 letter and 1 special character",
				})
				.required("Field is required"),
			rePassword: Yup.string()
				.required("Field is required")
				.oneOf([Yup.ref("password"), null], "Passwords must match"),
		}),
		onSubmit: (values) => {
			register(omit(values, ["rePassword"]));
		},
	});

	const [alertState, setAlertState] = useState<IAlertState>({
		isOpen: false,
		type: "success",
		title: "",
	});

	useQuery([`get-organizations`], () => getOrganizations(), {
		onSuccess: (data) => {
			if (data?.status === 200 && data?.data) {
				setDepartments(keyBy(data?.data?.departments, "id"));
				formik.setFieldValue("department_id", data?.data?.departments?.[0]?.id);
				formik.setFieldValue("manager_id", data?.data?.departments?.[0]?.managers?.[0]?.id);
			}
		},
		keepPreviousData: true,
	});

	const { mutate: register, isLoading } = useMutation(registerAccount, {
		onSuccess: (data) => {
			if (data?.status === 200) {
				setAlertState({
					isOpen: true,
					type: "success",
					title: "registerScreens.registerSuccess",
				});
				delay(() => navigate("/login"), 3000);
			} else {
				console.log("object", data);
				setAlertState({
					isOpen: true,
					type: "error",
					title: `registerScreens.${data?.code}`,
				});
			}
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<LayoutAuth
				title="Sign up Sales Management System"
				isShow={alertState.isOpen}
				hasAlert={true}
				renderAlert={
					<Alert
						severity={alertState.type}
						onClose={() =>
							setAlertState({
								isOpen: false,
								type: "success",
								title: "",
							})
						}
					>
						{alertState.title}
					</Alert>
				}
			>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item sm={5}>
						<TextField
							size="medium"
							name="first_name"
							placeholder="First name"
							fullWidth
							sx={{
								"& .MuiOutlinedInput-root": {
									background: "#fff",
								},
							}}
							{...getValidateFormik({
								formik,
								field: "first_name",
								required: true,
							})}
						/>
					</Grid>
					<Grid item sm={7}>
						<TextField
							sx={{
								"& .MuiOutlinedInput-root": {
									background: "#fff",
								},
							}}
							size="medium"
							name="last_name"
							placeholder="Last name"
							fullWidth
							{...getValidateFormik({
								formik,
								field: "last_name",
								required: true,
							})}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							sx={{
								"& .MuiOutlinedInput-root": {
									background: "#fff",
								},
							}}
							size="medium"
							name="email"
							placeholder="Email"
							fullWidth
							{...getValidateFormik({
								formik,
								field: "email",
								required: true,
							})}
						/>
					</Grid>
					<Grid item sm={12}>
						<FormControl variant="outlined" fullWidth>
							<OutlinedInput
								name="password"
								type={showPassword.showPassword ? "text" : "password"}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleClickShowPassword("showPassword");
											}}
											edge="end"
										>
											{showPassword.showPassword ? (
												<VisibilityOff fontSize="small" />
											) : (
												<Visibility fontSize="small" />
											)}
										</IconButton>
									</InputAdornment>
								}
								sx={{
									background: "#fff",
								}}
								placeholder="Password"
								{...getValidateFormik({
									formik,
									field: "password",
									required: true,
								})}
							/>
							<FormHelperText
								sx={{
									color: (theme) => theme.palette.warning.main,
								}}
							>
								{get(formik, `touched.password`) &&
									get(formik, `errors.password`) &&
									formik.errors.password}
							</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item sm={12}>
						<FormControl variant="outlined" fullWidth>
							<OutlinedInput
								name="rePassword"
								type={showPassword.showRePassword ? "text" : "password"}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={() => {
												handleClickShowPassword("showRePassword");
											}}
											edge="end"
										>
											{showPassword.showRePassword ? (
												<VisibilityOff fontSize="small" />
											) : (
												<Visibility fontSize="small" />
											)}
										</IconButton>
									</InputAdornment>
								}
								sx={{
									background: "#fff",
								}}
								placeholder="Confirm password"
								{...getValidateFormik({
									formik,
									field: "rePassword",
									required: true,
								})}
							/>
							<FormHelperText
								sx={{
									color: (theme) => theme.palette.warning.main,
								}}
							>
								{get(formik, `touched.rePassword`) &&
									get(formik, `errors.rePassword`) &&
									formik.errors.rePassword}
							</FormHelperText>
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<>
							<FormLabel color="secondary" sx={{ mb: 1, display: "inline-block" }}>
								Organization: Yes4All
							</FormLabel>
							<TextField
								fullWidth
								placeholder="Department"
								size="medium"
								select
								name="department_id"
								sx={{
									"& .MuiOutlinedInput-root": {
										background: "#fff",
									},
								}}
								{...getValidateFormik({
									formik,
									field: "department_id",
									required: true,
									handleChange: (e) => {
										formik.setFieldValue(
											"manager_id",
											departments?.[`${e.target.value}`]?.managers?.[0]?.id
										);
									},
								})}
							>
								{map(
									departments,
									({ id, name, managers }: { id: number; name: string; managers: any[] }) => (
										<MenuItem key={id} value={id} disabled={!managers.length}>
											{name}
										</MenuItem>
									)
								)}
							</TextField>
						</>
					</Grid>
					<Grid item xs={12}>
						<>
							<FormLabel color="secondary" sx={{ mb: 1, display: "inline-block" }}>
								Line Manager
							</FormLabel>
							<TextField
								fullWidth
								placeholder="Line Manager"
								size="medium"
								select
								sx={{
									"& .MuiOutlinedInput-root": {
										background: "#fff",
									},
								}}
								name="manager_id"
								{...getValidateFormik({
									formik,
									field: "manager_id",
									required: true,
								})}
							>
								{map(departments?.[`${formik.values.department_id}`]?.managers, ({ id, email }) => (
									<MenuItem key={id} value={id}>
										{email}
									</MenuItem>
								))}
							</TextField>
						</>
					</Grid>
					<Grid item sm={12}>
						<ButtonLoading
							loading={isLoading}
							variant="contained"
							fullWidth
							endIcon={<ArrowForwardIcon fontSize="small" />}
							type="submit"
							size="large"
						>
							Sign up
						</ButtonLoading>
					</Grid>
					<Grid item sm={12}>
						<Divider />
					</Grid>
					<Grid item sm={12}>
						<Typography variant="body1">
							You have an account?
							<Link to="/login" style={{ color: "#5D5A88" }}>
								{" "}
								Login
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</LayoutAuth>
		</form>
	);
}
