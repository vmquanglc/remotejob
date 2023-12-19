import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { clone, isEmpty, map, mergeWith } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { getValidateFormik } from "src/utils/formik";
import { Box, MenuItem, Select, Tooltip } from "@mui/material";
import { DesktopDatePicker } from "src/components/desktop-date-picker";
import { formatDateToString } from "src/utils/date";
import SearchIcon from "@mui/icons-material/Search";
import BasicDialog from "src/components/modal";
import * as Yup from "yup";
import { toastOptions } from "src/components/toast/toast.options";
import { useMutation } from "react-query";
import {
	exportExcelPSListGroup,
	sentMailGroupRecord,
} from "src/services/profit-simulation/profit.services";
import { ContentModalSentMail } from "./content-modal-sent-mail";
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

const SearchProductName = ({ onSubmit, searchByValue }) => {
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
		case "name":
			component = <SearchProductName {...customProps} />;
			break;
		default:
			component = <SearchByDate {...customProps} />;
	}
	return component;
};

export const SavedListSearch = ({ onSearch, valuesSearch, selectedRows, setSelectedRows }) => {
	const [searchType, setSearchType] = useState<string>("name");
	const [valuesSearchState, setValuesSearchState] = useState(valuesSearch);
	const initialSearchParam = {
		searchBy: undefined,
		searchByValue: undefined,
	};

	const searchByOptions = [{ label: "Record Name", value: "name", status: false }];

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
		if (["name"].includes(searchType) && isEmpty(values.searchByValue)) {
			delete cloneValues.searchByValue;
			delete cloneValues.searchBy;
		}

		onSearch && onSearch(mergeWith(initialSearchParam, cloneValues));
	};

	const [open, setOpen] = useState<boolean>(false);
	const formik = useFormik({
		initialValues: {
			email_to: [],
			email_subject: "",
			email_content: "",
		},
		validationSchema: Yup.object({
			email_to: Yup.array()
				.min(1, "Email To field must have at least 1 items")
				.required("Required"),
			email_subject: Yup.string()
				.max(150, "The subject must be at most 150 characters")
				.required("Required"),
		}),
		onSubmit: async (values) => {
			await onSentMail({
				profit_simulation_group_ids: Object.keys(selectedRows).map(Number),
				...values,
			});
		},
	});

	const { mutate: onSentMail, isLoading: isSending } = useMutation(async (data: any) => {
		try {
			const response: any = await sentMailGroupRecord(data);
			if (response?.status !== 200) {
				toastOptions("error", "Sent mail error");
				return false;
			} else {
				setOpen(false);
				formik.resetForm();
				setSelectedRows({});
				toastOptions("success", "Sent mail success");
				return true;
			}
		} catch (error) {
			toastOptions("error", "Sent mail error");
			return false;
		}
	});

	const { mutate: handleExport, isLoading: isGetting } = useMutation(
		async (ids: number[] | string[]) => {
			try {
				const response = await exportExcelPSListGroup(ids);
				if (response.status === 200) {
					toastOptions("success", "Export successfully");
				} else {
					toastOptions("error", "Export error");
				}
				setSelectedRows({});
			} catch (error) {
				return false;
			}
		}
	);

	const [openOptions, setOpenOptions] = useState<boolean>(false);

	const handleClose = () => {
		setOpenOptions(false);
	};

	const handleOpen = () => {
		setOpenOptions(true);
	};

	return (
		<>
			<Grid container spacing={{ xs: 2, sm: 2 }} alignItems="flex-end">
				<Grid item>
					<Select
						fullWidth
						size="small"
						name="bulkActions"
						variant="outlined"
						value="Bulk Actions"
						open={openOptions}
						onClose={handleClose}
						onOpen={handleOpen}
						multiple={false}
						sx={{
							width: 140,
						}}
					>
						<MenuItem
							value={"Bulk Actions"}
							disabled={true}
							sx={{ fontWeight: "700", display: "none" }}
						>
							Bulk Actions
						</MenuItem>
						<Tooltip title="Select rows to enable button" placement="right">
							<Box>
								<MenuItem
									value={"export"}
									sx={{ fontWeight: "700" }}
									disabled={!Object.keys(selectedRows).length}
									onClick={() => {
										handleExport(Object.keys(selectedRows));
										handleClose();
									}}
								>
									Export
								</MenuItem>
							</Box>
						</Tooltip>
						<Tooltip title="Select rows to enable button" placement="right">
							<Box>
								<MenuItem
									value={"sent email"}
									sx={{ fontWeight: "700" }}
									disabled={!Object.keys(selectedRows).length}
									onClick={() => {
										setOpen(true);
										handleClose();
									}}
								>
									Send emails
								</MenuItem>
							</Box>
						</Tooltip>
					</Select>
				</Grid>
				<Grid item>
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
			{open && (
				<BasicDialog
					open={open}
					disabledBackdropClick
					handleClose={() => setOpen(false)}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							background: "#F2F1FA",
							maxWidth: "600px",
						},
					}}
				>
					<ContentModalSentMail formik={formik} isSending={isSending} setOpen={setOpen} />
				</BasicDialog>
			)}
		</>
	);
};
