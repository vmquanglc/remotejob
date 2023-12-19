import React, { FC, useEffect } from "react";
import { Grid, Typography, Button, Divider, TextField } from "@mui/material";
import { useFormik } from "formik";
import { getValidateFormik } from "src/utils/formik";

interface IProps {
	isCreate?: boolean;
	onClose: (value?: any) => void;
	data: any;
}

export const AdjustPartner: FC<IProps> = ({ isCreate = true, onClose, data }) => {
	const formik = useFormik({
		initialValues: {
			code: "",
			partnerName: "",
			description: "",
		},
		onSubmit: (values) => {
			console.log("values", values);
		},
	});

	useEffect(() => {
		formik.setValues({ ...data });
	}, [data]);

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" mb={1}>
						{isCreate ? `Create partner` : `Edit role ${formik.values.partnerName}`}
					</Typography>
				</Grid>
				<Grid item xs={6}>
					<TextField
						fullWidth
						size="medium"
						name="code"
						variant="outlined"
						label="Code"
						disabled={!isCreate}
						placeholder={"Code"}
						{...getValidateFormik({
							formik,
							field: "code",
						})}
					/>
				</Grid>
				<Grid item xs={6}>
					<TextField
						fullWidth
						size="medium"
						name="partnerName"
						variant="outlined"
						label="Partner Name"
						placeholder={"Partner Name"}
						{...getValidateFormik({
							formik,
							field: "partnerName",
						})}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						fullWidth
						size="medium"
						name="description"
						variant="outlined"
						placeholder={"Description"}
						label={"Description"}
						multiline
						sx={{
							"& .MuiOutlinedInput-root": {
								padding: "0",
							},
						}}
						rows={6}
						{...getValidateFormik({
							formik,
							field: "description",
						})}
					/>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12} textAlign="right">
					<Button
						variant="contained"
						type="submit"
						size="medium"
						sx={{
							mr: 2,
						}}
					>
						Save
					</Button>
					<Button variant="outlined" type="button" size="medium" onClick={onClose}>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</form>
	);
};
