import { Autocomplete, Button, Grid, TextField, Typography } from "@mui/material";
import { get } from "lodash";
import React from "react";
import { useQuery } from "react-query";
import { ButtonLoading } from "src/components/button-loading";
import { TextRequired } from "src/components/text-required";
import { getListEmail } from "src/services/profit-simulation/profit.services";
import { getValidateFormik } from "src/utils/formik";

export const ContentModalSentMail = ({ formik, isSending, setOpen }) => {
	const { data: listOptions, isFetching: isLoadingRoles } = useQuery(
		[`list-email`],
		() => getListEmail(),
		{
			keepPreviousData: true,
		}
	);

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }}>
			<Grid item xs={12}>
				<Typography variant="h6">{"Send email"}</Typography>
			</Grid>
			<Grid item xs={12}>
				<Autocomplete
					multiple
					freeSolo
					clearIcon={<></>}
					id="tags-outlined"
					options={listOptions?.data || []}
					getOptionLabel={(option) => option}
					filterSelectedOptions
					onChange={(_, option) => {
						formik.setFieldValue("email_to", option);
					}}
					value={formik.values.email_to}
					limitTags={2}
					disabled={isSending}
					onBlur={formik.handleBlur}
					renderInput={(params) => (
						<TextField
							{...params}
							fullWidth
							size="small"
							name="email_to"
							variant="outlined"
							label={<TextRequired>Email</TextRequired>}
							error={get(formik, `touched.email_to`) && Boolean(get(formik, `errors.email_to`))}
							helperText={
								get(formik, `touched.email_to`) && get(formik, `errors.email_to`)
									? get(formik, `errors.email_to`)
									: "Press Enter key after each email"
							}
						/>
					)}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					disabled={isSending}
					size="small"
					name="email_subject"
					variant="outlined"
					label={<TextRequired>Subject</TextRequired>}
					{...getValidateFormik({
						formik,
						field: "email_subject",
						required: true,
					})}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					size="small"
					name="email_content"
					variant="outlined"
					multiline
					minRows={3}
					disabled={isSending}
					label={"Email content"}
					{...getValidateFormik({
						formik,
						field: "email_content",
					})}
				/>
			</Grid>
			<Grid item xs={12} textAlign="right">
				<ButtonLoading
					loading={isSending}
					size="medium"
					variant="contained"
					sx={{ mr: { xs: 1, sm: 2 } }}
					onClick={() => formik.handleSubmit()}
					disabled={
						!formik.values.email_to.length ||
						!formik.values.email_subject ||
						Boolean(get(formik, `errors.email_to`)) ||
						Boolean(get(formik, `errors.email_subject`))
					}
				>
					Send email
				</ButtonLoading>
				<Button
					size="medium"
					variant="outlined"
					onClick={() => setOpen(false)}
					disabled={isSending}
				>
					Cancel
				</Button>
			</Grid>
		</Grid>
	);
};
