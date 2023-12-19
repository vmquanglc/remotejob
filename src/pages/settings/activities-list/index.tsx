import React from "react";
import {
	Container,
	Paper,
	Box,
	Grid,
	Typography,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import { keyBy, without } from "lodash";
import { useQuery } from "react-query";
import { ExpandMore } from "@mui/icons-material";
import { Skeleton } from "src/components/skeleton";
import { getRoleInActivities } from "src/services/settings/activities.services";
import { ALL_ACTIVITIES } from "src/constants/activities.constant";
import { PrivateRouter } from "src/components/private-router";

const ActivitiesListing = () => {
	const { data, isFetching: isLoading } = useQuery(
		[`get-role-in-activities`],
		() => getRoleInActivities(),
		{
			keepPreviousData: true,
		}
	);

	const [expanded, setExpanded] = React.useState<string[] | []>([]);

	const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? Array.from(new Set([...expanded, panel])) : without(expanded, panel));
	};

	const dataRole = keyBy(data?.data, "code");

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Skeleton isLoading={isLoading}>
					<Paper sx={{ p: 2, mb: 2 }}>
						<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12} sm={12}>
								<Typography variant="h6" color="primary">
									{"Activities List"}
								</Typography>
							</Grid>
							<Grid item xs={12}>
								{ALL_ACTIVITIES.map((item) => {
									return (
										<AccordionCustom
											key={item.code}
											expanded={expanded}
											item={item}
											handleChange={handleChange}
											dataRole={dataRole}
										/>
									);
								})}
							</Grid>
						</Grid>
					</Paper>
				</Skeleton>
			</Box>
		</Container>
	);
};

export default PrivateRouter(ActivitiesListing, "activity_list_view");

const AccordionCustom = ({ expanded, item, handleChange, dataRole }) => {
	const isExpanded = (data: string[], id: string) => {
		return data.includes(id);
	};
	return (
		<>
			{item?.children?.length ? (
				<>
					<Accordion
						disableGutters
						expanded={isExpanded(expanded, item.code)}
						onChange={handleChange(item.code)}
						key={item.code}
					>
						<AccordionSummary
							expandIcon={item?.children?.length ? <ExpandMore /> : <></>}
							aria-controls="panel1bh-content"
							id={item.code}
						>
							<Typography sx={{ color: "text.primary", fontWeight: 500 }}>{item.name}</Typography>
						</AccordionSummary>
						<AccordionDetails
							sx={{
								borderTop: "1px solid #CCCCCC",
								padding: "8px",
							}}
							key={item.code}
						>
							{item?.children?.map((item: any) => (
								<AccordionCustom
									key={item.code}
									expanded={expanded}
									item={item}
									handleChange={handleChange}
									dataRole={dataRole}
								/>
							))}
						</AccordionDetails>
					</Accordion>
				</>
			) : (
				<>
					<Box sx={{ display: "flex", padding: "5px 15px" }}>
						<Typography sx={{ width: "40%", flexShrink: 0 }}>{item.name}</Typography>
						<Typography sx={{ color: "text.primary" }}>
							{"Role"}:{" "}
							{dataRole?.[`${item.code}`]?.roles?.map((item) => `${item.name}`)?.join(", ")}
						</Typography>
					</Box>
				</>
			)}
		</>
	);
};
