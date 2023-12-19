import { Box, Container, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { filter, find, map } from "lodash";
import React, { ChangeEvent, useState } from "react";
import { Skeleton } from "src/components/skeleton";
import { AssignManagerTab } from "./assign-manager-tab";
import { AssignSalesTab } from "./assign-sales-tab";
import { AddProductsTab } from "./add-product-tab";
import AmzCategory from "./amz-category";

export const AddProducts = () => {
	const [currentTab, setCurrentTab] = useState<string>("assign-manager");
	const tabs = filter(
		[
			{
				label: "Assign Manager",
				value: "assign-manager",
				component: <AssignManagerTab />,
				disabled: false,
				isHide: false,
			},
			{
				label: "Assign Sales",
				value: "assign-sales",
				component: <AssignSalesTab />,
				disabled: false,
				isHide: false,
			},
			{
				label: "Add products",
				value: "add-products",
				component: <AddProductsTab />,
				disabled: false,
				isHide: false,
			},
			{
				label: "Amazon category template",
				value: "amz-cate",
				component: <AmzCategory />,
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
								Add products (create ASIN)
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
