import { Button, Grid, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { MuiTable } from "src/components/mui-table";
import { getPagination } from "src/utils/pagination";
import { ITopic, normalizeY4AllTree, usePage, IStatePopup, getActivePathFromTree, getActiveIdChildrenFromTree, y4AllOrder, cacheKey, DeleteIcon, EditIcon, normalizeTree, defaultRootId } from "../baseld";
import { LDLayout, useLDLayout } from "../layout";
import { Skeleton } from "src/components/skeleton";
import { useQuery, useQueryClient } from "react-query";
import { getTopicTree } from "src/services/ldservice/ld.service";
import { useMemo, useState, MouseEvent, ChangeEvent, useEffect } from "react";
import { mockGetLDMange } from "src/services/ldservice/ld.mockdata.service";
import { useColumns } from "./column";
import { CreateTopicPopup } from "./popup";
import { selectRoleAccount } from "src/store/auth/selectors";
import { ERole } from "src/interface/groupPermission.interface";
import { useSelector } from "react-redux";
import { PAGINATION } from "src/constants";
import { MuiBreadcrumbs } from "src/components/breadcrumbs";
type ILDMangePopupType = "Add" | "Update" | "Delete"
const LDManage = () => {
    console.log('re-render ld manage')
    const queryClient = useQueryClient();
    // const items = [{ path: '', name: `Home` }, { name: "Product Master Data" }];
    const [items,setItems]=useState([])
    const {
        treeNormalize,
        setTreeNormalize,
        handleOnClick,
        handleOnCollapse,
        handleOnFilterChange,
        activeId,
        setActiveId,
        dataLocal,
        setDataLocal,
        changeDataLocalByActiveId
    } = useLDLayout()
    const {
        itemsPerPage,
        page,
        handleOnPageChange,
        handleOnRowsPerPageChange,
    } = usePage();
    const buildPath=(activeId,tree)=>{
        const items= getActivePathFromTree(activeId,tree)
        items.reverse();
        setItems(
            items.map(x=>({
                name:x.name,
                id:x.id,
                onClick:()=>{setActiveId(x.id);changeDataLocalByActiveId(x.id)}
            }))
        )
    }
    const [statePopup, setStatePopup] = useState<IStatePopup<ILDMangePopupType>>({
        isOpen: false,
        type: "",
        data: {},
    });

    const [data, setData] = useState<{ list: ITopic[], total: number }>({ list: [], total: 0 })
    const handleAction = {
        "AddOrUpdate": {
            onClick: (type: ILDMangePopupType, data: any) => {
                setStatePopup({
                    ...statePopup,
                    type: type,
                    data: data,
                    isOpen: true
                })
            },
            onSubmitDone: (type: ILDMangePopupType, data: any) => {
                setStatePopup({
                    ...statePopup,
                    type: "",
                    data: {},
                    isOpen: false
                })
                queryClient.invalidateQueries(cacheKey.LDManageTreeCache);
            },
        },
        "Delete": {
            onClick: (type: ILDMangePopupType, data: any) => {
                setStatePopup({
                    ...statePopup,
                    type: type,
                    data: data,
                    isOpen: true
                })
                console.log(data)
            },
            onSubmitDone: async (type: ILDMangePopupType, id: any) => {
                console.log('run final')

                setStatePopup({
                    ...statePopup,
                    type: "",
                    data: {},
                    isOpen: false
                })
                queryClient.invalidateQueries(cacheKey.LDManageTreeCache);

            },
        }
    }

    const columns = useColumns(handleAction);
    const role = useSelector(selectRoleAccount);
    const isAdmin = useMemo(() => {
        return true;
        // return role.code === ERole.admin
    }, [])



    const changePopup = (isOpen: boolean, type: ILDMangePopupType, data: any) => {
        setStatePopup({
            isOpen: isOpen,
            type: type,
            data: data
        })
    }
    const [isChangeOrder, setIsChangeOrder] = useState<boolean>(false)
    const handleOnChangeOrder = () => {
        setIsChangeOrder(!isChangeOrder);
    }

    const {
        isLoading,
        refetch,
    } = useQuery([cacheKey.LDManageTreeCache], async () => getTopicTree(), {
        keepPreviousData: true,
        select: (data) => {
            return data.data;
        },
        onSuccess: (fetchedData) => {
            let normalizeData = normalizeY4AllTree(fetchedData,{_defaultDataNode:{name:"Manage L&D",id:defaultRootId}})
            setTreeNormalize(normalizeData)
            buildPath(activeId,normalizeData)
            let listIds = getActiveIdChildrenFromTree(activeId, normalizeData);
            let listTree = y4AllOrder(listIds, normalizeData).map(id => normalizeData[id]._dataNode);
            setDataLocal({ list: listTree as ITopic[], total: listTree.length as number });
        },
    })
    useEffect(() => {
        setData({
            ...data,
            list: [...dataLocal.list].filter((x, i) => (i >= (page) * itemsPerPage && i < (page + 1) * itemsPerPage)),
            total: dataLocal.total
        })
        buildPath(activeId,treeNormalize)
    }, [page, itemsPerPage, activeId, dataLocal.list])
    return (
        <>
            <LDLayout
                handleOnClick={handleOnClick}
                handleOnCollapse={handleOnCollapse}
                handleOnFilterChange={handleOnFilterChange}
                treeNormalize={treeNormalize}>
                <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                    <Skeleton isLoading={false}>
                        <Box mt={'10px'} ml={'25px'} mr={'25px'} mb={'25px'}>
                            <Grid container>
                                {activeId==defaultRootId && (<Grid item alignSelf="center" xs>
                                    <Typography variant="h6" color="primary">
                                        Manage L&D
                                    </Typography>
                                </Grid>)}
                                {activeId!=defaultRootId &&
                                (<Grid item alignSelf="center" xs>
                                    <Typography variant="h6" color="primary">
                                        {treeNormalize?.[activeId]?._dataNode?.name}
                                        <Button
                                            variant="text"
                                            sx={{
                                                padding: 0,
                                                minWidth: "40px",
                                            }}
                                            onClick={() => handleAction["AddOrUpdate"].onClick("Update", {})}
                                        >
                                            <EditIcon />
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{
                                                padding: 0,
                                                minWidth: "40px",
                                            }}
                                            onClick={() => handleAction["Delete"].onClick("Delete", { })}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </Typography>
                                    <MuiBreadcrumbs items={items} />
                                    <Typography variant="h6" color="primary">
                                        Description of the topic
                                    </Typography>
                                </Grid>)}
                                {isChangeOrder && (
                                    <Grid item>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            onClick={() => console.log('save')}
                                            sx={{ mr: 1, }}
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={() => setIsChangeOrder(!isChangeOrder)}
                                            sx={{ mr: 1 }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                )}
                                {!isChangeOrder && (
                                    <Grid item>
                                        <Button
                                            type="button"
                                            variant="contained"
                                            onClick={() => changePopup(true, 'Add', {})}
                                            sx={{ mr: 1, }}
                                        >
                                            Create topic
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outlined"
                                            onClick={handleOnChangeOrder}
                                            sx={{ mr: 1 }}
                                        >
                                            Change order
                                        </Button>
                                    </Grid>
                                )}

                            </Grid>
                        </Box>
                        <Box mt={'10px'} ml={'25px'} mr={'25px'} mb={'20px'}>
                            <MuiTable
                                columns={columns}
                                loading={false}
                                data={data.list || []}
                                enableColumnActions={false}
                                enableColumnDragging={false}
                                enableRowDragging={false}
                                enablePinning={true}
                                enableColumnResizing={false}
                                enableColumnOrdering={true}
                                enableColumnFilters={false}
                                enableRowVirtualization={false}
                                enableTopToolbar={false}
                                enableRowSelection={false}
                                enableMultiRowSelection={false}
                                enableRowOrdering={isChangeOrder}
                                // enableRowOrdering={true}
                                // renderTopToolbarCustomActions={()=><></>}
                                pagination={{
                                    ...getPagination({ rowsPerPage: itemsPerPage, page }),
                                    total: data.total || 0,
                                    onPageChange: handleOnPageChange,
                                    onRowsPerPageChange: handleOnRowsPerPageChange,
                                }}
                                state={{
                                    columnPinning: {
                                        right: ["action"],
                                    },
                                }}
                            />
                        </Box>
                    </Skeleton>
                </Box>
            </LDLayout>
            {
                statePopup.isOpen &&
                (statePopup.type === "Add" || statePopup.type === "Update") && (
                    <CreateTopicPopup
                        onClose={() => changePopup(false, null, {})}
                        onSubmitDone={handleAction["AddOrUpdate"].onSubmitDone}
                        type={'CreateRootTopic'}
                        data={statePopup.data}
                    />
                )
            }
            {
                statePopup.isOpen &&
                (statePopup.type === "Delete") && (
                    true
                )
            }
        </>
    )
}
export { LDManage };
