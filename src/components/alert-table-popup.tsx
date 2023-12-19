import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import React, { FC, ReactNode } from "react";
import { MuiTable } from "./mui-table";

export interface IData {
	id: number;
	key: string;
	status: string;
}

export interface IStateError {
	title: string | ReactNode;
	isOpen: boolean;
	data: IData[];
	columns: any;
}
interface Props {
	data: IData[];
	columns: any;
	handleClose: () => void;
	title: string | ReactNode;
	handleConfirm?: () => void;
	hasCTABottom?: boolean;
}
export const AlertTablePopup: FC<Props> = ({
	data,
	columns,
	handleClose,
	title,
	handleConfirm,
	hasCTABottom = true,
}) => {
	return (
		<Container maxWidth={false}>
			<Paper
				sx={{
					p: 2,
					mb: 2,
					boxShadow: "none",
					marginBottom: 0,
					padding: "16px 0",
					marginTop: 0,
				}}
			>
				<Grid container spacing={{ xs: 1, sm: 2 }}>
					<Grid item sm={12} textAlign="center">
						<Typography variant="h5" color="red">
							{title}
						</Typography>
					</Grid>
					<Grid item sm={12}>
						<MuiTable
							data={data}
							columns={columns}
							enableTopToolbar={false}
							enableRowNumbers
							muiTableContainerProps={{ sx: { maxHeight: "400px" } }}
						/>
					</Grid>
					{hasCTABottom && (
						<Grid
							item
							sm={12}
							sx={{
								justifyContent: "space-between",
								display: "flex",
								alignItems: "center",
							}}
						>
							<Button
								size="small"
								variant="outlined"
								onClick={() => {
									handleClose();
								}}
								sx={{ width: "50%", mr: 1 }}
							>
								Cancel
							</Button>
							<Button
								size="small"
								variant="contained"
								onClick={() => {
									handleConfirm && handleConfirm();
									handleClose();
								}}
								sx={{ width: "50%", ml: 1 }}
							>
								Uncheck all
							</Button>
						</Grid>
					)}
				</Grid>
			</Paper>
		</Container>
	);
};
