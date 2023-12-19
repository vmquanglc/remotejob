import { SearchIcon, ldStyle,defaultRootId } from "../baseld";
import { Grid, OutlinedInput, debounce } from "@mui/material";
import { TreeSideBarNode } from "./treesidebarnode";
const TextFieldFilter = ({ onChange, placeholderFilter }) => (
	<OutlinedInput
		sx={{
			margin: 0,
			background: "#fff",
			height:'42px'
		}}
		size="small"
		onChange={debounce(onChange, 800)}
		placeholder={placeholderFilter}
		fullWidth
		endAdornment={
			<SearchIcon sx={{
				height: "24px",
				width: "24px",
			}}
			></SearchIcon>
		}
	/>
);
const TreeSideBar = ({onClick,onCollapse,onFilterChange,treeNormalize}) => {
	console.log('TreeSideBar re-render ')
	
	return (
		<>
		<TextFieldFilter onChange={onFilterChange} placeholderFilter={'Search for a topic, subtopic, course, module...'} />
		<Grid item direction="column" 
			style={{ maxHeight: '100%', overflowY: 'auto', 
			border: ldStyle.borderBottom2
		}}>
			{
				(treeNormalize && treeNormalize[defaultRootId] && treeNormalize[defaultRootId]._childIds?.length > 0) && (
					treeNormalize[defaultRootId]._childIds.map(childId => (
						<TreeSideBarNode
							key={childId}
							_id={childId}
							_parentId={defaultRootId}
							_tree={treeNormalize}
							_level={0}
							onClick={onClick}
							onCollapse={onCollapse}
						/>
					))
				)
			}
		</Grid>
		</>
	);
}
export { TreeSideBar };