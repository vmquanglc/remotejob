interface ITreeBase<T> {
    _id: string|number;
    _parentId: string|number;
    _level:number,
    _isCollapse: boolean;
    _isShow: boolean;
    _childIds:(string|number)[]
    _dataNode:T
}


interface NormalizedTree<T> {
    [id: string | number]: T;
}
interface IBaseNodeProp<T>{
    _id: string|number;
    _parentId: string|number;
    _tree:T,
    _level:number
}

interface ITopic {
    id: number
    name: string
    level:number
    type:string
    description: string
    order: number
    max_point:number
    created_at : string
    updated_at:string
    childIds: ITopic[],
    pic: {
        id: number;
        first_name: string;
        last_name: string;
        full_name: string;
        email: string;
    };
}

interface ILesson {
    name: string;
    id: string;
    childIds: string[];
    type: "PDF" | "Video";
    parentId: string;
    isCollapse: boolean;
    isShow: boolean;
    point:number;
}



const ldBackground={
    background_2:"#ADABC3",
    background_3:"#E7E6F2",
    green_done:"#52710C",
    primary:"#ffffff"
}
const ldStyle={
    border:"1px solid #E7E6F2",
    borderBottom1:"1px solid #E7E6F2",
    borderBottom2:"1px solid #CCC",
    background: "#ffffff",
    style1:"10px 20px 10px 20px",
    style2:"10px 20px 20px 20px",
    style3:"0 20px",
    style4:"20px",
    style5:"9px 16px",
    textwhite:"#ffffff",
    textgreendone:"#52710C",
}
const cacheKey={
    LDManageTreeCache:'LDManageTreeCache'
}
const activeState:string[]=["Active","InActive"]
export type { ITreeBase,NormalizedTree,IBaseNodeProp,ITopic ,ILesson};
export {ldBackground ,ldStyle,cacheKey,activeState};