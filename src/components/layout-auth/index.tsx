import { Box, Paper, Typography } from "@mui/material";
import React, { FC } from "react";
import PropTypes from "prop-types";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import { Container } from "@mui/system";

interface ILayoutAuth {
	children: React.ReactNode;
	renderAlert?: React.ReactNode;
	isShow?: boolean;
	hasAlert?: boolean;
	title: string;
}

export interface IAlertState {
	isOpen: boolean;
	type: "success" | "error" | "warning" | "info";
	title: string;
}

export const LayoutAuth: FC<ILayoutAuth> = ({
	title,
	children,
	isShow = false,
	hasAlert = false,
	renderAlert,
}) => {
	return (
		<Box
			sx={{
				mt: 3,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				minHeight: "100vh",
			}}
		>
			<Box sx={{ flex: "1 1" }}>
				<Container>
					<Paper
						sx={{
							mb: 2,
							pt: hasAlert ? "65px" : "90px",
							pb: "75px",
							backgroundColor: "#F9F9FF",
							margin: "auto",
							position: "relative",
						}}
					>
						<Box
							sx={{
								position: "absolute",
								top: "10px",
								left: "10px",
								display: "flex",
								alignItems: "flex-start",
							}}
						>
							<Box
								sx={{
									mr: 3,
									display: "flex",
									width: 124,
									position: "relative",
									cursor: "pointer",
									"& img": {
										width: "100%",
										height: "auto",
									},
								}}
							>
								<Logo />
							</Box>{" "}
						</Box>
						{hasAlert && (
							<Box
								sx={{
									minHeight: "75px",
								}}
							>
								{isShow && renderAlert}
							</Box>
						)}
						<Typography
							variant="h4"
							textAlign="center"
							sx={{
								mb: "55px",
							}}
						>
							{title}
						</Typography>
						<Box
							sx={{
								background: "#F2F1FA",
								borderRadius: "25px",
								padding: "60px 32px",
								maxWidth: "400px",
								width: "100%",
								boxSizing: "border-box",
								margin: "auto",
							}}
						>
							{children}
						</Box>
					</Paper>
				</Container>
			</Box>
		</Box>
	);
};

LayoutAuth.propTypes = {
	children: PropTypes.node,
	title: PropTypes.string,
};
