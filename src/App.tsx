import { FC, ReactNode, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Box, CircularProgress } from "@mui/material";
import { Outlet } from "react-router";
import { DashboardNavbar } from "./components/dashboard-layout/dashboard-layout-navbar";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "./store/selectors";
import { checkCookies, setRefreshToken, setToken } from "./utils/auth";
import { refreshToken } from "./services/auth";
import { setAuth } from "./store/auth/actions";
import { LoggedOnRoute } from "./components/protected-router";
interface AppProps {
	children?: ReactNode;
}

const AppRoot = styled("div")(() => ({
	display: "flex",
	flex: "1 1 auto",
	maxWidth: "100%",
	paddingTop: 64,
}));

export const App: FC<AppProps> = (props) => {
	const auth = useSelector(selectAuth);
	const [refreshAuth, setRefreshAuth] = useState<boolean>(false);

	const dispatch = useDispatch();
	useEffect(() => {
		const [refreshCookie] = checkCookies();
		if (!auth && refreshCookie) {
			refreshToken(refreshCookie).then((auth) => {
				if (!auth) {
					return;
				}
				setRefreshAuth(true);
				setRefreshToken(auth.data.refresh_token);
				setToken(auth.data.access_token);
				dispatch(setAuth(auth.data));
			});
		} else {
			setRefreshAuth(true);
		}
	}, []);

	if (!refreshAuth) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flex: "1 1 auto",
					height: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<>
			<AppRoot>
				<Box
					sx={{
						display: "flex",
						flex: "1 1 auto",
						flexDirection: "column",
						width: "100%",
					}}
				>
					<LoggedOnRoute>
						<Outlet />
					</LoggedOnRoute>
				</Box>
			</AppRoot>
			<DashboardNavbar />
		</>
	);
};

App.propTypes = {
	children: PropTypes.node,
};
