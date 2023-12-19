import { Box, Button, Grid, Typography } from "@mui/material";
import {
    ITopic,
    ITreeBase,
    ArrowUpIcon,
    ArrowDownIcon,
    IBaseNodeProp,
    NormalizedTree,
    ldStyle
} from "../baseld";

interface ITreeSideBarNodeProps extends IBaseNodeProp<NormalizedTree<TopicMap>> {
    onCollapse: (id: string | number, parentId: string | number) => void;
    onClick: (id: string | number, parentId: string | number) => void;
}

type TopicMap = ITreeBase<ITopic>;

const TreeSideBarNode: React.FC<ITreeSideBarNodeProps> = ({
    _id,
    _parentId,
    _tree,
    _level = 0,
    onCollapse,
    onClick,
}) => {
  

    const node = _tree[_id];
  
    const data = node._dataNode;
    const childIds = node._childIds;
    const hasChild = childIds.length > 0;
    const spaceConstant = 24;
    const paddingLeft = _level * spaceConstant;
    const nodeStyle = {
        padding: ldStyle.style5,
        borderBottom: ldStyle.borderBottom2,
        boxSizing: "border-box",
        ...(_level && { paddingLeft: `${paddingLeft}px` })
    }
    if (Object.keys(_tree).length === 0||!node._isShow) {
        return null;
    }
    return (
        <>
                
            <Grid
                sx={{ ...nodeStyle }}
            >
                {hasChild && (
                    <Button
                        variant="text"
                        onClick={() => onCollapse(_id, _parentId)}
                        style={{ minWidth: `${spaceConstant}px`, padding: 0 }}
                    >
                        {node._isCollapse ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </Button>
                )}
                {!hasChild && (<div style={{ width: `${spaceConstant}px`, display: 'inline-flex' }}></div>)}
                <Typography
                    style={{
                        display: "inline-flex",
                    }}
                    variant="subtitle1"
                    onClick={() => onClick(_id, _parentId)}
                >
                    {data.name}
                </Typography>
            </Grid>
            {
                node._isCollapse &&
                hasChild &&
                (childIds.map((childId: string | number) => (
                    <TreeSideBarNode
                        key={childId}
                        _id={childId}
                        _parentId={_id}
                        _tree={_tree}
                        onClick={onClick}
                        onCollapse={onCollapse}
                        _level={_level + 1}
                    />
                )))
            }

        </>
    );
};
export { TreeSideBarNode }
export type { TopicMap }