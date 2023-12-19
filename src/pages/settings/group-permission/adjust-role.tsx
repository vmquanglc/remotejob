import { styled } from "@mui/system";
import { filter, find, map } from "lodash";
import React, { ChangeEvent, useState } from "react";
import { Grid, Typography, Tab, Tabs, Divider } from "@mui/material";
import { InformationTab } from "./information-tab";
import { PermissionOptionsTab } from "./permission-options-tab";

export const AdjustRole = ({ isView = true, onClose, data, onUpdateListing, refetchListing }) => {
	const [currentTab, setCurrentTab] = useState<string>(isView ? "groupPermission" : "information");

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	};

	const tabs = filter(
		[
			{
				labelKey: "Information",
				value: "information",
				component: (
					<InformationTab
						data={data}
						isView={isView}
						onClose={onClose}
						onUpdateListing={onUpdateListing}
					/>
				),
				isHide: false,
			},
			{
				labelKey: "Group permission",
				value: "groupPermission",
				component: (
					<PermissionOptionsTab
						data={data}
						isView={isView}
						onClose={onClose}
						refetchListing={refetchListing}
					/>
				),
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

	if (isView) {
		return (
			<Grid container justifyContent="space-between" spacing={{ xs: 2, sm: 2 }}>
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" mb={1}>
						{`Permission Activity of ${data?.code}`}
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Divider />
				</Grid>
				<Grid item xs={12}>
					<PermissionOptionsTab
						data={data}
						isView={isView}
						onClose={onClose}
						refetchListing={refetchListing}
					/>
				</Grid>
			</Grid>
		);
	}

	return (
		<>
			<Grid container justifyContent="space-between">
				<Grid item xs={12} sm={12}>
					<Typography variant="h6" color="primary" mb={1}>
						{`Edit role ${data.code}`}
					</Typography>
				</Grid>
			</Grid>
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
							<Tab key={tab.value} label={tab.labelKey} value={tab.value} />
						))}
					</TabsRoot>
				</Grid>
				<Grid item xs={12}>
					{componentCurrentTab?.component}
				</Grid>
			</Grid>
		</>
	);
};
