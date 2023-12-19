import { MenuItem, Tooltip, Typography, Button, TextField, Grid, Box, Select } from "@mui/material";
import BasicDialog from "src/components/modal";
import { TextRequired } from "src/components/text-required";
import { ButtonLoading } from "src/components/button-loading";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";
import * as Yup from "yup";
import { AlertTablePopup, IStateError } from "src/components/alert-table-popup";
import { useEffect, useState } from "react";

export const VariationsSearch = ({
	selectedRows,
	onClear,
	handleSaveRecord,
	setOpen,
	isOpen,
	isCreating,
	handleExport,
	handleDeleteRow,
	listCannotSave,
	handleConfirmModal,
	handleDuplicate,
}) => {
	const activities = useSelector(selectActivities);
	const formik = useFormik({
		initialValues: {
			name: "",
		},
		validationSchema: Yup.object({
			name: Yup.string()
				.required("Required")
				.max(150, "The string must be at most 150 characters")
				.matches(/^[a-zA-Z0-9 !@#$&()%\-_`.+,\"]*$/, "Only alphabets are allowed for this field "),
		}),
		onSubmit: (value) => {
			handleSaveRecord(value.name);
		},
	});

	useEffect(() => {
		if (!isOpen) {
			formik.resetForm();
		}
	}, [isOpen]);

	const [stateError, setStateError] = useState<IStateError>({
		title: "Warning",
		isOpen: false,
		data: [],
		columns: [
			{
				header: "Asin",
				accessorKey: "asin",
				size: 120,
				enableColumnActions: false,
				enableColumnDragging: false,
			},
		],
	});

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
					<Button
						variant="contained"
						disabled={
							!Object.keys(selectedRows).length || !activities.hasOwnProperty("ps_record_save")
						}
						onClick={() => {
							if (listCannotSave.length > 0) {
								setStateError({
									...stateError,
									title: `There ${listCannotSave?.length === 1 ? "is" : "are"} ${
										listCannotSave?.length
									} ASIN${listCannotSave?.length === 1 ? "" : "s"} cannot be save`,
									isOpen: true,
									data: listCannotSave,
								});
							} else {
								activities.hasOwnProperty("ps_record_save") && setOpen(true);
							}
						}}
					>
						Save
					</Button>
				</Grid>
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
							// background: "#F2F1FA",
							// "& .MuiOutlinedInput-root": {
							// 	fontWeight: 700,
							// 	"& .MuiOutlinedInput-notchedOutline": {
							// 		borderColor: "transparent! important",
							// 	},
							// },
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
										if (listCannotSave.length > 0) {
											setStateError({
												...stateError,
												title: `There ${listCannotSave?.length === 1 ? "is" : "are"} ${
													listCannotSave?.length
												} ASIN${listCannotSave?.length === 1 ? "" : "s"} cannot be export`,
												isOpen: true,
												data: listCannotSave,
											});
										} else {
											handleExport(Object.keys(selectedRows));
										}
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
									value={"delete"}
									sx={{ fontWeight: "700" }}
									disabled={!Object.keys(selectedRows).length}
									onClick={() => {
										handleDeleteRow(Object.keys(selectedRows));
										handleClose();
									}}
								>
									Delete
								</MenuItem>
							</Box>
						</Tooltip>
						<Tooltip title="Select rows to enable button" placement="right">
							<Box>
								<MenuItem
									value={"duplicate"}
									sx={{ fontWeight: "700" }}
									disabled={!Object.keys(selectedRows).length}
									onClick={() => {
										handleDuplicate(Object.keys(selectedRows));
										handleClose();
									}}
								>
									Duplicate
								</MenuItem>
							</Box>
						</Tooltip>
					</Select>
				</Grid>
				<Grid item>
					<Button variant="outlined" onClick={() => onClear()}>
						Clear
					</Button>
				</Grid>
			</Grid>
			{isOpen && (
				<BasicDialog
					disabledBackdropClick
					open={isOpen}
					handleClose={() => {
						setOpen(false);
						formik.setFieldValue("name", "");
					}}
					PaperProps={{
						sx: {
							margin: "15px",
							width: "100%",
							background: "#F2F1FA",
							maxWidth: "400px",
						},
					}}
				>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6">Add a name to save the record</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								size="small"
								name="name"
								variant="outlined"
								label={<TextRequired>Record name</TextRequired>}
								fullWidth
								{...getValidateFormik({
									formik,
									field: "name",
									required: true,
								})}
							/>
						</Grid>
						<Grid item xs={12} sm={12} textAlign="right">
							<ButtonLoading
								variant="contained"
								type="button"
								size="medium"
								sx={{
									mr: 1,
								}}
								onClick={() => formik.handleSubmit()}
								loading={isCreating}
								disabled={!formik.values.name || isCreating}
							>
								Save
							</ButtonLoading>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								disabled={isCreating}
								onClick={() => {
									setOpen(false);
									formik.setFieldValue("name", "");
								}}
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</BasicDialog>
			)}
			{stateError.isOpen && (
				<BasicDialog
					open={stateError.isOpen}
					onClose={false}
					handleClose={() => setStateError({ ...stateError, isOpen: false })}
					sxDialog={{
						padding: "15px 15px 15px",
					}}
					PaperProps={{
						sx: {
							maxWidth: "450px",
							margin: "15px",
							width: "100%",
						},
					}}
				>
					<AlertTablePopup
						title={stateError.title}
						data={stateError.data}
						columns={stateError.columns}
						handleClose={() => setStateError({ ...stateError, isOpen: false })}
						handleConfirm={() => handleConfirmModal(stateError.data.map((item) => item.id))}
					/>
				</BasicDialog>
			)}
		</>
	);
};
