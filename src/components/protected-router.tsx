import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { refreshToken } from "src/services/auth";
import { setAuth } from "src/store/auth/actions";
import { selectAuth } from "src/store/selectors";
import { checkCookies, setRefreshToken, setToken } from "src/utils/auth";

export const LoggedOnRoute = ({ children }) => {
	const auth = useSelector(selectAuth);

	if (!auth) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export const LoggedOutRoute = ({ children }) => {
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

	if (auth) {
		return <Navigate to="/" replace />;
	}

	return children;
};
