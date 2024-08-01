export interface GameNode{
    id:string
    desc:string
    type:string
    parNoIds:string[]|undefined
    chdNoIds:string[]|undefined

    getType(): string;
    getDesc(): string;
    getId(): string;
    getParentNodeIds() : string[]|undefined;
    getChildrenNodeIds() : string[]|undefined;
}