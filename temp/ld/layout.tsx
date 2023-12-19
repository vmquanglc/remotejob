
import { Grid, Box, styled, Container } from "@mui/material";
import { TreeSideBar } from "./treesidebar";
import { Skeleton } from "src/components/skeleton";
const LayoutRoot = styled(Grid)({
    boxSizing: 'border-box',
    display:'flex',
    width: '100%',
    paddingBottom: "40px",
    // height:'calc(100vh - 64px)',
    // overflow: 'hidden',
    // minHeight:'100%'
});

const LeftMenu = styled(Grid)(({ theme }) => ({
    flexBasis: 500,
    minWidth: 500,
    // overflow: 'hidden',
    // height: '100%',
    // maxHeight: '100%',
}));


const Content = styled(Grid)(({ theme }) => ({
    height: '100%',
    overflowY: 'hidden'
}));
const LDLayout = ({ handleOnClick, handleOnCollapse, handleOnFilterChange, treeNormalize, children }): JSX.Element => {

    return (
        <Skeleton isLoading={false}>
            <LayoutRoot>
                <LeftMenu>
                    <TreeSideBar
                        onClick={handleOnClick}
                        onCollapse={handleOnCollapse}
                        onFilterChange={handleOnFilterChange}
                        treeNormalize={treeNormalize} />
                </LeftMenu>
                <Content>
                    {
                        children
                    }
                </Content>
            </LayoutRoot>
        </Skeleton>
    )
}
export { LDLayout };
