import {
	Box,
	Button,
	Container,
	Grid,
	MenuItem,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
import { Skeleton } from "src/components/skeleton";
import { PATH } from "src/constants";
import { getDetailPreview } from "src/services/profit-simulation/preview-spreadsheet-list.services";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useFormik } from "formik";
import { MuiTable } from "src/components/mui-table";
import { map, without } from "lodash";
import { NumericFormatCustom } from "../number-format-custom";
import { formatCurrencyPrefix } from "src/utils/currency";
import { AddVendorCode } from "./add-vender-code";
import { ReplaceAsin } from "./replace-asin";

export default function DetailsPreview() {
	const { id } = useParams();

	const {
		data,
		isLoading: isLoading,
		refetch,
	} = useQuery([`get-preview-listing-${id}`], () => getDetailPreview(id), {
		onSuccess: ({ data }) => {
			formik.setValues({
				...formik.values,
				...data,
				dataTable: without(data?.spreadsheet_table?.content, undefined),
			});
		},
		keepPreviousData: true,
		enabled: !!id,
	});
	const formik = useFormik({
		initialValues: {
			dataTable: [],
		},
		onSubmit: (value) => {
			console.log("value", value);
		},
	});

	const items = [
		{ path: PATH.HOME, name: `Home` },
		{
			name: "Preview Spreadsheet List",
			path: PATH.PREVIEW_SPREADSHEET_LIST,
		},
		{
			name: `${data?.data?.name}`,
		},
	];

	const handleOnSave = async (
		data: any[],
		cell: any,
		value: number | string,
		isReplaceAsin: boolean = false
	) => {
		if (!value) {
			return;
		}
		if (isReplaceAsin && ["upc", "rrp"].includes(cell.column.id)) {
			for (let index = 0; index < formik.values.dataTable.length; index++) {
				formik.setFieldValue(`dataTable[${index}]`, {
					...data[index],
					[cell.column.id]: value,
				});
			}
			return;
		}

		formik.setFieldValue(`dataTable[${cell.row.index}]`, {
			...data[cell.row.index],
			[cell.column.id]: value,
		});
	};

	const [isEdit, setEdit] = useState<boolean>(false);

	if (data?.data?.type === "add_vendor_code") {
		return (
			<Container maxWidth={false}>
				<Skeleton isLoading={isLoading}>
					<Box mt={{ xs: 1 }}>
						<MuiBreadcrumbs items={items} />
						<AddVendorCode
							data={data}
							formik={formik}
							handleOnSave={handleOnSave}
							isEdit={isEdit}
							setEdit={setEdit}
							refetch={refetch}
							id={id}
						/>
					</Box>
				</Skeleton>
			</Container>
		);
	}

	return (
		<Container maxWidth={false}>
			<Skeleton isLoading={isLoading}>
				<Box mt={{ xs: 1 }}>
					<MuiBreadcrumbs items={items} />
					<ReplaceAsin
						data={data}
						formik={formik}
						handleOnSave={handleOnSave}
						isEdit={isEdit}
						setEdit={setEdit}
						refetch={refetch}
						id={id}
					/>
				</Box>
			</Skeleton>
		</Container>
	);
}
