import { Box, Container, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { filter, find, map } from "lodash";
import React, { ChangeEvent, useState } from "react";
import { Skeleton } from "src/components/skeleton";
import { SpreadsheetUploadStatus } from "./spreadsheet-upload-status";
import { SpreadsheetDownloadHistory } from "./spreadsheet-download-history";

export const BulkProductSubmissions = () => {
	const [currentTab, setCurrentTab] = useState<string>("spreadsheet-upload-status");
	const tabs = filter(
		[
			{
				label: "Spreadsheet upload status",
				value: "spreadsheet-upload-status",
				component: <SpreadsheetUploadStatus />,
				disabled: false,
				isHide: false,
			},
			{
				label: "Spreadsheet download history",
				value: "spreadsheet-download-history",
				component: <SpreadsheetDownloadHistory />,
				disabled: false,
				isHide: false,
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
			<Skeleton isLoading={false}>
				<Box mt={{ xs: 1 }}>
					<Grid container spacing={{ xs: 1, sm: 1 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Bulk product submissions
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

const TabsRoot = styled(Tabs)(() => {
	return {
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		"& .Mui-disabled": {
			display: "none",
			transition: "all 0.1s ease",
		},
	};
});
