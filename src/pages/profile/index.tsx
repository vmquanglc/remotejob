import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
	Box,
	Container,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	OutlinedInput,
	Paper,
	TextField,
	Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { get } from "lodash";
import React, { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ButtonLoading } from "src/components/button-loading";
import { toastOptions } from "src/components/toast/toast.options";
import { PATH } from "src/constants";
import { changePassword, requestLogout } from "src/services/auth";
import { setAuth } from "src/store/auth/actions";
import { selectAuth } from "src/store/selectors";
import { removeRefreshToken, removeToken } from "src/utils/auth";
import { getValidateFormik } from "src/utils/formik";
import { regexPassword } from "src/utils/regex";
import * as Yup from "yup";

export default function Profile() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			password: "",
			new_password: "",
			re_new_password: "",
		},
		validationSchema: Yup.object({
			password: Yup.string().required("Field is required"),
			new_password: Yup.string()
				.min(8, "Password must be at least 8 characters")
				.max(32, "Password must be at most 32 characters")
				.matches(regexPassword, {
					message:
						"Password must be 8-32 characters, with at least 1 digit, 1 letter and 1 special character",
				})
				.required("Field is required"),
			re_new_password: Yup.string()
				.required("Field is required")
				.oneOf([Yup.ref("new_password"), null], "Passwords must match"),
		}),
		onSubmit: (values) => {
			mutate({
				email: auth?.email,
				password: values.password,
				new_password: values.new_password,
			});
		},
	});

	interface IPassword {
		showCurrentPass: boolean;
		showPassword: boolean;
		showRePassword: boolean;
	}
	const [showPassword, setShowPassword] = useState<IPassword>({
		showCurrentPass: false,
		showPassword: false,
		showRePassword: false,
	});
	const auth = useSelector(selectAuth);

	const handleClickShowPassword = (name) => {
		setShowPassword((show) => ({
			...show,
			[name]: !show[`${name}`],
		}));
	};

	const handleLogout = async (): Promise<void> => {
		await requestLogout();
		dispatch(setAuth(false));
		removeToken();
		removeRefreshToken();
		navigate(PATH.LOGIN);
	};

	const { mutate, isLoading } = useMutation(changePassword, {
		onSuccess: (data) => {
			if (data?.status === 200) {
				toastOptions("success", "Change password successfully.");
				handleLogout();
			} else {
				toastOptions("error", data?.message || "Change password error.");
			}
		},
	});

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Grid container justifyContent="space-between">
					<Grid item xs={12} sm={12} mb={1}>
						<Typography variant="h6" color="primary">
							Profile
						</Typography>
					</Grid>
				</Grid>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item sm={12}>
							<Typography
								variant="body1"
								color={(theme) => theme?.palette?.text?.secondary}
								sx={{ fontWeight: "700" }}
							>
								Overall Information
							</Typography>
						</Grid>
						<Grid item xs={12} sm={1.5}>
							<TextField
								size="medium"
								name="firstName"
								placeholder={"First name"}
								label={"First name"}
								fullWidth
								value={auth?.first_name ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={2.5}>
							<TextField
								size="medium"
								name="lastName"
								placeholder="Last name"
								label="Last name"
								fullWidth
								value={auth?.last_name ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="organization"
								placeholder="Organization"
								label="Organization"
								fullWidth
								value={auth?.organization?.name ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="status"
								placeholder="Status"
								label="Status"
								fullWidth
								value={auth?.status ? "Active" : "Deactive"}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="email"
								placeholder="Email"
								label="Email"
								fullWidth
								value={auth?.email ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="department"
								placeholder="Department"
								label="Department"
								fullWidth
								value={auth?.department?.name ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="role"
								placeholder="Role"
								label="Role"
								fullWidth
								value={auth?.role?.name ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="partner"
								placeholder="Partner"
								label="Partner"
								fullWidth
								value={auth?.partner ?? ""}
								disabled
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
							<TextField
								size="medium"
								name="partner"
								placeholder="Line Manager"
								label="Line Manager"
								fullWidth
								value={auth?.manager?.full_name ?? ""}
								disabled
							/>
						</Grid>
					</Grid>
				</Paper>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12} sm={4}>
						<form onSubmit={formik.handleSubmit}>
							<Paper sx={{ p: 2, mb: 2 }}>
								<Grid container spacing={{ xs: 2, sm: 2 }}>
									<Grid item sm={12}>
										<Typography
											variant="body1"
											color={(theme) => theme?.palette?.text?.primary}
											sx={{ fontWeight: "700" }}
										>
											Change password
										</Typography>
									</Grid>
									<Grid item sm={12}>
										<FormControl variant="outlined" fullWidth>
											<OutlinedInput
												name="password"
												type={showPassword.showCurrentPass ? "text" : "password"}
												endAdornment={
													<InputAdornment position="end">
														<IconButton
															aria-label="toggle password visibility"
															onClick={() => {
																handleClickShowPassword("showCurrentPass");
															}}
															edge="end"
														>
															{showPassword.showCurrentPass ? (
																<VisibilityOff fontSize="small" />
															) : (
																<Visibility fontSize="small" />
															)}
														</IconButton>
													</InputAdornment>
												}
												placeholder="Current password"
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
												name="new_password"
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
												placeholder="New password"
												{...getValidateFormik({
													formik,
													field: "new_password",
													required: true,
												})}
											/>
											<FormHelperText
												sx={{
													color: (theme) => theme.palette.warning.main,
												}}
											>
												{get(formik, `touched.new_password`) &&
													get(formik, `errors.new_password`) &&
													formik.errors.new_password}
											</FormHelperText>
										</FormControl>
									</Grid>
									<Grid item sm={12}>
										<FormControl variant="outlined" fullWidth>
											<OutlinedInput
												name="re_new_password"
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
												placeholder="Confirm password"
												{...getValidateFormik({
													formik,
													field: "re_new_password",
													required: true,
												})}
											/>
											<FormHelperText
												sx={{
													color: (theme) => theme.palette.warning.main,
												}}
											>
												{get(formik, `touched.re_new_password`) &&
													get(formik, `errors.re_new_password`) &&
													formik.errors.re_new_password}
											</FormHelperText>
										</FormControl>
									</Grid>
									<Grid item sm={12}>
										<ButtonLoading
											type="submit"
											variant="contained"
											loading={isLoading}
											disabled={
												!(
													formik.values.password &&
													formik.values.new_password &&
													formik.values.re_new_password
												) ||
												!!get(formik, `errors.password`) ||
												!!get(formik, `errors.new_password`) ||
												!!get(formik, `errors.re_new_password`)
											}
										>
											Save
										</ButtonLoading>
									</Grid>
								</Grid>
							</Paper>
						</form>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
