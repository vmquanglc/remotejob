import { useFormik } from "formik";

import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";

import { getValidateFormik } from "src/utils/formik";
import { Button, Divider, IconButton, InputBase, Paper, Typography } from "@mui/material";
import { clone, isEmpty, mergeWith } from "lodash";
import { delKeysNonExist } from "src/utils/common";
import { Search } from "@mui/icons-material";

export const MCGSearchCategory = ({ onSubmit, title }) => {
	const formik = useFormik({
		initialValues: {
			title: title ?? "",
		},
		onSubmit: (values) => {
			let cloneValues = clone(values);
			if (isEmpty(values.title)) {
				delete cloneValues.title;
			}

			onSubmit && onSubmit(mergeWith({ title: undefined }, delKeysNonExist(cloneValues)));
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<Grid container spacing={{ xs: 1, sm: 2 }} alignItems="flex-end" justifyContent="flex-end">
				<Grid item xs={12}>
					<Typography variant="body1" fontWeight={"bold"} color={"text.primary"} mb={1}>
						Search
					</Typography>
					<Paper sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							size="medium"
							name="title"
							placeholder="Search for a category"
							fullWidth
							{...getValidateFormik({ formik, field: "title" })}
						/>
						<Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
						<IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
							<Search />
						</IconButton>
					</Paper>
				</Grid>
			</Grid>
		</form>
	);
};
