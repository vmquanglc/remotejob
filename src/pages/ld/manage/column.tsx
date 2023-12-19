import { Button, Typography } from "@mui/material";
import { useMemo } from "react";
import { FORMAT_DATE } from "src/constants";
import { formatDateToString } from "src/utils/date";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { EditIcon, DeleteIcon,FolderIcon } from "../baseld";
export const useColumns = (handleAction) => {
    const columns = useMemo(() => {
        return [
            {
                header: "Name",
                minSize: 300,
                accessorKey: "name",
                typeFilter: "includesMultipleFilter",
                muiTableBodyCellProps: {
                    sx: {
                        display:'flex',
                        alignItem:'center'
                    },
                },
                Cell: ({ row }) => (
                    <>
                        <Typography variant="body1" color="primary" sx={{
                            display:'flex',
                            alignItems:"center",
                            textAlign:"center"
                        }}>
                            <FolderIcon sx={{
                                mr: 2,
                            }}/> 
                            <Typography variant="body1" color="primary" 
                                sx={{ display: "block",textAlign:"center" }}>
                                {row.original.name}
                            </Typography>
                        </Typography>
                    </>
                ),

            },
            {
                header: "Description",
                minSize: 100,
                accessorKey: "description",
                typeFilter: "includesMultipleFilter",
                // Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
            },
            {
                header: "Owner",
                minSize: 100,
                accessorKey: "owner",
                typeFilter: "includesMultipleFilter",
            },
            {
                header: "Lastest updated",
                minSize: 100,
                accessorKey: "updated_at",
                Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
                typeFilter: "includesMultipleFilter",
            },
            {
                header: "Action",
                size: 60,
                accessorKey: "action",
                typeFilter: "includesMultipleFilter",
                enableEditing: false,
                enableColumnDragging: false,
                enableColumnFilter: false,
                enableColumnOrdering: false,
                enableColumnActions: false,
                muiTableBodyCellProps: {
                    sx: {
                        textAlign: "center",
                    },
                },
                Cell: ({ row }) => (
                    <>
                        <Button
                            variant="text"
                            sx={{
                                padding: 0,
                                minWidth: "40px",
                            }}
                            onClick={() => handleAction["AddOrUpdate"].onClick("Update", row)}
                        >
                            <EditIcon />
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                padding: 0,
                                minWidth: "40px",
                            }}
                            onClick={() => handleAction["Delete"].onClick("Delete", {id:row.original.id,name:row.original.name,type:row.original.type})}
                        >
                            <DeleteIcon />
                        </Button>
                    </>
                ),
            },
        ];
    }, []);
    return columns;
}