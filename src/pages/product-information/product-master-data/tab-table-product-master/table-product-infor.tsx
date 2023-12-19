import { Button, Grid } from "@mui/material";
import { without } from "lodash";
import { useState } from "react";
import { MuiTable } from "src/components/mui-table";

export const TableProductInfo = ({ columns, data, loading, pagination, setTabInfo }) => {
	const [columnVisibility, setColumnVisibility] = useState<any>({
		link: false,
		upc: false,
		"sku.sell_type": false,
		"sku.life_cycle": false,
		vendor_code: false,
		launching_date: false,
		"sku.pic_sale_dl": false,
		"sku.pic_spd": false,
		"sku.pic_ba": false,
	});

	const [columnPinning, setColumnPinning] = useState<any>({
		left: [
			"mrt-row-numbers",
			"sku.image",
			"sku.code",
			"market_place",
			"market_place_id",
			"sku.category.relative_master_category.name",
			"sku.product_name",
		],
		right: ["action"],
	});

	enum ETab {
		Product,
		Dimensions,
		RepLeadTime,
		Compliance,
	}

	return (
		<MuiTable
			columns={columns}
			loading={loading}
			data={data || []}
			enableRowNumbers
			enableColumnActions={false}
			enableColumnDragging={false}
			enableRowDragging={false}
			enablePinning={true}
			enableColumnResizing={false}
			enableColumnOrdering={true}
			enableColumnFilters={false}
			enableRowVirtualization={false}
			onColumnVisibilityChange={(state) => {
				if (typeof state === "function") {
					return setColumnVisibility(state);
				} else {
					setColumnPinning({
						left: [
							"mrt-row-numbers",
							"link",
							"sku.image",
							"sku.code",
							"upc",
							"market_place",
							"market_place_id",
							"sku.category.relative_master_category.name",
							"sku.product_name",
						],
						right: ["action"],
					});
					return setColumnVisibility(state);
				}
			}}
			onColumnPinningChange={setColumnPinning}
			enableHiding={true}
			initialState={{
				columnPinning: {
					left: columnPinning.left,
					right: [...columnPinning.right.filter((item) => item !== "action"), "action"],
				},
			}}
			state={{
				columnVisibility: columnVisibility,
				columnPinning: {
					left: columnPinning.left,
					right: [...columnPinning.right.filter((item) => item !== "action"), "action"],
				},
			}}
			pagination={pagination}
			getRowId={(row: any) => row?.id}
			renderTopToolbarCustomActions={() => (
				<>
					<Grid
						container
						spacing={2}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "inherit",
							pl: 0,
						}}
					>
						<Grid item>
							<Grid container spacing={{ xs: "2px" }} alignItems="flex-end">
								<Grid item>
									<Button
										variant="contained"
										disabled={true}
										onClick={() => {
											setTabInfo(ETab.Product);
										}}
									>
										Product Info
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => {
											setTabInfo(ETab.Dimensions);
										}}
									>
										Dimensions Info
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => {
											setTabInfo(ETab.RepLeadTime);
										}}
									>
										Rep Lead time
									</Button>
								</Grid>
								<Grid item>
									<Button
										variant="outlined"
										onClick={() => {
											setTabInfo(ETab.Compliance);
										}}
									>
										Compliance
									</Button>
								</Grid>
							</Grid>
						</Grid>
						<Grid
							item
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "end",
							}}
						>
							{!!without(Object.values(columnVisibility), true).length ? (
								<Button
									variant="text"
									onClick={() => {
										setColumnVisibility({
											"sku.image": true,
											"sku.code": true,
											link: true,
											upc: true,
											market_place: true,
											market_place_id: true,
											"sku.category.relative_master_category.name": true,
											"sku.product_name": true,
											product_type: true,
											"sku.sell_type": true,
											"sku.life_cycle": true,
											country: true,
											channel: true,
											vendor_code: true,
											rrp: true,
											cost_to_market_place: true,
											"sku.fob": true,
											"sku.cogs": true,
											"sku.manufacturer": true,
											"sku.country_of_origin": true,
											launching_date: true,
											"sku.pic_sale_dl": true,
											"sku.pic_spd": true,
											"sku.pic_ba": true,
										});
										setColumnPinning({
											left: [
												"mrt-row-numbers",
												"link",
												"sku.image",
												"sku.code",
												"upc",
												"market_place",
												"market_place_id",
												"sku.category.relative_master_category.name",
												"sku.product_name",
											],
											right: ["action"],
										});
									}}
								>
									Show all
								</Button>
							) : (
								<Button
									variant="text"
									onClick={() => {
										setColumnVisibility((prev) => ({
											...prev,
											link: false,
											upc: false,
											"sku.sell_type": false,
											"sku.life_cycle": false,
											vendor_code: false,
											launching_date: false,
											"sku.pic_sale_dl": false,
											"sku.pic_spd": false,
											"sku.pic_ba": false,
										}));
										setColumnPinning({
											left: [
												"mrt-row-numbers",
												"sku.image",
												"sku.code",
												"market_place",
												"market_place_id",
												"sku.category.relative_master_category.name",
												"sku.product_name",
											],
											right: ["action"],
										});
									}}
								>
									Show default
								</Button>
							)}
						</Grid>
					</Grid>
				</>
			)}
		/>
	);
};
