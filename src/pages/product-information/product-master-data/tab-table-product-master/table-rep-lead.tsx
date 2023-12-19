import { Button, Grid } from "@mui/material";
import { useState } from "react";
import { MuiTable } from "src/components/mui-table";

export const TableRepLead = ({ columns, data, loading, pagination, setTabInfo }) => {
	const [columnVisibility, setColumnVisibility] = useState<any>({
		link: false,
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
			onColumnVisibilityChange={setColumnVisibility}
			onColumnPinningChange={setColumnPinning}
			enableHiding={true}
			state={{
				columnVisibility: columnVisibility,
				columnPinning: columnPinning,
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
										variant="outlined"
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
										variant="contained"
										disabled={true}
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
					</Grid>
				</>
			)}
		/>
	);
};
