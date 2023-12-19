import { FC, useRef, useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Avatar, Box, ButtonBase, Toolbar, Grid, Typography, Link } from "@mui/material";
import Button from "@mui/material/Button";
import { ReactComponent as ReactLogo } from "../../assets/images/logo.svg";
import { Link as LinkRouter } from "react-router-dom";
import type { AppBarProps } from "@mui/material";
import { PATH } from "src/constants/paths";
import { map, includes } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { AccountPopover } from "../account-popover";
import { Paper } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import { useSelector } from "react-redux";
import { selectActivities } from "src/store/selectors";

const { HOME, PROFIT_SIMULATION, VARIATIONS, PRODUCT_MASTER,LD } = PATH;

interface DashboardNavbarProps extends AppBarProps {
	onOpenSidebar?: () => void;
	theme?: any;
}

const DashboardNavbarRoot = (props) => {
	interface Props {
		window?: () => Window;
		children: React.ReactElement;
	}
	function HideOnScroll(props: Props) {
		const { children, window } = props;
		const trigger = useScrollTrigger({
			target: window ? window() : undefined,
		});

		return (
			<>
				<AppBar
					sx={{
						width: "100%",
						position: "fixed",
						zIndex: 1000,
						top: trigger ? "-64px" : "0px",
						visibility: trigger ? "hidden" : "visible",
						transition: trigger ? ".3s all ease" : "unset",
						left: "auto",
						right: "0px",
						borderRadius: "0px",
						backgroundColor: "#F2F1FA",
						boxShadow:
							" 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)",

						"& .MuiMenuButton-root": {
							"& .MuiButton-root": {
								padding: "23px 16px",
								"& .MuiTypography-root": {
									fontWeight: "600",
									position: "relative",
									"&:before": {
										content: '""',
										position: "absolute",
										left: 0,
										right: 0,
										bottom: "-15px",
										background: "transparent",
										height: "2px",
									},
								},

								"&.active": {
									"&:before": {
										content: '""',
										position: "absolute",
										left: 0,
										right: 0,
										bottom: "0px",
										background: (theme) => theme.palette.primary.main,
										height: "2px",
									},
								},
							},
						},
					}}
				>
					{children}
				</AppBar>
			</>
		);
	}
	return <HideOnScroll>{props.children}</HideOnScroll>;
};

const AccountButton = () => {
	const anchorRef = useRef<HTMLButtonElement | null>(null);
	const [openPopover, setOpenPopover] = useState<boolean>(false);

	const handleOpenPopover = (): void => {
		setOpenPopover(true);
	};

	const handleClosePopover = (): void => {
		setOpenPopover(false);
	};

	return (
		<>
			<Box
				component={ButtonBase}
				onClick={handleOpenPopover}
				ref={anchorRef}
				sx={{
					alignItems: "center",
					display: "flex",
					ml: 2,
				}}
			>
				<Avatar
					sx={{
						height: 40,
						width: 40,
						background: "#ADABC3",
					}}
				>
					<PersonIcon
						fontSize="medium"
						sx={{
							color: "#fff",
						}}
					/>
				</Avatar>
			</Box>
			{openPopover && (
				<AccountPopover
					anchorEl={anchorRef.current}
					onClose={handleClosePopover}
					open={openPopover}
				/>
			)}
		</>
	);
};

const MenuButton = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const activities = useSelector(selectActivities);

	const routers = [
		{
			key: "home",
			title: "Home",
			path: HOME,
			hidden: false,
			activeLink:
				includes(pathname, HOME) &&
				!includes(pathname, PROFIT_SIMULATION) &&
				!includes(pathname, PATH.ACCOUNT_LIST) &&
				!includes(pathname, PATH.GROUP_PERMISSION) &&
				!includes(pathname, PATH.ACTIVITIES_LIST) &&
				!includes(pathname, PATH.PARTNER_LIST) &&
				!includes(pathname, PATH.ASSUMPTION) &&
				!includes(pathname, PATH.ITEMS_REPORT) &&
				!includes(pathname, PATH.PRODUCT_MASTER) &&
				!includes(pathname, PATH.UPDATE_REQUEST_LIST) &&
				!includes(pathname, PATH.PREVIEW_SPREADSHEET_LIST) &&
				!includes(pathname, PATH.ADD_PRODUCTS) &&
				!includes(pathname, PATH.BULK_PRODUCT_SUBMISSIONS) &&
				!includes(pathname, PATH.CATEGORY) &&
				!includes(pathname, VARIATIONS),
		},
		{
			key: "settings",
			title: "Settings",
			hidden: !(
				activities?.hasOwnProperty("account_list_view") ||
				activities?.hasOwnProperty("signup_list_view") ||
				activities?.hasOwnProperty("role_list_view") ||
				activities?.hasOwnProperty("activity_list_view")
			),
			activeLink:
				includes(pathname, PATH.ACCOUNT_LIST) ||
				includes(pathname, PATH.GROUP_PERMISSION) ||
				includes(pathname, PATH.PARTNER_LIST) ||
				includes(pathname, PATH.ACTIVITIES_LIST),
			items: [
				{
					label: "Accounts List",
					value: "Accounts List",
					disabled: false,
					path: PATH.ACCOUNT_LIST,
					activeLink: includes(pathname, PATH.ACCOUNT_LIST),
					hidden: !(
						activities?.hasOwnProperty("account_list_view") ||
						activities?.hasOwnProperty("signup_list_view")
					),
				},
				{
					label: "Group Permission",
					value: "Group Permission",
					disabled: false,
					path: PATH.GROUP_PERMISSION,
					activeLink: includes(pathname, PATH.GROUP_PERMISSION),
					hidden: !activities?.hasOwnProperty("role_list_view"),
				},
				{
					label: "Activities List",
					value: "Activities List",
					disabled: false,
					path: PATH.ACTIVITIES_LIST,
					activeLink: includes(pathname, PATH.ACTIVITIES_LIST),
					hidden: !activities?.hasOwnProperty("activity_list_view"),
				},
				{
					label: "Organizations",
					value: "Partner List",
					disabled: true,
					path: PATH.PARTNER_LIST,
					activeLink: includes(pathname, PATH.PARTNER_LIST),
					hidden: true,
				},
			],
		},
		{
			key: "profitSimulation",
			title: "Profit Simulation",
			path: PROFIT_SIMULATION,
			hidden: !(
				activities?.hasOwnProperty("ps_calculate_profit_simulation") ||
				activities?.hasOwnProperty("ps_assumption_view") ||
				activities?.hasOwnProperty("ps_saved_list_view")
			),
			activeLink:
				includes(pathname, VARIATIONS) ||
				includes(pathname, PROFIT_SIMULATION) ||
				includes(pathname, PATH.ITEMS_REPORT) ||
				includes(pathname, PATH.ASSUMPTION),
			items: [
				{
					label: "Check Profit Simulation",
					value: "Check Profit Simulation",
					disabled: false,
					path: VARIATIONS,
					activeLink: includes(pathname, VARIATIONS),
					hidden: !(
						activities?.hasOwnProperty("ps_calculate_profit_simulation") ||
						activities?.hasOwnProperty("ps_saved_list_view")
					),
				},
				{
					label: "All items report",
					value: "All items report",
					disabled: true,
					path: PATH.ITEMS_REPORT,
					activeLink: includes(pathname, PATH.ITEMS_REPORT),
					hidden: true,
				},
				{
					label: "Assumption",
					value: "Assumptions List",
					disabled: false,
					path: PATH.ASSUMPTION,
					activeLink: includes(pathname, PATH.ASSUMPTION),
					hidden: !activities?.hasOwnProperty("ps_assumption_view"),
				},
			],
		},
		{
			key: "productInfo",
			title: "Product Information",
			path: PRODUCT_MASTER,
			hidden: !(
				activities?.hasOwnProperty("pi_master_data_view") ||
				activities?.hasOwnProperty("pi_request_list_view") ||
				activities?.hasOwnProperty("pi_approval_list_view")
			),
			activeLink:
				includes(pathname, PRODUCT_MASTER) ||
				includes(pathname, PATH.UPDATE_REQUEST_LIST) ||
				includes(pathname, PATH.ADD_PRODUCTS) ||
				includes(pathname, PATH.PREVIEW_SPREADSHEET_LIST) ||
				includes(pathname, PATH.BULK_PRODUCT_SUBMISSIONS) ||
				includes(pathname, PATH.CATEGORY),
			items: [
				{
					label: "Product Master Data",
					value: "Product Master Data",
					disabled: false,
					path: PRODUCT_MASTER,
					activeLink: includes(pathname, PRODUCT_MASTER),
					hidden: !activities?.hasOwnProperty("pi_master_data_view"),
				},
				{
					label: "Update Requests list",
					value: "Update Requests list",
					disabled: false,
					path: PATH.UPDATE_REQUEST_LIST,
					activeLink: includes(pathname, PATH.UPDATE_REQUEST_LIST),
					hidden: !(
						activities?.hasOwnProperty("pi_request_list_view") ||
						activities?.hasOwnProperty("pi_approval_list_view")
					),
				},
				{
					label: "Add Products (Create ASIN)",
					value: "Add Products (Create ASIN)",
					disabled: false,
					path: PATH.ADD_PRODUCTS,
					activeLink: includes(pathname, PATH.ADD_PRODUCTS),
					hidden: false,
				},
				{
					label: "Preview Spreadsheet List",
					value: "Preview Spreadsheet List",
					disabled: false,
					path: PATH.PREVIEW_SPREADSHEET_LIST,
					activeLink: includes(pathname, PATH.PREVIEW_SPREADSHEET_LIST),
					hidden: false,
				},
				{
					label: "Bulk Product Submissions",
					value: "Bulk Product Submissions",
					disabled: false,
					path: PATH.BULK_PRODUCT_SUBMISSIONS,
					activeLink: includes(pathname, PATH.BULK_PRODUCT_SUBMISSIONS),
					hidden: false,
				},
				{
					label: "Manage Categories",
					value: "Manage Categories",
					disabled: false,
					path: PATH.CATEGORY,
					activeLink: includes(pathname, PATH.CATEGORY),
					hidden: false,
				},
			],
		},
		{
			key:"learningAndDevelop",
			title: "Learning & Development",
			path: LD,
			hidden:false,
			activeLink:
				includes(pathname, LD) ||
				includes(pathname, PATH.Learning_Development) ||
				includes(pathname, PATH.LDManage)
				,
			items: [
					{
						label: "Learning & Development",
						value: "Learning & Development",
						disabled: false,
						path: PATH.Learning_Development,
						activeLink: includes(pathname, PATH.Learning_Development),
						hidden: false,
					},
					{
						label: "Manage L&D",
						value: "Manage L&D",
						disabled: false,
						path: PATH.LDManage,
						activeLink: includes(pathname, PATH.LDManage),
						hidden: false,
					},
					{
						label: "Score By Month Report",
						value: "Score By Month Report",
						disabled: false,
						path: PATH.LDScoreByMonthReport,
						activeLink: includes(pathname, PATH.LDScoreByMonthReport),
						hidden: false,
					},
					{
						label: "Academic Performance Ranking Report",
						value: "Academic Performance Ranking Report",
						disabled: false,
						path: PATH.LDAcademyRankingReport,
						activeLink: includes(pathname, PATH.LDAcademyRankingReport),
						hidden: false,
					},
				]
		}
	];

	return (
		<Box
			className="MuiMenuButton-root"
			sx={{
				display: "flex",
				alignItems: "center",
				position: "relative",
			}}
		>
			{map(
				routers.filter((item) => !item.hidden),
				(route: any, index: any) => (
					<Box
						key={route.key}
						sx={{
							position: "relative",
							"&:hover": {
								"& .dropdown-menu": {
									opacity: "1",
									transform: "scale(1)",
								},
							},
						}}
					>
						<Button
							size="medium"
							className={`${route.activeLink ? "active" : ""}`}
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								if (["home"].includes(route?.key)) {
									navigate(`${route.path}`);
								}
								return false;
							}}
						>
							<Typography color={route.activeLink ? "primary" : "text.primary"} variant="body1">
								{route.title}
							</Typography>
						</Button>

						{route?.items?.length && (
							<Paper
								elevation={4}
								variant="elevation"
								className="dropdown-menu"
								sx={{
									position: "absolute",
									left: "0",
									top: "calc(100% + 1px)",
									width: "auto",
									minWidth: "220px",
									backgroundColor: "background.paper",
									transition: "0.3s all ease",
									overflow: "hidden",
									opacity: "0",
									transform: "scale(0)",
									transformOrigin: "0 0",
									borderRadius: "4px",
									boxShadow:
										"0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
									padding: "10px 5px 10px 0",
									"& .MuiTypography-root": {
										whiteSpace: "nowrap",
										fontWeight: 700,
									},
								}}
							>
								{map(
									route?.items.filter((item) => !item.hidden),
									(item, index) => {
										return (
											<Link
												key={index}
												underline="none"
												variant="body2"
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													navigate(item.path);
												}}
												sx={{
													fontSize: "14px",
													lineHeight: "24px",
													padding: "12px 16px",
													borderBottom: "1px solid #D4D2E3",
													transition: "0.3s all ease",
													backgroundColor: `${item?.activeLink ? "#F2F1FA" : "transparent"}`,
													width: "100%",
													display: "block",
													textAlign: "left",
													"&:hover": {
														backgroundColor: "rgba(55, 65, 81, 0.08)",
													},
													pointerEvents: !item?.disabled ? "auto" : "none",
												}}
											>
												<Typography
													variant="body1"
													color={
														item?.disabled
															? "text.secondary"
															: item?.activeLink
															? "text.primary"
															: "text.primary"
													}
													sx={{
														fontWeight: `${item?.activeLink ? "600" : "normal"}`,
													}}
												>
													{item?.label}
												</Typography>
											</Link>
										);
									}
								)}
							</Paper>
						)}
					</Box>
				)
			)}
		</Box>
	);
};

export const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
	const { onOpenSidebar, ...other } = props;
	return (
		<>
			<DashboardNavbarRoot {...other}>
				<Toolbar
					disableGutters
					sx={{
						minHeight: "64px !important",
						left: 0,
						px: 2,
						background: (theme: any) => theme?.palette?.background?.primary,
					}}
				>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Box
								style={{
									display: "flex",
									alignItems: "center",
									textDecoration: "none",
								}}
							>
								<LinkRouter to="/">
									<Box
										sx={{
											mr: 3,
											display: "flex",
											width: 124,
											position: "relative",
											cursor: "pointer",
											"& img": {
												width: "100%",
												height: "auto",
											},
										}}
									>
										<ReactLogo />
									</Box>
								</LinkRouter>
								<MenuButton />
							</Box>
						</Grid>
						<Grid item>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<AccountButton />
							</Box>
						</Grid>
					</Grid>
				</Toolbar>
			</DashboardNavbarRoot>
		</>
	);
};

DashboardNavbar.propTypes = {
	onOpenSidebar: PropTypes.func,
};
