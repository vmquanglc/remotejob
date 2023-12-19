import { FC } from "react";

import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

interface Props {
	title: string;
	placement?:
		| "bottom-end"
		| "bottom-start"
		| "bottom"
		| "left-end"
		| "left-start"
		| "left"
		| "right-end"
		| "right-start"
		| "right"
		| "top-end"
		| "top-start"
		| "top";
	fontSize?: "small" | "medium" | "large" | "inherit";
	sx?: React.CSSProperties;
}

const ToolTipStyled = styled("div")(({ theme }) => {
	return {
		color: "#5D5A88",
		display: "inline-flex",
	};
});

export const ToolTip: FC<Props> = ({
	title,
	placement = "top",
	fontSize = "small",
	sx,
	...props
}) => {
	return (
		<ToolTipStyled>
			<Tooltip
				title={title}
				placement={placement}
				componentsProps={{
					tooltip: {
						sx: {
							color: "#fff",
							backgroundColor: "rgba(97, 97, 97, 0.9)",
							margin: "0",
							marginBottom: "5px !important",
							padding: "6px 8px",
							width: "100%",
							whiteSpace: "nowrap",
							maxWidth: "unset",
							fontSize: "12px",
							boxShadow: " rgba(0, 0, 0, 0.16) 0px 1px 4px",
							...sx,
						},
					},
				}}
				{...props}
			>
				<InfoIcon fontSize={fontSize} sx={{ cursor: "pointer" }} />
			</Tooltip>
		</ToolTipStyled>
	);
};
