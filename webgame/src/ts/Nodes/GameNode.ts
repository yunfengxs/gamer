import {
    CreateElement,
    CreateElementWithid, CreateInput,
    CreateNumberInput,
    CreateSelectInput,
    CreateTextInput,
    CreateTextsInput
} from "../Utils/HtmlUtils";

interface GameNode{
    id:string
    desc:string

    getType(): string;
    getId(): string;
}

let index: Array<string> = ["男","女"];
export class Person implements GameNode{
    node_type:string = "person"
    id : string
    params : Map<any,string> = new Map<any, string>()
    name: string | undefined;
    age: number | undefined;
    gender: string | undefined;
    desc: string;
    constructor(id:string,desc:string);
    constructor(id:string, desc:string, name: string, age: number, gender: string);
    constructor(id:string,  desc:string, name?: string, age?: number, gender?: string) {
        this.params.set("node_type","show")
        this.params.set("name","string")
        this.params.set("age","number")
        this.params.set("desc","texts")
        this.params.set("sexes","enums")
        this.id = id;
        this.desc = desc;
        this.name = name;
        this.age = age;
        this.gender = gender;
    }

    getId(): string {
        return this.id;
    }

    getType(): string {
        return this.desc;
    }
}
export function SetOptions (node:any, father:HTMLElement) {
    const nodeId = CreateElementWithid("div", node.id, node.id, father)
    nodeId.classList.add("continer")
    node.params.forEach((value:string, key:string) => {
        CreateInput(node.id, key, value, father)
    })
}

export function CreateNodeAndView(node:GameNode, father:HTMLElement) {
    const nodeId = CreateElementWithid("div", node.id, node.id, father)
    CreateElement("h3", node.getType(), nodeId)
    CreateElementWithid("h4",node.getId()+"_desc", "",nodeId)
    switch (node.getType()) {
        case "person":

            nodeId.classList.add("person")
            break;
        default:
            break;
    }
}