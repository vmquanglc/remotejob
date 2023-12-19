import React from "react";
import { Button, CircularProgress } from "@mui/material";
import { ButtonProps } from "@mui/material/Button";

export type ButtonLoadingProps<C extends React.ElementType> = ButtonProps<C, { component?: C }> & {
	loading: boolean;
};

export function ButtonLoading<C extends React.ElementType>(props: ButtonLoadingProps<C>) {
	const { loading, children, ...buttonProps } = props;
	return (
		<Button
			{...buttonProps}
			sx={{
				...buttonProps.sx,
				position: "relative",
			}}
			disabled={buttonProps.disabled || loading}
		>
			{loading && (
				<CircularProgress
					size="20px"
					sx={{
						position: "absolute",
						top: "calc(50% - 10px)",
						left: "calc(50% - 10px)",
					}}
				/>
			)}
			{children}
		</Button>
	);
}
