import { Box, Container, Paper, Grid, Typography, Tabs, Tab } from "@mui/material";
import { styled } from "@mui/material/styles";
import { filter, find, map } from "lodash";
import React, { useState, ChangeEvent } from "react";
import FolderIcon from "@mui/icons-material/Folder";
import ReceiptIcon from "@mui/icons-material/Receipt";
import AdjustmentTab from "./adjustment-tab";
import HistoryTab from "./history-tab";
import { useQuery } from "react-query";
import { getAssumption } from "src/services/profit-simulation/profit.services";
import { PrivateRouter } from "src/components/private-router";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
import { DetailAssumptions } from "./detail-assumptions";

const TabsRoot = styled(Tabs)(() => {
	return {
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		"& .Mui-disabled": {
			display: "none",
			transition: "all 0.1s ease",
		},
	};
});

const Assumption = () => {
	const activities = useSelector(selectActivities);

	const {
		data: assumptionData,
		isFetching: isLoading,
		refetch,
	} = useQuery([`get-assumption-info}`], () => getAssumption("yes4all"), {
		keepPreviousData: true,
		enabled: activities?.hasOwnProperty("ps_assumption_view"),
	});

	const [currentTab, setCurrentTab] = useState<string>(
		activities?.hasOwnProperty("ps_assumption_view") ? "adjustment" : "history"
	);
	const tabs = filter(
		[
			{
				labelKey: "Adjustment",
				value: "adjustment",
				component: (
					<AdjustmentTab
						assumption={assumptionData?.data}
						refetch={refetch}
						activities={activities}
					/>
				),
				icon: <FolderIcon />,
				isHide: false,
				disabled: !activities?.hasOwnProperty("ps_assumption_view"),
			},
			{
				labelKey: "History",
				value: "history",
				component: <HistoryTab activities={activities} />,
				icon: <ReceiptIcon />,
				isHide: false,
				disabled: !activities?.hasOwnProperty("ps_assumption_manage_update"),
			},
		],
		(item) => !item.isHide
	);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	};
	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container justifyContent="space-between">
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Assumption
							</Typography>
						</Grid>
					</Grid>
					{!activities?.hasOwnProperty("ps_assumption_manage_update") ? (
						<Box sx={{ mt: 1 }}>
							<DetailAssumptions assumption={assumptionData?.data} />
						</Box>
					) : (
						<Grid container spacing={{ xs: 2, sm: 2 }}>
							<Grid item xs={12}>
								<TabsRoot
									indicatorColor="primary"
									onChange={handleOnChangeTab}
									scrollButtons="auto"
									textColor="primary"
									value={currentTab}
									variant="scrollable"
								>
									{map(tabs, (tab) => (
										<Tab
											key={tab.value}
											label={tab.labelKey}
											value={tab.value}
											disabled={tab.disabled}
											icon={tab.icon}
											iconPosition="start"
										/>
									))}
								</TabsRoot>
							</Grid>
							<Grid item xs={12}>
								{componentCurrentTab?.component}
							</Grid>
						</Grid>
					)}
				</Paper>
			</Box>
		</Container>
	);
};

export default PrivateRouter(Assumption, ["ps_assumption_view", "ps_assumption_manage_update"]);
