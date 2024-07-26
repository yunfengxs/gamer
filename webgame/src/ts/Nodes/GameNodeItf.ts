export interface GameNode{
    id:string
    desc:string
    type:string
    params : Map<any,string>;
    parentNode:GameNode|undefined
    children:GameNode[]|undefined

    getType(): string;
    getDesc(): string;
    getId(): string;
    getParams(): Map<any,string>;
    getParentNode() : GameNode|undefined;
    getChildren() : GameNode[]|undefined;
}