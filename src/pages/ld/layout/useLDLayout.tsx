import { getSearchVisible, NormalizedTree, normalizeY4AllTree,defaultRootId, ITopic, getActiveIdChildrenFromTree, y4AllOrder } from "../baseld";
import { getTopicTree } from "src/services/ldservice/ld.service";
import { useState } from "react";
import { TopicMap } from "./treesidebarnode";
import { useQuery } from "react-query";
export const useLDLayout=()=>{
    const [activeId,setActiveId]=useState<number>(defaultRootId);
    const [treeNormalize, setTreeNormalize] = useState<NormalizedTree<TopicMap>>(null)
    const handleOnClick = (id, parentId) => {
        setActiveId(id)
        changeDataLocalByActiveId(id)
    }
    const changeDataLocalByActiveId=(activeId)=>{
        let listIds=getActiveIdChildrenFromTree(activeId,treeNormalize);
        let listTree=y4AllOrder(listIds,treeNormalize).map(id=>treeNormalize[id]._dataNode);
        setDataLocal({ list: listTree as ITopic[], total: listTree.length as number });
    }

    const handleOnCollapse = (id, parentId) => {
        const currentNode = treeNormalize[id]
        let newNode = {
            ...currentNode,
            _isCollapse: !currentNode._isCollapse
        }
        setTreeNormalize({
            ...treeNormalize,
            [currentNode._id]: newNode
        })
    }

    const handleOnFilterChange = (e) => {
        setTreeNormalize(getSearchVisible(e.target.value, 'name', treeNormalize))
    }
    const [dataLocal, setDataLocal] = useState<{ list: ITopic[], total: number }>({ list: [], total: 0 })

    return {
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
    }
}