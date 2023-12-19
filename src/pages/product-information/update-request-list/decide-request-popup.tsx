import { Button, Grid, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { FC } from "react";
import { useMutation } from "react-query";
import { ButtonLoading } from "src/components/button-loading";
import BasicDialog from "src/components/modal";
import { TextRequired } from "src/components/text-required";
import { toastOptions } from "src/components/toast/toast.options";
import { decidedRequest } from "src/services/product-info/update-requests-list.services";
import { getValidateFormik } from "src/utils/formik";
import * as Yup from "yup";

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	isApproved: boolean;
	dataDecide: any;
	setSelectedRows: (value?: any) => void;
	refetch: (value?: any) => void;
}

export const DecideRequestPopup: FC<IProps> = ({
	open,
	setOpen,
	isApproved,
	dataDecide,
	setSelectedRows,
	refetch,
}) => {
	const validate = Object.keys(dataDecide).reduce((obj, key) => {
		obj[key] = Yup.object({
			reason: Yup.string().required("Field is required"),
		});
		return obj;
	}, {});
	const formik = useFormik({
		initialValues: {
			...dataDecide,
		},
		validationSchema: Yup.object().shape(validate),
		onSubmit: (value) => {
			onDecide({
				data: Object.values(value).map((item: any) => ({
					request_id: item.id,
					reason: item.reason,
				})),
				status: false,
			});
		},
	});

	const { mutate: onDecide, isLoading: isLoadingApproved } = useMutation(async (data: any) => {
		try {
			const response: any = await decidedRequest(data);
			if (response?.status !== 200) {
				toastOptions("error", `${isApproved ? "Approve" : "Decline"} request error`);
				return false;
			} else {
				toastOptions("success", `${isApproved ? "Approve" : "Decline"} request success`);
				setOpen(false);
				setSelectedRows({});
				refetch();
				return true;
			}
		} catch (error) {
			toastOptions("error", `${isApproved ? "Approve" : "Decline"} request error`);
			return false;
		}
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
			{isApproved ? (
				<>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6" fontWeight={"bold"}>
								Approve request?
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1">You have selected requests below:</Typography>
							{Object.values(dataDecide).map((item: any) => (
								<Typography key={item.id} variant="body1" sx={{ px: 1, paddingTop: "5px" }}>
									- {item.name}
								</Typography>
							))}
						</Grid>
						<Grid item xs={12}>
							<Typography variant="body1">
								Data will be updated after the requests has been approved. This action cannot be
								reverted.
							</Typography>
						</Grid>
						<Grid item xs={12} sm={12} textAlign="right">
							<ButtonLoading
								loading={isLoadingApproved}
								disabled={isLoadingApproved}
								variant="contained"
								type="button"
								color="success"
								size="medium"
								sx={{
									mr: 1,
								}}
								onClick={() =>
									onDecide({
										data: Object.values(dataDecide).map((item: any) => ({
											request_id: item.id,
										})),
										status: true,
									})
								}
							>
								Approve
							</ButtonLoading>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								disabled={isLoadingApproved}
								onClick={() => {
									setOpen(false);
								}}
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</>
			) : (
				<>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12}>
							<Typography variant="h6" fontWeight={"bold"}>
								Decline request?
							</Typography>
						</Grid>
						{Object.values(dataDecide).map((item: any) => (
							<Grid item xs={12} key={item.id}>
								<TextField
									size="medium"
									name={`${item.id}.reason`}
									label={<TextRequired>{`Refusal reason of ${item.name}`}</TextRequired>}
									fullWidth
									multiline
									minRows={2}
									{...getValidateFormik({
										formik,
										field: `${item.id}.reason`,
										required: true,
									})}
								/>
							</Grid>
						))}
						<Grid item xs={12} sm={12} textAlign="right">
							<ButtonLoading
								loading={isLoadingApproved}
								disabled={isLoadingApproved}
								variant="contained"
								type="button"
								color="error"
								size="medium"
								sx={{
									mr: 1,
								}}
								onClick={() => formik.handleSubmit()}
							>
								Decline
							</ButtonLoading>
							<Button
								variant="outlined"
								type="button"
								size="medium"
								disabled={isLoadingApproved}
								onClick={() => {
									setOpen(false);
								}}
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</>
			)}
		</BasicDialog>
	);
};
