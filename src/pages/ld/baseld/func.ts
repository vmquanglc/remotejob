import { ITopic, ITreeBase, NormalizedTree } from ".";

const escapeRegExp = (str) => // or better use 'escape-string-regexp' package
  str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

const makeCollapse=item => {
    item._isCollapse=true;
}
const makeVisible=item => {
    item._isShow=true;
}
const recursionParentFn=(item,tree,callBack)=>{
    tree[item._id] = callBack(item)
    if(item._parentId && tree[item._parentId]){
        recursionParentFn(tree[item._parentId],tree,callBack)
    }
}
  
let recursionChildFn=(item,tree,callBack)=>{
    let child=item._childIds;
    tree[item._id] =callBack(item)
    if(child.length>0){
        child.forEach(id=>{
            if(tree[id]){
                recursionChildFn(tree[id],tree,callBack)
            }
        })
    }
}
const y4AllOrder = (ids, tree) => {
    return [...ids].sort((id1, id2) => {
      const _dataNode1 = tree[id1]._dataNode;
      const _dataNode2 = tree[id2]._dataNode;
      return (_dataNode1?.level||0) - (_dataNode2?.level||0) || (_dataNode1?.order||0) - (_dataNode2?.order||0);
    });
  };
const defaultRootId=-100000

const normalizeTree = (data: any[]): any => {
    const normalized = {};

    const defaultRoot={
        _id: defaultRootId,
        _parentId: '',
        _level: -1,
        _isCollapse: true,
        _isShow: true,
        _childIds: [],
        _dataNode:{
            name:''
        }
    };

    normalized[defaultRootId] = defaultRoot;

    if (!data || !!!data.length) {
        return normalized;
    }

    data.forEach((item) => {
        const { _id, _parentId } = item;
        let newItem={...defaultRoot,_childIds:[],...item}
        if (_parentId) {
            if (normalized[_parentId]) {
                normalized[_parentId].childIds.push(_id);
            } else {
                normalized[_parentId] = { ...defaultRoot, childIds: [_id] };
            }
        } else {
            normalized[defaultRootId].childIds.push(_id);
        }

        normalized[_id] = newItem;
    });
    return normalized;
};
const normalizeY4AllTree = (data: any[],config:any={idField:'id',childrenField:'children',_defaultDataNode:{}}): any => {
    const {idField='id',childrenField='children',_defaultDataNode}=config
    const normalized = {};
    const defaultRoot={
        _id: defaultRootId,
        _parentId: '',
        _level: -1,
        _isCollapse: false,
        _isShow: true,
        _childIds: [],
        _dataNode:{..._defaultDataNode}
    };
    normalized[defaultRootId] = {...defaultRoot,_childIds:[]};

    if (!data || !!!data.length) {
        return normalized;
    }
    const recursionFn=(item,parent,tree)=>{
        const { [childrenField]: _, ...cloneNode } = item;
        tree[parent._id]._childIds.push(item[idField])
        //add item to tree
        tree[item[idField]] ??= {
            ...defaultRoot,
            _id:item[idField],
            _parentId:parent._id,
            _level:item.level,
            _childIds:[],
            _dataNode:cloneNode
        }
        item[childrenField]?.length && item[childrenField].forEach(x=>recursionFn(x,tree[item[idField]],tree))
    }
    data?.length && data.forEach((item) => recursionFn(item,normalized[defaultRootId],normalized));
    //make all first children collapse
    // normalized[defaultRootId]._childIds.forEach(id=>{
    //     normalized[id]._isCollapse=false;
    // })
    makeOrder(normalized);
    return normalized;
};
const getActivePathFromTree=(activeId,tree: any)=>{
    if(!tree?.[activeId]){
        return [];
    }
    let result=[];
    let item=tree[activeId]
    recursionParentFn(item,tree,(item)=>{
        result.push(item._dataNode)
        return item
    })
    return result;
}

const getActiveIdChildrenFromTree=(activeId,tree)=>{
    if(!tree?.[activeId]){
        return []
    }
    let result=[];
    let currentItem=tree[activeId]
    recursionChildFn(currentItem,tree,(item)=>{
        result.push(item._id)
        return item
    })
    return result.filter(x=>x!=defaultRootId)
}
const makeOrder=(tree)=>{
    Object.keys(tree).forEach(id=>{
        recursionChildFn(tree[id],tree,(item)=>{
            item._childIds=y4AllOrder(item._childIds,tree)
            return item
        })
    })
}

const filterBy = (term) => {
  const re = new RegExp(escapeRegExp(term), 'i')
  return person => {
    for (let prop in person) {
      if (!person.hasOwnProperty(prop)) {
        continue;
      }
      if (re.test(person[prop])) {
        return true;
      }
    }
    return false;        
  }
}

const searchTree=(textSearch:string,field:string,tree: any):any=>{
    const re = new RegExp(escapeRegExp(textSearch), 'i')
    return Object.values(tree).filter(item=>{
        if(re.test(item['_dataNode']?.[field])){
            return true;
        }else{
            return false;
        }
    })
}
const getSearchVisible=(textSearch:string,field:string,tree: any):any=>{
    if(!!!textSearch){
        return getDefaultTree(tree);
    }
    //make all unvisible
    let newTree = Object.values(tree).reduce((prev: any, current: any) => {
        return { ...prev, [current._id]: { ...current, _isShow: false, _isCollapse: false } };
    }, {});
    let visibleTree=searchTree(textSearch,field,tree);
  
    //make current and parrent is visible and collapse on
    visibleTree.forEach(item=>{
        recursionParentFn(newTree[item._id],newTree,(item)=>{
            makeVisible(item)
            makeCollapse(item)
            return item
        })
        recursionChildFn(newTree[item._id],newTree,(item)=>{
            makeVisible(item)
            return item
        })
    })
    return newTree;
}

const getDefaultTree = (tree: any): any => {
    let newTree = Object.values(tree).reduce((prev: any, current: any) => {
        return { ...prev, [current._id]: { ...current, _isShow: true, _isCollapse: false } };
    }, {});
    return newTree;
};
export { normalizeTree,getSearchVisible,normalizeY4AllTree,defaultRootId ,getActivePathFromTree,makeOrder,getActiveIdChildrenFromTree,y4AllOrder};
