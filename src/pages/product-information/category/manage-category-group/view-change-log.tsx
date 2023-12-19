import { Box, Grid, Typography } from "@mui/material";
import React, { FC } from "react";
import BasicDialog from "src/components/modal";
import { Skeleton } from "src/components/skeleton";

const mappingTextCate = [
	"Master Category",
	"Super Category",
	"Main Category",
	"Category",
	"Product Line",
	"Product Variant",
];

interface IProps {
	open: boolean;
	setOpen: (value: boolean) => void;
	level: number;
	title: string;
}

export const ViewChangeLog: FC<IProps> = ({ open, setOpen, level, title }) => {
	return (
		<BasicDialog
			open={open}
			disabledBackdropClick
			handleClose={() => setOpen(false)}
			PaperProps={{
				sx: {
					margin: "15px",
					width: "100%",
					maxWidth: "900px",
				},
			}}
		>
			<Skeleton isLoading={false}>
				<Grid container spacing={{ xs: 2, sm: 2 }}>
					<Grid item xs={12}>
						<Typography variant="h6" fontWeight={"bold"}>
							{mappingTextCate[level]} (level {level + 1}) “{title}” changelog
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="body1">
							All changes are approved by the Director (except for the description field that does
							not require approval)
						</Typography>
					</Grid>
					{[1, 2, 3].map((item) => (
						<Grid item xs={12} key={item}>
							<Item />
						</Grid>
					))}
				</Grid>
			</Skeleton>
		</BasicDialog>
	);
};
const Item = ({
	first = "22/10/2023 08:40:44",
	second = `Sales Manager Dinh Nguyen Dong changed Parent category (level 2) of main category (level 3)
“Living Room Furniture” from “Kitchen & Dining” to “Furniture” Therefore, all child
categories under “Living Room Furniture” were move along with it`,
}) => {
	return (
		<Box
			sx={{
				display: "flex",
			}}
		>
			<Typography component="div" sx={{ flex: "0 0 150px" }}>
				{first}
			</Typography>
			<Typography component="div" sx={{ flex: "1 1" }}>
				{second}
			</Typography>
		</Box>
	);
};
