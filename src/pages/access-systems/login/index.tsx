import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
	FormControl,
	IconButton,
	InputAdornment,
	OutlinedInput,
	TextField,
	Typography,
	Grid,
	FormControlLabel,
	Checkbox,
	Alert,
	Divider,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";
import { IAlertState, LayoutAuth } from "src/components/layout-auth";
import { useMutation } from "react-query";
import { requestLogin } from "src/services/auth";
import { useDispatch } from "react-redux";
import { setAuth } from "src/store/auth/actions";
import { delay, get } from "lodash";
import { PATH } from "src/constants";
import FormHelperText from "@mui/material/FormHelperText";
import { regexEmail, regexPassword } from "src/utils/regex";
import { setRefreshToken, setToken } from "src/utils/auth";
import { ButtonLoading } from "src/components/button-loading";

export const LoginPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isRemember, setRemember] = useState<boolean>(false);
	const handleClickShowPassword = () => {
		setShowPassword((show) => !show);
	};

	const [alertState, setAlertState] = useState<IAlertState>({
		isOpen: false,
		type: "success",
		title: "",
	});

	const { mutate: login, isLoading } = useMutation(requestLogin, {
		onSuccess: (data) => {
			if (data?.errorCode === 400 || data?.errorCode === 422) {
				setAlertState({
					isOpen: true,
					type: "error",
					title:
						"Your email or password was incorrect. Please double-check your email and password",
				});
			} else {
				if (data.data !== null) {
					dispatch(setAuth(data.data));
					if (isRemember) {
						setRefreshToken(data.data.refresh_token);
					}
					setToken(data.data.access_token);
					delay(() => {
						navigate(PATH.HOME);
					}, 200);
				} else {
					setAlertState({
						isOpen: true,
						type: "error",
						title: data?.message ?? "Account not activated",
					});
				}
			}
		},
	});

	const formik = useFormik({
		initialValues: {
			email: "",
			password: "",
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
			password: Yup.string()
				// .min(8, "Password must be at least 8 characters")
				// .max(32, "Password must be at most 32 characters")
				// .matches(regexPassword, {
				// 	message: "Field must be a valid",
				// })
				.required("Field is required"),
		}),
		onSubmit: (values) => {
			login(values);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<LayoutAuth
				title="Login Sales Management System"
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
					<Grid item sm={12}>
						<TextField
							size="medium"
							name="email"
							placeholder={"Email"}
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
							})}
							disabled={isLoading}
						/>
					</Grid>
					<Grid item sm={12}>
						<FormControl variant="outlined" fullWidth>
							<OutlinedInput
								name="password"
								type={showPassword ? "text" : "password"}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											edge="end"
										>
											{showPassword ? (
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
								placeholder={"Password"}
								{...getValidateFormik({
									formik,
									field: "password",
									required: true,
								})}
								disabled={isLoading}
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
						<FormControlLabel
							sx={{ paddingTop: 0, paddingBottom: 0 }}
							value={isRemember}
							control={<Checkbox checked={isRemember} />}
							label={"Remember password"}
							disabled={isLoading}
							labelPlacement="end"
							onChange={() => setRemember((val) => !val)}
						/>
					</Grid>
					<Grid item sm={12}>
						<ButtonLoading
							loading={isLoading}
							variant="contained"
							fullWidth
							endIcon={<ArrowForwardIcon fontSize="medium" />}
							type="submit"
							size="large"
						>
							{"Login"}
						</ButtonLoading>
					</Grid>
					<Grid item sm={12}>
						<Divider />
					</Grid>
					<Grid item sm={12}>
						<Grid container>
							<Grid item sm={5}>
								<Typography variant="body1">
									<Link to="/reset-password" style={{ color: "#5D5A88" }}>
										{"Forgot password"}
									</Link>
								</Typography>
							</Grid>
							<Grid item sm={7} textAlign="right">
								<Typography variant="body1">
									{"Don't have an account"}?{" "}
									<Link to="/register" style={{ color: "#5D5A88" }}>
										{" "}
										{"Sign up"}
									</Link>
								</Typography>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</LayoutAuth>
		</form>
	);
};
