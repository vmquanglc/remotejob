import { Box, Container, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { filter, find, map } from "lodash";
import React, { ChangeEvent, FC, useState } from "react";
import { Skeleton } from "src/components/skeleton";
import RequestApprovalTab from "./request-approval-tab";
import ApprovalTab from "./approval-tab";
import { useUrlSearchParams } from "use-url-search-params";
import { PrivateRouter } from "src/components/private-router";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";

const UpdateRequestsList = () => {
	const activities = useSelector(selectActivities);
	const [currentTab, setCurrentTab] = useState<string>(
		activities?.hasOwnProperty("pi_request_list_view") ? "request-approval" : "approval"
	);
	const [params, setParams]: any = useUrlSearchParams({});
	const tabs = filter(
		[
			{
				label: "Request approval",
				value: "request-approval",
				component: (
					<RequestApprovalTab
						id={params.id || null}
						setParamsUrls={setParams}
						activities={activities}
					/>
				),
				disabled: !activities?.hasOwnProperty("pi_request_list_view"),
				isHide: false,
			},
			{
				label: "Approval",
				value: "approval",
				component: <ApprovalTab activities={activities} />,
				disabled: !activities?.hasOwnProperty("pi_approval_list_view"),
				isHide: false,
			},
		],
		(item) => !item.isHide
	);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
		setParams({ id: undefined });
	};

	return (
		<Container maxWidth={false}>
			<Skeleton isLoading={false}>
				<Box mt={{ xs: 1 }}>
					<Grid container spacing={{ xs: 1, sm: 1 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Update Requests List
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
										label={tab.label}
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
				</Box>
			</Skeleton>
		</Container>
	);
};
export default PrivateRouter(UpdateRequestsList, ["pi_request_list_view", "pi_approval_list_view"]);
const TabsRoot = styled(Tabs)(() => {
	return {
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		"& .Mui-disabled": {
			display: "none",
			transition: "all 0.1s ease",
		},
	};
});
