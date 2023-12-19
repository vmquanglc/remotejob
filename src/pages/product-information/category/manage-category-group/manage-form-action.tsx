import React, { FC, useEffect, useState } from "react";
import { TextRequired } from "src/components/text-required";
import {
	Box,
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { getValidateFormik } from "src/utils/formik";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isNumber } from "lodash";
import { AddNewCategory } from "./add-new-category";
import { ViewChangeLog } from "./view-change-log";

const mappingTextCate = [
	"Master Category",
	"Super Category",
	"Main Category",
	"Category",
	"Product Line",
	"Product Variant",
];

interface Props {
	formData?: any;
	onSubmit?: (values: any) => void;
	setChangeCate: (values: any) => void;
	isEdit?: boolean;
	isCreate?: boolean;
}

export const MCGFormAction: FC<Props> = ({ formData, onSubmit, isEdit, setChangeCate }) => {
	const [isEditing, setIsEditing] = useState<boolean>(isEdit);
	const clearFormik = () => {
		formik.setValues({
			id: "",
			level: "",
			name: "",
			description: "",
			is_active: true,
			parentName: "",
		});
	};

	const formik = useFormik({
		initialValues: {
			id: "",
			level: null,
			name: "",
			description: "",
			is_active: true,
			parentName: "",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Field is required"),
			description: Yup.string().required("Field is required"),
		}),
		onSubmit: (values) => {
			// onSubmit({
			// 	name: values?.name,
			// 	id: values?.id,
			// 	is_active: values?.is_active,
			// 	description: values?.description,
			// 	level: values?.level,
			// 	updatedBy: "thuat",
			// });
			setIsEditing(false);
			clearFormik();
		},
	});

	useEffect(() => {
		if (formData?.name) {
			formik.setValues({
				name: formData?.name,
				description: formData?.description,
				is_active: !!formData?.is_active,
				id: formData?.id,
				level: formData?.level,
				parentName: formData?.parentName,
			});
		} else {
			clearFormik();
		}
		setIsEditing(false);
	}, [formData?.name]);

	const [openOptions, setOpenOptions] = useState<boolean>(false);

	const handleClose = () => {
		setOpenOptions(false);
	};

	const handleOpen = () => {
		setOpenOptions(true);
	};
	interface IStateCate {
		isOpen: boolean;
		level: number;
	}
	const [stateCate, setStateCate] = useState<IStateCate>({
		isOpen: false,
		level: null,
	});
	const [openLog, setOpenLog] = useState<boolean>(false);

	return (
		<>
			<form onSubmit={formik.handleSubmit}>
				<Grid container spacing={{ xs: "12px" }} alignItems="flex-end">
					{!!formik.values?.id && (
						<Grid item xs={12} sm={12}>
							<Typography variant="body1" fontWeight={"bold"} color={"text.primary"}>
								1.Structure
							</Typography>
						</Grid>
					)}
					{!!formik.values.id && formik.values.level > 0 && (
						<Grid item xs={12} sm={12}>
							<TextField
								fullWidth
								size="small"
								name="parentName"
								disabled
								label={<TextRequired>Parent Category</TextRequired>}
								{...getValidateFormik({ formik, field: "parentName" })}
							/>
						</Grid>
					)}
					<Grid item xs={12} sm={12}>
						<TextField
							fullWidth
							size="small"
							value={isNumber(formik.values.level) ? mappingTextCate[formik.values?.level] : ""}
							disabled
							label={
								<TextRequired>
									Level {isNumber(formik.values.level) ? formik.values.level + 1 : ""}
								</TextRequired>
							}
						/>
					</Grid>
					{!!formik.values.id && (
						<>
							<Grid item xs={12} sm={12}>
								<Select
									fullWidth
									size="small"
									name="bulkActions"
									variant="outlined"
									value="Change structure category"
									open={openOptions}
									onClose={handleClose}
									onOpen={handleOpen}
									multiple={false}
									sx={{ backgroundColor: "#F2F1FA" }}
								>
									<MenuItem
										value={"Change structure category"}
										disabled={true}
										sx={{ fontWeight: "700", display: "none" }}
									>
										Change structure category
									</MenuItem>
									{formik.values.level !== 0 && (
										<MenuItem
											value={"export"}
											onClick={() => {
												setChangeCate({
													isOpen: true,
													currentCate: formData?.name,
													currentLevel: formData?.level,
													parentCate: formData?.parentName,
													parentLevel: formData?.level - 1,
												});
											}}
										>
											Change parent category
										</MenuItem>
									)}
									{!formData.is_last_child && (
										<MenuItem
											value={"delete"}
											onClick={() => {
												setStateCate({
													isOpen: true,
													level: +formik.values.level + 1,
												});
											}}
										>
											Add New {mappingTextCate[formik.values.level + 1]} (level{" "}
											{formik.values.level + 2})
										</MenuItem>
									)}
								</Select>
							</Grid>
							<Grid item xs={12} sm={12}>
								<Typography variant="body1" fontWeight={"bold"} color={"text.primary"}>
									2.Detail
								</Typography>
							</Grid>
						</>
					)}
					<Grid item xs={12} sm={12}>
						<TextField
							fullWidth
							size="small"
							name="name"
							disabled={!isEditing}
							label={<TextRequired>Title</TextRequired>}
							{...getValidateFormik({ formik, field: "name" })}
						/>
					</Grid>
					{!!formik.values.id && (
						<Grid item xs={12} sm={12}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<FormControlLabel
									control={<Checkbox size="medium" checked={formik.values.is_active} />}
									label="Active"
									onChange={(e: any) => formik.setFieldValue("is_active", e.target.checked)}
									disabled={!isEditing}
								/>
								<Button
									variant="text"
									onClick={() => setOpenLog(true)}
									sx={{
										textDecoration: "underline",
										textUnderlinePosition: "under",
										color: "info.main",
									}}
								>
									View change log
								</Button>
							</Box>
						</Grid>
					)}
					<Grid item xs={12} sm={12}>
						<TextField
							fullWidth
							label="Description"
							name="description"
							size="small"
							disabled={!isEditing}
							multiline
							rows={4}
							{...getValidateFormik({ formik, field: "description" })}
						/>
					</Grid>
					{!!formik.values.id && (
						<>
							{isEditing ? (
								<>
									<Grid item xs={6}>
										<Button
											fullWidth
											variant="outlined"
											sx={{
												backgroundColor: "#F2F1FA",
											}}
											onClick={() => setIsEditing(false)}
										>
											Update
										</Button>
									</Grid>
									<Grid item xs={6}>
										<Button
											fullWidth
											variant="outlined"
											onClick={() => {
												setIsEditing(false);
												formik.setValues({
													name: formData?.name,
													description: formData?.description,
													is_active: !!formData?.is_active,
													id: formData?.id,
													level: formData?.level,
													parentName: formData?.parentName,
												});
											}}
										>
											Cancel
										</Button>
									</Grid>
								</>
							) : (
								<Grid item xs={12}>
									<Button
										fullWidth
										variant="outlined"
										sx={{
											backgroundColor: "#F2F1FA",
										}}
										onClick={() => setIsEditing(true)}
									>
										Update detail
									</Button>
								</Grid>
							)}
						</>
					)}
				</Grid>
			</form>
			{stateCate.isOpen && (
				<AddNewCategory
					open={stateCate.isOpen}
					setOpen={(val) => {
						setStateCate({
							isOpen: val,
							level: null,
						});
					}}
					level={stateCate.level}
					parentCate={formik.values.name}
				/>
			)}
			{openLog && (
				<ViewChangeLog
					open={openLog}
					setOpen={setOpenLog}
					level={formData.level}
					title={formData.name}
				/>
			)}
		</>
	);
};
