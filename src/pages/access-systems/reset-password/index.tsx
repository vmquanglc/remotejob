import {
	TextField,
	Typography,
	Grid,
	Button,
	Divider,
	Alert,
	FormControl,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormHelperText,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";
import { IAlertState, LayoutAuth } from "src/components/layout-auth";
import * as Yup from "yup";
import { regexEmail, regexPassword } from "src/utils/regex";
import { delay, get, omit } from "lodash";
import { requestOTP, resetPassword, validOTP } from "src/services/auth";
import { useMutation } from "react-query";
import { ButtonLoading } from "src/components/button-loading";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function ResetPassword() {
	const [step, setStep] = useState<"email" | "otp" | "password">("email");
	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			email: "",
			otp: "",
			password: "",
			rePassword: "",
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email("Field must be a valid")
				.min(12, "Email must be at least 12 characters")
				.max(50, "Email must be at most 50 characters")
				.matches(regexEmail, {
					message: "Field must be a valid",
				})
				.required("Field is required"),
			otp: Yup.string().max(6).min(6).required("Field is required"),
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
			console.log("submit reset password", values);
			onResetPass(omit(values, ["rePassword"]));
		},
	});
	interface IPassword {
		showPassword: boolean;
		showRePassword: boolean;
	}
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

	const renderHtml = () => {
		if (step === "email") {
			return (
				<>
					<Grid item sm={12}>
						<TextField
							size="medium"
							name="email"
							placeholder={"Enter registered mail"}
							fullWidth
							sx={{
								"& .MuiOutlinedInput-root": {
									background: "#fff",
								},
							}}
							{...getValidateFormik({
								formik,
								field: "email",
								required: true,
								handleChange: () => {
									setAlertState((state) => ({
										...state,
										isOpen: false,
									}));
								},
							})}
						/>
					</Grid>
					<Grid item sm={12}>
						<ButtonLoading
							loading={isGetting}
							variant="contained"
							fullWidth
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								!!formik.values.email && getOTP(formik.values.email);
							}}
							type="button"
							size="large"
							disabled={!!get(formik, `errors.email`) || !formik.values.email}
						>
							Continue
						</ButtonLoading>
					</Grid>
					<Grid item sm={12}>
						<Divider />
					</Grid>
					<Grid item sm={12}>
						<Typography variant="body1">
							<Link to="/login" style={{ color: "#5D5A88" }}>
								Return to Login page
							</Link>
						</Typography>
					</Grid>
				</>
			);
		}
		if (step === "otp") {
			return (
				<>
					<Grid item sm={12}>
						<TextField
							size="medium"
							name="email"
							placeholder={"Enter registered mail"}
							fullWidth
							disabled
							sx={{
								"& .MuiOutlinedInput-root": {
									background: "#fff",
								},
							}}
							{...getValidateFormik({
								formik,
								field: "email",
								required: true,
							})}
						/>
					</Grid>
					<Grid item sm={12}>
						<TextField
							size="medium"
							name="otp"
							placeholder={"Enter OTP code"}
							fullWidth
							sx={{
								"& .MuiOutlinedInput-root": {
									background: "#fff",
								},
							}}
							{...getValidateFormik({
								formik,
								field: "otp",
								required: true,
							})}
						/>
					</Grid>
					<Grid item sm={12}>
						<ButtonLoading
							loading={isSending}
							variant="contained"
							fullWidth
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								!!formik.values.otp &&
									sendOTP({
										email: formik.values.email,
										otp: formik.values.otp,
									});
								!!formik.values.otp &&
									setAlertState((state) => ({
										...state,
										isOpen: false,
									}));
							}}
							type="button"
							size="large"
							disabled={
								!!get(formik, `errors.email`) || !!get(formik, `errors.otp`) || !formik.values.otp
							}
						>
							Confirm to change password
						</ButtonLoading>
					</Grid>
					<Grid item sm={12}>
						<Divider />
					</Grid>
					<Grid item sm={6}>
						<Typography
							variant="body1"
							onClick={() => {
								formik.resetForm();
								setStep("email");
								setAlertState((state) => ({
									...state,
									isOpen: false,
								}));
							}}
							sx={{ cursor: "pointer", textDecoration: "underline" }}
						>
							Return to enter email page
						</Typography>
					</Grid>
					<Grid item sm={6} textAlign="right">
						<Typography
							variant="body1"
							onClick={() => {
								getOTP(formik.values.email);
								setAlertState((state) => ({
									...state,
									isOpen: false,
								}));
							}}
							sx={{ cursor: "pointer", textDecoration: "underline" }}
						>
							Get a new OTP code
						</Typography>
					</Grid>
				</>
			);
		}
		return (
			<>
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
							placeholder="New password"
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
				<Grid item sm={12}>
					<ButtonLoading
						variant="contained"
						fullWidth
						type="submit"
						size="large"
						loading={isLoading}
					>
						Save
					</ButtonLoading>
				</Grid>
				<Grid item sm={12}>
					<Divider />
				</Grid>
				<Grid item sm={12}>
					<Typography
						variant="body1"
						onClick={() => {
							formik.resetForm();
							setStep("email");
							setAlertState((state) => ({
								...state,
								isOpen: false,
							}));
						}}
						sx={{ cursor: "pointer", textDecoration: "underline" }}
					>
						Return to reset password page
					</Typography>
				</Grid>
			</>
		);
	};

	//control alert

	const [alertState, setAlertState] = useState<IAlertState>({
		isOpen: false,
		type: "success",
		title: "",
	});
	const { mutate: getOTP, isLoading: isGetting } = useMutation(requestOTP, {
		onSuccess: (data) => {
			if (data?.status === 200) {
				setAlertState({
					isOpen: true,
					type: "success",
					title:
						"OTP code has been sent to your email, please check your email to get the code.\nNote: OTP code valid within 3 minutes.",
				});
				setStep("otp");
			} else {
				setAlertState({
					isOpen: true,
					type: "error",
					title: "Your email was incorrect, please type correctly your registered email",
				});
			}
		},
	});

	const { mutate: sendOTP, isLoading: isSending } = useMutation(validOTP, {
		onSuccess: (data) => {
			if (data?.status === 200) {
				setStep("password");
			} else {
				setAlertState({
					isOpen: true,
					type: "error",
					title:
						data?.message === "Your OTP has expired"
							? "Your OTP code was expired, please get a new OTP code"
							: "Your OTP code was incorrect, please type correctly your OTP code",
				});
			}
		},
	});
	const { mutate: onResetPass, isLoading } = useMutation(resetPassword, {
		onSuccess: (data) => {
			if (data?.status === 200) {
				setAlertState({
					isOpen: true,
					type: "success",
					title: "The new password has been updated successfully, login to access system.",
				});
				delay(() => navigate("/login"), 1000);
			} else {
				setAlertState({
					isOpen: true,
					type: "error",
					title: "Your OTP code was expired, please get a new OTP code",
				});
				setStep("otp");
			}
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<LayoutAuth
				title="Reset password"
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
				<Grid container rowSpacing={{ sm: "18px" }}>
					{renderHtml()}
				</Grid>
			</LayoutAuth>
		</form>
	);
}
