import { createBrowserRouter } from "react-router-dom";
import Variations from "src/pages/profit-simulation/variations";
import { PATH } from "src/constants/paths";
import { LoggedOutRoute } from "src/components/protected-router";
import { App } from "src/App";
import AccountsList from "src/pages/settings/accounts-list";
import AccountsProfile from "src/pages/settings/accounts-list/accounts-profile";
import GroupPermission from "src/pages/settings/group-permission";
import ActivitiesListing from "src/pages/settings/activities-list";
import { PartnerList } from "src/pages/settings/partner-list";
import Assumption from "src/pages/profit-simulation/assumptions";
import { AllItemsReport } from "src/pages/profit-simulation/all-items-report";
import Profile from "src/pages/profile";
import ProductInformation from "src/pages/product-information/product-master-data";
import { LoginPage } from "src/pages/access-systems/login";
import Register from "src/pages/access-systems/register";
import ResetPassword from "src/pages/access-systems/reset-password";
import ProductInfoDetail from "src/pages/product-information/product-master-data/product-info-detail";
import UpdateRequestsList from "src/pages/product-information/update-request-list";
import PreviewSpreadsheetList from "src/pages/product-information/preview-spreadsheet-list";
import DetailsPreview from "src/pages/product-information/preview-spreadsheet-list/edit";
import { AddProducts } from "src/pages/product-information/add-products";
import CategoryPage from "src/pages/product-information/category";
import { BulkProductSubmissions } from "src/pages/product-information/bulk-product-submissions";
import ProductChangeLog from "src/pages/product-information/product-master-data/change-log/product-change-log";
import { LDManage, LDTopic, ScoreByMonthReport, AcademicPerformanceRankingReport } from "src/pages/ld";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				index: true,
				element: <>Home page</>,
			},
			{
				path: PATH.ACCOUNT_LIST,
				element: <AccountsList />,
			},
			{
				path: `${PATH.ACCOUNT_LIST}${PATH.DETAIL}/:id`,
				element: <AccountsProfile />,
			},
			{
				path: PATH.GROUP_PERMISSION,
				element: <GroupPermission />,
			},
			{
				path: PATH.ACTIVITIES_LIST,
				element: <ActivitiesListing />,
			},
			{
				path: PATH.PARTNER_LIST,
				element: <PartnerList />,
			},
			{
				path: PATH.VARIATIONS,
				element: <Variations />,
			},
			{
				path: PATH.ASSUMPTION,
				element: <Assumption />,
			},
			{
				path: PATH.ITEMS_REPORT,
				element: <AllItemsReport />,
			},
			{
				path: `${PATH.PROFILE}`,
				element: <Profile />,
			},
			{
				path: `${PATH.PRODUCT_MASTER}`,
				element: <ProductInformation />,
			},
			{
				path: `${PATH.PRODUCT_MASTER}${PATH.EDIT}/:id`,
				element: <ProductInfoDetail />,
			},
			{
				path: `${PATH.PRODUCT_MASTER}${PATH.CHANGE_LOG}/:id`,
				element: <ProductChangeLog />,
			},
			{
				path: `${PATH.UPDATE_REQUEST_LIST}`,
				element: <UpdateRequestsList />,
			},
			{
				path: `${PATH.PREVIEW_SPREADSHEET_LIST}`,
				element: <PreviewSpreadsheetList />,
			},
			{
				path: `${PATH.PREVIEW_SPREADSHEET_LIST}${PATH.EDIT}/:id`,
				element: <DetailsPreview />,
			},
			{
				path: `${PATH.ADD_PRODUCTS}`,
				element: <AddProducts />,
			},
			{
				path: `${PATH.BULK_PRODUCT_SUBMISSIONS}`,
				element: <BulkProductSubmissions />,
			},
			{
				path: `${PATH.CATEGORY}`,
				element: <CategoryPage />,
			},
			{
				path: `${PATH.Learning_Development}`,
				element: <LDTopic />,
			},
			{
				path: `${PATH.LDManage}`,
				element: <LDManage />,
			},
			{
				path: `${PATH.LDScoreByMonthReport}`,
				element: <ScoreByMonthReport />,
			},
			{
				path: `${PATH.LDAcademyRankingReport}`,
				element: <AcademicPerformanceRankingReport />,
			},
		],
	},
	{
		path: PATH.LOGIN,
		element: (
			<LoggedOutRoute>
				<LoginPage />
			</LoggedOutRoute>
		),
	},
	{
		path: PATH.REGISTER,
		element: (
			<LoggedOutRoute>
				<Register />
			</LoggedOutRoute>
		),
	},
	{
		path: PATH.RESET_PASSWORD,
		element: (
			<LoggedOutRoute>
				<ResetPassword />
			</LoggedOutRoute>
		),
	},
]);
