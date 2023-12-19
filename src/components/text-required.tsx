import { FC, ReactNode } from "react";
import { styled } from "@mui/material/styles";

const ColorRequired = styled("span")(({ theme }) => {
	return {
		color: theme.palette.error.main,
	};
});

interface Props {
	children: ReactNode;
	required?: boolean;
}

export const TextRequired: FC<Props> = ({ children }) => {
	const iconRequired = "*";
	return (
		<span>
			{children} <ColorRequired>{iconRequired}</ColorRequired>
		</span>
	);
};
