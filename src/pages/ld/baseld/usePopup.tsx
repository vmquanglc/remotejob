
interface IStatePopup<T extends string> {
    isOpen: boolean;
    type: ""|null|T;
    data: any;
}


export type {IStatePopup}