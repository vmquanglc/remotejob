import { Box, CircularProgress, Paper } from "@mui/material";
import React, { FC, ReactNode } from "react";

interface IProps {
	loading: boolean;
	children: ReactNode;
	sx?: any;
}

export const PaperLoading: FC<IProps> = ({ loading, children, sx }) => {
	return (
		<Paper sx={{ ...sx, position: "relative" }}>
			{loading && (
				<Box
					sx={{
						position: "absolute",
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						top: 0,
						left: 0,
						zIndex: 1000,
						backgroundColor: "rgba(0,0,0,0.1)",
					}}
				>
					<CircularProgress size={20} />
				</Box>
			)}
			{children}
		</Paper>
	);
};
