import React, { useState } from "react";
import { Grid, Button } from "@mui/material";
import { DetailAssumptions } from "./detail-assumptions";

export default function AdjustmentTab({ assumption, refetch, activities }) {
	const [isEditing, setEditing] = useState<boolean>(false);

	return (
		<Grid container spacing={{ xs: 2, sm: 2 }}>
			{activities?.hasOwnProperty("ps_assumption_manage_update") && (
				<Grid item xs={12}>
					<Button
						type="button"
						size="small"
						variant="contained"
						sx={{ mr: { xs: 1, sm: 2 } }}
						disabled={isEditing}
						onClick={() => setEditing(true)}
					>
						New Update
					</Button>
				</Grid>
			)}
			<Grid item xs={12}>
				<DetailAssumptions
					assumption={assumption}
					isEditing={isEditing}
					setEditing={setEditing}
					refetch={refetch}
				/>
			</Grid>
		</Grid>
	);
}
