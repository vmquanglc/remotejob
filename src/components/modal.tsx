import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export const BasicDialog = ({
	open,
	children = {},
	handleClose,
	onClose = true,
	sxDialog = {},
	PaperProps = {},
	disabledBackdropClick = false,
}) => {
	return (
		<div>
			<Dialog
				open={open}
				onClose={(event, reason) => {
					if (reason && disabledBackdropClick && reason == "backdropClick") return;
					handleClose();
				}}
				PaperProps={PaperProps}
			>
				{onClose ? (
					<IconButton
						aria-label="close"
						onClick={handleClose}
						sx={{
							position: "absolute",
							right: 8,
							top: 8,
							color: (theme) => theme.palette.grey[500],
						}}
					>
						<CloseIcon />
					</IconButton>
				) : null}
				<DialogContent sx={{ ...sxDialog }}>{children}</DialogContent>
			</Dialog>
		</div>
	);
};

export default BasicDialog;
