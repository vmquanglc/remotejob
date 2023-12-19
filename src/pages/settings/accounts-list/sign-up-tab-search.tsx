import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { clone, isEmpty, map, mergeWith } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { getValidateFormik } from "src/utils/formik";
import { MenuItem, Typography } from "@mui/material";
import { DesktopDatePicker } from "src/components/desktop-date-picker";
import { formatDateToString } from "src/utils/date";
import SearchIcon from "@mui/icons-material/Search";
import { capitalizeFirstLetter } from "src/utils/common";
import { useMutation } from "react-query";
import { actionSignUp } from "src/services/accounts-list";
import { toastOptions } from "src/components/toast/toast.options";

import BasicDialog from "src/components/modal";
import { ButtonLoading } from "src/components/button-loading";
interface SearchByDateValues {
	searchByValue?: string;
	fromValue?: string;
	toValue?: string;
	onSubmit?: (values: any) => void;
}
const SearchByDate = ({ onSubmit, searchByValue, fromValue, toValue }: SearchByDateValues) => {
	const valueOption = useMemo(() => {
		return {
			last7days: "last7days",
			last15days: "last15days",
			last30days: "last30days",
			last60days: "last60days",
			last90days: "last90days",
		};
	}, []);

	const [minDate, setMinDate] = useState(0);

	const formik = useFormik({
		initialValues: {
			searchByValue: searchByValue ?? valueOption?.last7days,
			fromValue: fromValue,
			toValue: toValue,
		},
		onSubmit,
	});

	const options = [
		{ label: "Last 07 days", value: valueOption?.last7days },
		{ label: "Last 15 days", value: valueOption?.last15days },
		{ label: "Last 30 days", value: valueOption?.last30days },
		{ label: "Last 60 days", value: valueOption?.last60days },
		{ label: "Last 90 days", value: valueOption?.last90days },
		{ label: "Custom Payment Date Range", value: "custom" },
	];

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<TextField
						fullWidth
						size="small"
						name="searchByValue"
						select
						sx={{ width: 200 }}
						{...getValidateFormik({
							formik,
							field: "searchByValue",
						})}
						onChange={(e) => {
							formik.setFieldValue("searchByValue", e.target.value);
							formik.setFieldValue("fromValue", null);
							formik.setFieldValue("toValue", null);
						}}
					>
						{map(options, ({ label, value }) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				{formik?.values?.searchByValue === "custom" && (
					<>
						<Grid item>
							<DesktopDatePicker
								size="small"
								disableFuture
								onChange={(value: string) => {
									setMinDate(Date.parse(value));
									formik.setFieldValue("fromValue", formatDateToString(value));
								}}
								value={formik.values.fromValue}
								renderInput={(params) => (
									<TextField
										{...params}
										sx={{ width: 200 }}
										name="fromValue"
										inputProps={{
											...params.inputProps,
											placeholder: "Start Date",
										}}
									/>
								)}
							/>
						</Grid>
						<Grid item>
							<DesktopDatePicker
								size="small"
								disableFuture
								onChange={(value: string) =>
									formik.setFieldValue("toValue", formatDateToString(value))
								}
								value={formik.values.toValue}
								minDate={new Date(minDate)}
								renderInput={(params) => {
									return (
										<TextField
											{...params}
											sx={{ width: 200 }}
											name="toValue"
											inputProps={{
												...params.inputProps,
												placeholder: "End Date",
											}}
										/>
									);
								}}
							/>
						</Grid>
					</>
				)}
				<Grid item>
					<Button type="submit" size="small" variant="contained">
						Search
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

const SearchFullName = ({ onSubmit, searchByValue }) => {
	const formik = useFormik({
		initialValues: {
			searchByValue: searchByValue,
		},
		onSubmit,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<TextField
						fullWidth
						size="medium"
						name="searchByValue"
						variant="standard"
						placeholder={"Enter data search"}
						sx={{ width: 180 }}
						{...getValidateFormik({
							formik,
							field: "searchByValue",
						})}
					/>
				</Grid>
				<Grid item>
					<Button
						type="submit"
						size="small"
						variant="text"
						sx={{
							minWidth: "40px",
							padding: "7px",
						}}
					>
						<SearchIcon fontSize="medium" />
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};
const SearchEmail = ({ onSubmit, searchByValue }) => {
	const formik = useFormik({
		initialValues: {
			searchByValue: searchByValue,
		},
		onSubmit,
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<TextField
						fullWidth
						size="medium"
						name="searchByValue"
						variant="standard"
						placeholder={"Enter data search"}
						sx={{ width: 180 }}
						{...getValidateFormik({
							formik,
							field: "searchByValue",
						})}
					/>
				</Grid>
				<Grid item>
					<Button
						type="submit"
						size="small"
						variant="text"
						sx={{
							minWidth: "40px",
							padding: "7px",
						}}
					>
						<SearchIcon fontSize="medium" />
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};

const SearchBy = ({ searchType, onSubmit, searchByValue }) => {
	let component = <div></div>;
	let customProps = { onSubmit, searchByValue };
	switch (searchType) {
		case "full_name":
			component = <SearchFullName {...customProps} />;
			break;
		case "email":
			component = <SearchEmail {...customProps} />;
			break;
		default:
			component = <SearchByDate {...customProps} />;
	}
	return component;
};

enum ActionType {
	approved = "approved",
	reject = "reject",
}

interface IStateAction {
	isOpen: boolean;
	type: ActionType | "";
}

export const SignUpTabSearch = ({ onSearch, valuesSearch, selectedRows, refetch, activities }) => {
	const [stateAction, setStateAction] = useState<IStateAction>({
		isOpen: false,
		type: "",
	});
	const [searchType, setSearchType] = useState<string>("full_name");
	const [valuesSearchState, setValuesSearchState] = useState(valuesSearch);
	const initialSearchParam = {
		searchBy: undefined,
		searchByValue: undefined,
	};

	const searchByOptions = [
		{ label: "Full name", value: "full_name", status: false },
		{ label: "Email", value: "email", status: false },
	];

	useEffect(() => {
		setValuesSearchState(valuesSearch);
	}, [JSON.stringify(valuesSearch)]);

	useEffect(() => {
		valuesSearch?.searchBy && setSearchType(valuesSearch?.searchBy);
	}, [valuesSearch?.searchBy]);

	const handleOnChangeSearchType = (event) => {
		setSearchType(event.target.value);
		setValuesSearchState((state) => ({
			...state,
			searchByValue: undefined,
		}));
	};

	const handleOnSubmit = (values: any) => {
		let cloneValues = clone(values);
		cloneValues.searchBy = searchType;
		if (["full_name"].includes(searchType) && isEmpty(values.searchByValue)) {
			delete cloneValues.searchByValue;
			delete cloneValues.searchBy;
		}

		onSearch && onSearch(mergeWith(initialSearchParam, cloneValues));
	};

	const { mutate: onActionSignUp, isLoading } = useMutation(
		async (data: { id: string[] | number[]; status: boolean }) => {
			if (!activities.hasOwnProperty("signup_approve")) {
				toastOptions("error", `You are not authorized to do`);
				setStateAction({ isOpen: false, type: "" });
				return;
			}
			try {
				const response: any = await actionSignUp(data);
				if (response?.status === 200) {
					toastOptions("success", `${data.status ? "Approve" : "Reject"} successfully.}`);
					refetch();
					setStateAction({ isOpen: false, type: "" });
					return true;
				} else {
					toastOptions(
						"error",
						`${data.status ? "Approve" : "Reject"} ${`${response?.message || "error"}`}`
					);
					setStateAction({ isOpen: false, type: "" });
					return false;
				}
			} catch (error) {
				toastOptions(
					"error",
					`${data.status ? "Approve" : "Reject"} ${`${error?.message || "error"}`}`
				);
				setStateAction({ isOpen: false, type: "" });
				return false;
			}
		}
	);

	return (
		<>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<Button
						size="medium"
						variant="contained"
						sx={{ mr: 2 }}
						disabled={
							!Object.keys(selectedRows).length || !activities.hasOwnProperty("signup_approve")
						}
						onClick={() =>
							activities.hasOwnProperty("signup_approve") &&
							setStateAction({ isOpen: true, type: ActionType.approved })
						}
					>
						Approve
					</Button>
					<Button
						size="medium"
						variant="outlined"
						color="error"
						sx={{ mr: 2 }}
						disabled={
							!Object.keys(selectedRows).length || !activities.hasOwnProperty("signup_approve")
						}
						onClick={() =>
							activities.hasOwnProperty("signup_approve") &&
							setStateAction({ isOpen: true, type: ActionType.reject })
						}
					>
						Reject
					</Button>
					<TextField
						fullWidth
						select
						size="medium"
						name="searchBy"
						id="searchBy"
						variant="standard"
						SelectProps={{
							multiple: false,
							value: searchType,
							onChange: handleOnChangeSearchType,
						}}
						sx={{ width: 180 }}
					>
						{map(searchByOptions, ({ label, value, status }) => (
							<MenuItem key={value} value={value} disabled={status}>
								{label}
							</MenuItem>
						))}
					</TextField>
				</Grid>
				<Grid item>
					<SearchBy
						onSubmit={handleOnSubmit}
						searchType={searchType}
						searchByValue={valuesSearchState?.searchByValue}
					/>
				</Grid>
			</Grid>
			{stateAction.isOpen && stateAction.type && (
				<BasicDialog
					open={stateAction.isOpen && stateAction.type}
					handleClose={() => {
						setStateAction({ isOpen: false, type: "" });
					}}
					disabledBackdropClick
					onClose={false}
					PaperProps={{
						sx: {
							maxWidth: "430px",
							margin: "15px",
							width: "100%",
						},
					}}
				>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6">
								{stateAction.type === ActionType.approved
									? "Approve selected sign-up request?"
									: "Reject selected sign-up request?"}
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1">
								{stateAction.type === ActionType.approved
									? "This action cannot be reverted."
									: "This action cannot be reverted."}
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} textAlign="right">
							<ButtonLoading
								loading={isLoading}
								variant="contained"
								type="button"
								size="medium"
								sx={{
									mr: 1,
								}}
								onClick={() =>
									stateAction.type === ActionType.approved
										? onActionSignUp({
												id: Object.keys(selectedRows),
												status: true,
										  })
										: onActionSignUp({
												id: Object.keys(selectedRows),
												status: false,
										  })
								}
							>
								Confirm
							</ButtonLoading>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								disabled={isLoading}
								onClick={() => {
									setStateAction({ isOpen: false, type: "" });
								}}
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</BasicDialog>
			)}
		</>
	);
};
