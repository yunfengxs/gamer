import {
    CreateElement,
    CreateElementWithid, CreateInput,
    CreateNumberInput,
    CreateSelectInput,
    CreateTextInput,
    CreateTextsInput
} from "../Utils/HtmlUtils";
import {setJsplumb} from "../Utils/JsplumbUtils";
import {game_node_map} from "../../index";

interface GameNode{
    id:string
    desc:string
    type:string

    getType(): string;
    getDesc(): string;
    getId(): string;
}

let index: Array<string> = ["男","女"];
export class Person implements GameNode{
    type:string = "person"
    desc: string = ""
    id : string = ""
    params : Map<any,string> = new Map<any, string>()
    name: string | undefined;
    age: number | undefined;
    gender: string | undefined;

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
        return this.type;
    }

    getDesc(): string {
        return this.desc;
    }
}
export function SetOptions (node:any, father:HTMLElement) {
    father.innerHTML=""
    const nodeId = CreateElementWithid("div", node.id, node.id, father)
    nodeId.classList.add("continer")
    node.params.forEach((value:string, key:string) => {
        CreateInput(node.id, key, value, father)
    })
}

export function CreateNodeAndView(jsPlumbInstance:any, node:GameNode, father:HTMLElement) {
    let nodeId = CreateElementWithid("div", node.id, "", father)
    nodeId.classList.add("node_div")
    CreateElement("div", node.getType(), nodeId)
    CreateElementWithid("div",node.getId()+"_desc", node.getDesc(),nodeId)
    setJsplumb(jsPlumbInstance, node.id)
    nodeId.addEventListener("click", function (event){
        SetOptions(game_node_map.get(nodeId.id), document.getElementById("options_home")!)
        document.getElementById(node.getId()+"_desc")!.innerText = game_node_map.get(nodeId.id).getDesc()
    });
    switch (node.getType()) {
        case "person":
            nodeId.classList.add("person")
            break;
        default:
            break;
    }
}