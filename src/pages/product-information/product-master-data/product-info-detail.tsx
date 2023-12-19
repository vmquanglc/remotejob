import { Box, Container, Grid, Tab, Tabs, Typography, styled } from "@mui/material";
import { filter, find, map } from "lodash";
import React, { ChangeEvent, FC, useState } from "react";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
import { PATH } from "src/constants";
import { SKUInformationTab } from "./sku-info-tab";
import { MarketPlaceTab } from "./market-place-tab";
import { Navigate, useParams } from "react-router";
import {
	getCategoryTree,
	getInputData,
	getProductDetail,
} from "src/services/product-info/productInfo.services";
import { useQuery } from "react-query";
import { Skeleton } from "src/components/skeleton";
import { useSelector } from "react-redux";
import { selectRoleAccount } from "src/store/auth/selectors";
import { ERole } from "src/interface/groupPermission.interface";
import { RecordTab } from "./record-tab";
import { VENDER_CODER_CAN_EDIT_COST } from "src/constants/productInfo.constant";
import { PrivateRouter } from "src/components/private-router";

interface IProps {}

const ProductInfoDetail: FC<IProps> = () => {
	const { id } = useParams();
	const role = useSelector(selectRoleAccount);
	const {
		data,
		isLoading: isLoading,
		isFetching: isFetching,
		refetch,
	} = useQuery([`items-report-listing-${JSON.stringify(id)}`, id], () => getProductDetail(id), {
		keepPreviousData: true,
		enabled:
			!!id &&
			(role.code === ERole.admin || role.code === ERole.sales || role.code === ERole.manager),
	});

	const items = [
		{ path: PATH.HOME, name: `Home` },
		{
			name: "Product Master Data",
			path: PATH.PRODUCT_MASTER,
		},
		{
			name: `Edit product SKU ${data?.data?.market_place_id} - ASIN ${data?.data?.sku?.code} - ${data?.data?.channel} - ${data?.data?.vendor_code}`,
		},
	];

	const {
		data: categoryTree,
		isLoading: isLoadingCate,
		isFetching: isFetchingCate,
	} = useQuery(
		[`get-category-tree`],
		async () => {
			try {
				const response = await getCategoryTree();
				if (response.status === 200) {
					return formatCateTree(response.data);
				}
				return undefined;
			} catch (error) {
				return undefined;
			}
		},
		{
			keepPreviousData: true,
		}
	);

	const { data: dataInput, isLoading: isLoadingInputData } = useQuery(
		[`get-input-data`],
		() => getInputData(),
		{
			keepPreviousData: true,
		}
	);

	const formatCateTree = (arr) => {
		return arr.reduce((obj, item) => {
			obj[item.id] = {
				...item,
				children: item.children.length ? formatCateTree(item.children) : {},
			};
			return obj;
		}, {});
	};

	const [currentTab, setCurrentTab] = useState<string>("sku-info");
	const tabs = filter(
		[
			{
				label: "SKU Information",
				value: "sku-info",
				component: (
					<SKUInformationTab
						details={data?.data || {}}
						dataUpdate={data?.data?.product_update_request?.type_sku?.update_data}
						categoryTree={categoryTree}
						dataInput={dataInput}
						refetch={refetch}
					/>
				),
				disabled: false,
				isHide: false,
			},
			{
				label: "Market Place",
				value: "market-place",
				component: (
					<MarketPlaceTab
						details={data?.data || {}}
						dataUpdate={data?.data?.product_update_request?.type_market_place?.update_data}
						refetch={refetch}
					/>
				),
				disabled: false,
				isHide: false,
			},
			{
				label: "A Record",
				value: "record",
				component: (
					<RecordTab
						details={data?.data || {}}
						dataUpdate={data?.data?.product_update_request?.type_record?.update_data}
						refetch={refetch}
					/>
				),
				disabled: !VENDER_CODER_CAN_EDIT_COST.includes(data?.data?.vendor_code),
				isHide: false,
			},
		],
		(item) => !item.isHide
	);

	const componentCurrentTab = find(tabs, (item) => item.value === currentTab);

	const handleOnChangeTab = (event: ChangeEvent<{}>, value: string): void => {
		setCurrentTab(value);
	};

	if (role.code === ERole.director || role.code === ERole.business_analyst) {
		return <Navigate to="/" replace />;
	}

	return (
		<Container maxWidth={false}>
			<Skeleton
				isLoading={isLoading || isFetching || isLoadingCate || isFetchingCate || isLoadingInputData}
			>
				<Box mt={{ xs: 1 }}>
					<MuiBreadcrumbs items={items} />
					<Grid container spacing={{ xs: 1, sm: 1 }}>
						<Grid item xs={12} sm={12}>
							<Typography variant="h6" color="primary">
								Edit product
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

export default PrivateRouter(ProductInfoDetail, "pi_a_request_edit");

const TabsRoot = styled(Tabs)(() => {
	return {
		borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
		"& .Mui-disabled": {
			display: "none",
			transition: "all 0.1s ease",
		},
	};
});
