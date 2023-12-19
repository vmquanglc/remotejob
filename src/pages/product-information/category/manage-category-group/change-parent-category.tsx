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
	data: any;
}

export const ChangeParentCate: FC<IProps> = ({ open, setOpen, data }) => {
	const formik = useFormik({
		initialValues: {
			title: "",
		},
		validationSchema: Yup.object().shape({
			title: Yup.string().required("Field is required"),
		}),
		onSubmit: (value) => {},
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
								Change parent category
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1">
								New parent category requires to be on the same level as current parent category
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<TextField
								size="medium"
								label={`Selected ${mappingTextCate[data?.currentLevel + 1]} (level ${
									data?.currentLevel + 1
								})`}
								fullWidth
								disabled
								value={data?.currentCate}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								size="medium"
								label={`Current ${mappingTextCate[data?.parentLevel + 1]} (level ${
									data?.parentLevel + 1
								})`}
								fullWidth
								disabled
								value={data?.parentCate}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								size="medium"
								name="title"
								label={
									<TextRequired>{`New ${mappingTextCate[data?.parentLevel + 1]} (level ${
										data?.parentLevel + 1
									})`}</TextRequired>
								}
								fullWidth
								{...getValidateFormik({
									formik,
									field: "title",
									required: true,
								})}
							/>
						</Grid>

						<Grid item xs={12} sm={12} textAlign="right">
							<ButtonLoading
								loading={false}
								disabled={!!Object.keys(formik.errors).length || !formik.values.title}
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
