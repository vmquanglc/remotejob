import React, { useEffect, useState, ChangeEvent } from "react";
import { Container, Box, Grid, Typography, Tabs, styled, Tab } from "@mui/material";
import { filter, find, map } from "lodash";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
import { getAssumption, getSuggestDuty } from "src/services/profit-simulation/profit.services";
import { IAssumption } from "src/interface/profitSimulation.interface";
import { CalculatorTab } from "./calculator-tab";
import { SavedListTab } from "./saved-list";
import { PrivateRouter } from "src/components/private-router";
import { Skeleton } from "src/components/skeleton";

const Variations = () => {
	const [assumption, setAssumption] = useState<IAssumption | null>(null);
	const [suggestDuty, setSuggestDuty] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			const resAssumption = await getAssumption("yes4all");
			const resSuggestDuty = await getSuggestDuty("yes4all");
			if (resAssumption.status === 200) {
				setAssumption(resAssumption?.data);
			}
			if (resSuggestDuty.status === 200) {
				setSuggestDuty(resSuggestDuty?.data);
			}
			setLoading(false);
		})();
	}, []);

	const activities = useSelector(selectActivities);
	const [currentTab, setCurrentTab] = useState<string>(
		activities?.hasOwnProperty("ps_calculate_profit_simulation") ? "calculator" : "saved-list"
	);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	};

	const tabs = filter(
		[
			{
				labelKey: "Calculator",
				value: "calculator",
				component: <CalculatorTab assumption={assumption} suggestDuty={suggestDuty} />,
				disabled: !activities?.hasOwnProperty("ps_calculate_profit_simulation"),
				isHide: false,
			},
			{
				labelKey: "Saved list",
				value: "saved-list",
				component: <SavedListTab />,
				disabled: !activities.hasOwnProperty("ps_saved_list_view"),
				isHide: false,
			},
		],
		(item) => !item.isHide
	);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const TabsRoot = styled(Tabs)(() => {
		return {
			borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
			"& .Mui-disabled": {
				display: "none",
				transition: "all 0.1s ease",
			},
		};
	});

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 2 }}>
				<Skeleton isLoading={loading}>
					<Grid container spacing={{ xs: 2, sm: 2 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Check Profit Simulation
							</Typography>
						</Grid>
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
										iconPosition="start"
									/>
								))}
							</TabsRoot>
						</Grid>
						<Grid item xs={12}>
							{componentCurrentTab?.component}
						</Grid>
					</Grid>
				</Skeleton>
			</Box>
		</Container>
	);
};
export default PrivateRouter(Variations, ["ps_calculate_profit_simulation", "ps_saved_list_view"]);
