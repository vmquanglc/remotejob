import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { FC } from "react";
import { ButtonLoading } from "src/components/button-loading";
import BasicDialog from "src/components/modal";
import { Skeleton } from "src/components/skeleton";
import { TextRequired } from "src/components/text-required";

import { getValidateFormik } from "src/utils/formik";
import * as Yup from "yup";
const mappingTextCate = [
	"Master Category",
	"Super Category",
	"Main Category",
	"Category",
	"Product Line",
	"Product Variant",
];

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	level: number;
	parentCate: string;
}

export const AddNewCategory: FC<IProps> = ({ open, setOpen, level, parentCate }) => {
	const formik = useFormik({
		initialValues: {
			title: "",
			description: "",
		},
		validationSchema: Yup.object().shape({
			title: Yup.string().required("Field is required"),
			description: Yup.string().required("Field is required"),
		}),
		onSubmit: (value) => {
			setOpen(false);
		},
	});

	return (
		<BasicDialog
			open={open}
			disabledBackdropClick
			handleClose={() => setOpen(false)}
			PaperProps={{
				sx: {
					margin: "15px",
					width: "100%",
					maxWidth: "450px",
				},
			}}
		>
			<Skeleton isLoading={false}>
				<form onSubmit={formik.handleSubmit}>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6" fontWeight={"bold"}>
								Add New {mappingTextCate[level]} (level {level + 1})
							</Typography>
						</Grid>
						{level > 0 && (
							<Grid item xs={12}>
								<TextField
									size="medium"
									name="Parent category"
									label={<TextRequired>Parent category</TextRequired>}
									fullWidth
									disabled
									value={parentCate}
								/>
							</Grid>
						)}
						<Grid item xs={12}>
							<TextField
								size="medium"
								name="title"
								label={<TextRequired>Title</TextRequired>}
								fullWidth
								{...getValidateFormik({
									formik,
									field: "title",
									required: true,
								})}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Description"
								name="description"
								size="medium"
								multiline
								rows={4}
								{...getValidateFormik({ formik, field: "description" })}
							/>
						</Grid>
						<Grid item xs={12} sm={12} textAlign="right">
							<ButtonLoading
								loading={false}
								disabled={
									!!Object.keys(formik.errors).length ||
									!formik.values.title ||
									!formik.values.description
								}
								variant="contained"
								type="submit"
								size="medium"
								sx={{
									mr: 1,
								}}
								onClick={() => {}}
							>
								Save
							</ButtonLoading>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								disabled={false}
								onClick={() => {
									setOpen(false);
								}}
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</form>
			</Skeleton>
		</BasicDialog>
	);
};
