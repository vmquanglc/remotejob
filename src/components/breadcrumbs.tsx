import { FC } from "react";
import map from "lodash/map";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { PATH } from "src/constants/paths";
import { useNavigate } from "react-router-dom";
import { ThemeOptions } from "@mui/material";

const { HOME } = PATH;

const MuiBreadcrumbsRoot = styled(Box)(({ theme }) => {
	return {
		paddingTop: "0.5rem",
		paddingBottom: "0.5rem",

		"& .MuiBreadcrumbs-ol": {
			color: theme.palette.text.secondary,
			// justifyContent: "flex-end",
		},
	};
});

interface Items {
	name: string;
	path?: string;
	onClick?: () => void;
}

interface Props {
	items?: Items[];
	mainName?: string;
	pathRoot?: string;
	theme?: ThemeOptions;
}

export const MuiBreadcrumbs: FC<Props> = ({ items, mainName = "", pathRoot = `${HOME}` }) => {
	const navigate = useNavigate();
	return (
		<MuiBreadcrumbsRoot>
			<Breadcrumbs separator=">">
				{mainName && (
					<Link
						key={"Home"}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							navigate(`${pathRoot}`);
						}}
						sx={{ textDecoration: "none" }}
					>
						<Typography variant="body1" color={(theme) => theme?.palette?.text?.secondary}>
							{mainName}
						</Typography>
					</Link>
				)}
				{map(items, (item) => {
					if (item?.path) {
						return (
							<Link
								key={item.name}
								onClick={() => {
									navigate(item.path);
									item.onClick && item.onClick();
								}}
								sx={{ textDecoration: "none" }}
							>
								<Typography variant="body1" color={(theme) => theme?.palette?.text?.secondary}>
									{item.name}
								</Typography>
							</Link>
						);
					}
					return (
						<Typography
							key={item.name}
							variant="body1"
							sx={{
								cursor: item.onClick ? "pointer" : "initial",
							}}
							color={(theme) => theme?.palette?.text?.primary}
							onClick={() => {
								item.onClick && item.onClick();
							}}
						>
							{item.name}
						</Typography>
					);
				})}
			</Breadcrumbs>
		</MuiBreadcrumbsRoot>
	);
};
