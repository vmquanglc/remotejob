import React, { ChangeEvent, useState } from "react";
import { Container, Paper, Box, Tabs, Grid, Tab, Typography } from "@mui/material";
import { filter, find, map, pick } from "lodash";
import { styled } from "@mui/system";
import FolderIcon from "@mui/icons-material/Folder";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { AccountsTab } from "./accounts-tab";
import { SignUpRequestTab } from "./sign-up-request-tab";
import { PrivateRouter } from "src/components/private-router";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";
import { useUrlSearchParams } from "use-url-search-params";

const AccountsList = () => {
	const activities = useSelector(selectActivities);
	const [params]: any = useUrlSearchParams({});
	const { view, email } = pick(params, ["view", "email"]);
	const [currentTab, setCurrentTab] = useState<string>(
		activities?.hasOwnProperty("account_list_view") ? view || "accounts" : "sign_up_request"
	);
	const tabs = filter(
		[
			{
				labelKey: "Accounts",
				value: "accounts",
				component: <AccountsTab activities={activities} email={email || ""} />,
				icon: <FolderIcon />,
				disabled: !activities?.hasOwnProperty("account_list_view"),
				isHide: false,
			},
			{
				labelKey: "Sign-Up Request",
				value: "sign_up_request",
				component: <SignUpRequestTab activities={activities} email={email || ""} />,
				icon: <ReceiptIcon />,
				disabled: !activities.hasOwnProperty("signup_list_view"),
				isHide: false,
			},
		],
		(item) => !item.isHide
	);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
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

	return (
		<Container maxWidth={false}>
			<Box mt={{ xs: 1 }}>
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container justifyContent="space-between">
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Accounts List
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
									<Tab
										key={tab.value}
										label={tab.labelKey}
										value={tab.value}
										icon={tab.icon}
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
				</Paper>
			</Box>
		</Container>
	);
};

export default PrivateRouter(AccountsList, ["account_list_view", "signup_list_view"]);
