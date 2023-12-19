import { Box, Container, Grid, Typography } from "@mui/material";
import { ITopic, ITreeBase ,ldStyle,normalizeY4AllTree,usePage } from "../baseld";
import { LDLayout,useLDLayout } from "../layout";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
import { Skeleton } from "src/components/skeleton";
import { FORMAT_DATE, PATH } from "src/constants";
import { useMemo, useState } from "react";
import { formatDateToString } from "src/utils/date";
import { MuiTable } from "src/components/mui-table";
import { getPagination } from "src/utils/pagination";
import { useQuery } from "react-query";`  `
import { getTopicTree } from "src/services/ldservice/ld.service";


// const LDTopic=()=>{
//     console.log('re-render ld topic');
//     const {
//         treeNormalize,
//         setTreeNormalize,
//         handleOnClick,
//         handleOnCollapse,
//         handleOnFilterChange
//     }=useLDLayout()
//     const items = [{ path: PATH.HOME, name: `Home` }, { name: "Learning & Development" }];

//     const [data,setData]=useState<{list:ITopic[],total:number}>({list:[],total:0})
//     const {
//         isLoading,
//         refetch,
//     } = useQuery([`LDTopic`], async () => getTopicTree(), {
//         keepPreviousData: true,
//         select: (data) => {
//             return data;
//         },
//         onSuccess: (data) => {
//             setData({list:data.data.list as ITopic[],total:data.data.total as number});
//         },
//     });
//     const {
//         itemsPerPage, 
//         page,
//         handleOnPageChange,
//         handleOnRowsPerPageChange,
//     }=usePage();
//     const columns = useMemo(() => {
// 		return [
// 			{
// 				header: "Name",
// 				minSize: 300,
// 				accessorKey: "name",
// 				// typeFilter: "includesMultipleFilter",
			
// 			},
// 			{
// 				header: "Collected",
// 				minSize: 100,
// 				accessorKey: "collected",
// 				// typeFilter: "includesMultipleFilter",
// 				// Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
// 			},
// 			{
// 				header: "Gain more",
// 				minSize: 100,
// 				accessorKey: "gainmore",
// 				// typeFilter: "includesMultipleFilter",
// 			},
// 			{
// 				header: "Lastest updated",
// 				minSize: 100,
// 				accessorKey: "gainmore",
//                 Cell: ({ cell }) => <>{formatDateToString(cell.getValue(), FORMAT_DATE)}</>,
// 				// typeFilter: "includesMultipleFilter",
// 			},
// 		];
// 	}, []);
    
//     return(
//         <>
//             <LDLayout 
//                 handleOnClick={handleOnClick} 
//                 handleOnCollapse={handleOnCollapse} 
//                 handleOnFilterChange={handleOnFilterChange}
//                 treeNormalize={treeNormalize}>
//                 <Container maxWidth={false}>
//                     <Skeleton isLoading={isLoading}>
//                         <Box mt={'10px'} ml={'25px'} mr={'25px'}>
//                             <Grid container>
//                                 <Grid item>
//                                     <Typography variant="h6" color="primary">
//                                         Learning & Development
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item>
//                                     <Typography variant="h6" color={ldStyle.textgreendone}>
//                                         You collected 50 points, gain more 3.450 points from L&D. 
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                             <MuiBreadcrumbs items={items} />
//                         </Box>
//                         <Box mt={'10px'} ml={'25px'} mr={'25px'}>
//                             <Grid container>
//                                 <Grid item>
//                                     <Typography variant="h6" color="primary">
//                                     Compliance and Sustainability
//                                     </Typography>
//                                 </Grid>
//                                 <Grid item>
//                                     <Typography variant="h6" color={ldStyle.textgreendone}>
//                                         Collected 0 point. Gain more 400 points 
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                             <Grid container>
//                                 <Grid item>
//                                     <Typography variant="h6" color="primary">
//                                     Description: Learning about Compliance and Sustainability
//                                     </Typography>
//                                 </Grid>
//                             </Grid>
//                             <Box mt={{ xs: 1 }}>
//                                 <MuiTable
//                                     columns={columns}
//                                     hasCheckbox
//                                     loading={false}
//                                     data={data.list||[]}
//                                     enableRowNumbers
//                                     enableColumnActions={false}
//                                     enableColumnDragging={false}
//                                     enableRowDragging={false}
//                                     enableColumnResizing={false}
//                                     pagination={{
//                                         ...getPagination({ rowsPerPage: itemsPerPage, page }),
//                                         total:  data.total||0,
//                                         onPageChange: handleOnPageChange,
//                                         onRowsPerPageChange: handleOnRowsPerPageChange,
//                                     }}
//                                 />
//                             </Box>
//                         </Box>
//                     </Skeleton>
//                 </Container>
//             </LDLayout>
//         </>
//     )
// }
// export {LDTopic};
export const LDTopic=()=>(<></>)