import React from "react";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
import { Navigate } from "react-router-dom";

export const PrivateRouter = (Component, accessRole: string | string[]) => {
	const MiddleWareComp = (props) => {
		const activities = useSelector(selectActivities);

		if (typeof accessRole === "string" && activities?.hasOwnProperty(accessRole)) {
			return <Component {...props} />;
		}
		if (typeof accessRole === "object") {
			for (let i = 0; i < accessRole.length; i++) {
				if (activities?.hasOwnProperty(accessRole[i])) {
					return <Component {...props} />;
				}
			}
		}

		return <Navigate to="/" replace />;
	};
	return MiddleWareComp;
};
