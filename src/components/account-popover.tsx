import type { FC } from "react";
import PropTypes from "prop-types";

import {
	Avatar,
	Box,
	Divider,
	ListItemIcon,
	ListItemText,
	MenuItem,
	Popover,
	Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { UserCircle } from "./icons/user-circle";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "src/store/auth/actions";
import { PATH } from "src/constants";
import { removeRefreshToken, removeToken } from "src/utils/auth";
import { selectAuth } from "src/store/selectors";
import PersonIcon from "@mui/icons-material/Person";
import { requestLogout } from "src/services/auth";

interface AccountPopoverProps {
	anchorEl: null | Element;
	onClose?: () => void;
	open?: boolean;
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
	const { anchorEl, onClose, open, ...other } = props;
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const auth = useSelector(selectAuth);

	const handleLogout = async (): Promise<void> => {
		dispatch(setAuth(false));
		removeToken();
		removeRefreshToken();
		navigate(PATH.LOGIN);
		await requestLogout();
	};

	return (
		<Popover
			anchorEl={anchorEl}
			anchorOrigin={{
				horizontal: "center",
				vertical: "bottom",
			}}
			keepMounted
			onClose={onClose}
			open={open}
			PaperProps={{ sx: { width: 300 } }}
			transitionDuration={0}
			{...other}
		>
			<Box
				sx={{
					alignItems: "center",
					p: 2,
					display: "flex",
				}}
			>
				<Avatar
					sx={{
						height: 40,
						width: 40,
						background: "#ADABC3",
					}}
				>
					<PersonIcon
						fontSize="medium"
						sx={{
							color: "#fff",
						}}
					/>
				</Avatar>
				<Box
					sx={{
						ml: 1,
					}}
				>
					<Typography variant="body1">
						{auth?.first_name} {auth?.last_name}
					</Typography>
					<Typography color="textSecondary" variant="body1">
						{auth?.email}
					</Typography>
				</Box>
			</Box>
			<Divider />
			<Box sx={{ my: 1 }}>
				{/* <MenuItem disabled onClick={() => navigate("/account")}>
					<ListItemIcon>
						<SettingsIcon color="primary" />
					</ListItemIcon>
					<ListItemText primary={<Typography variant="body1">Settings</Typography>} />
				</MenuItem> */}
				<MenuItem
					onClick={() => {
						navigate("/profile");
						onClose();
					}}
				>
					<ListItemIcon>
						<UserCircle color="primary" />
					</ListItemIcon>
					<ListItemText primary={<Typography variant="body1">Profile</Typography>} />
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleLogout}>
					<ListItemIcon>
						<LogoutIcon color="primary" />
					</ListItemIcon>
					<ListItemText
						primary={
							<Typography variant="body1" color="text.primary">
								Logout
							</Typography>
						}
					/>
				</MenuItem>
			</Box>
		</Popover>
	);
};

AccountPopover.propTypes = {
	anchorEl: PropTypes.any,
	onClose: PropTypes.func,
	open: PropTypes.bool,
};
