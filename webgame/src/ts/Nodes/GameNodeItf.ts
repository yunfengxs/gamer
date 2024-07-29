export interface GameNode{
    id:string
    desc:string
    type:string
    params :string[][];
    parNoIds:string[]|undefined
    chdNoIds:string[]|undefined

    getType(): string;
    getDesc(): string;
    getId(): string;
    getParams(): string[][];
    getParentNodeIds() : string[]|undefined;
    getChildrenNodeIds() : string[]|undefined;
}