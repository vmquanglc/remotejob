import React from "react";
import { connect } from "react-redux";
import { setAuth } from "../store/auth/actions";
import { selectAuth } from "../store/auth/selectors";

export const AuthStateHoc = (WrappedComp) => {
	class compWithAuthState extends React.PureComponent {
		render() {
			return <WrappedComp {...this.props} />;
		}
	}
	const mapStateToProps = (state) => ({
		auth: selectAuth(state),
	});
	const mapDispatchToProps = (dispatch) => ({
		setAuth: (value) => dispatch(setAuth(value)),
	});
	return connect(mapStateToProps, mapDispatchToProps)(compWithAuthState);
};
