export interface GameNode{
    id:string
    desc:string
    type:string
    params : Map<any,string>;
    parentNodeIds:string[]|undefined
    childrenNodeIds:string[]|undefined

    getType(): string;
    getDesc(): string;
    getId(): string;
    getParams(): Map<any,string>;
    getParentNodeIds() : string[]|undefined;
    getChildrenNodeIds() : string[]|undefined;
}