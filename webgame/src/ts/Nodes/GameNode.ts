import {
    CreateElement, CreateElementWithClasses,
    CreateElementWithid, CreateElementWithIdAndClasses, CreateInput,
    CreateNumberInput,
    CreateSelectInput,
    CreateTextInput,
    CreateTextsInput
} from "../Utils/HtmlUtils";
import {game_node_map} from "../../index";
import {GameNode} from "./GameNodeItf";


export class BaseNode implements GameNode{
    desc: string = "";
    id: string = "";
    params: Map<any, string> = new Map();
    type: string = "Base";
    children: GameNode[] = new  Array<GameNode>();
    parentNode: GameNode | undefined = undefined;

    getDesc(): string {
        return this.desc;
    }

    getId(): string {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getParentNode(): GameNode|undefined {
        return this.parentNode;
    }

    getChildren(): GameNode[]|undefined {
        return this.children;
    }

    getParams(): Map<any, string> {
        return this.params;
    }

    constructor(id:string, desc:string) {
        this.id = id;
        this.desc = desc;
        this.params.set("desc","string")

    }
}

export class BeginNode extends BaseNode{
    type: string = "begin";
    getType(): string {
        return this.type;
    }
}

export class PersonNode extends BaseNode{
    type:string = "person"
    name: string | undefined;
    age: number | undefined;
    gender: string | undefined;

    getType(): string {
        return this.type;
    }
    constructor(id:string,desc:string);
    constructor(id:string, desc:string, name: string, age: number, gender: string);
    constructor(id:string, desc:string, name?: string, age?: number, gender?: string) {
        super(id,desc)
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.params.set("type","show")
        this.params.set("name","string")
        this.params.set("age","number")
        this.params.set("sexes","enums")
    }
}
export class GameDialog{
    constructor(speaker: string, conversation: string[]) {
        this.speaker = speaker;
        this.conversation = conversation;
    }
    speaker:string = ""
    conversation:string[] = new Array
}
export class DialogNode extends BaseNode{
    dialogs: GameDialog[] = Array();
    type:string = "dialog"

    getType(): string {
        return this.type;
    }
    getDialog():GameDialog[] {
        return this.dialogs;
    }
    setDialog(dialog:GameDialog[]) {
        this.dialogs = dialog;
    }
    constructor(id:string, desc:string, dialogs?:string[]) {
        super(id,desc)
        this.params.set("type","show")
        this.params.set("dialogs","dialog")
    }
}
const node_name="_node_name"
const node_desc="_node_desc"

export function Refresh(id:string){
    let id_node_name = document.getElementById(id+node_name)!
    let id_node_desc = document.getElementById(id+node_desc)!
    id_node_name.innerText = game_node_map.get(id).getType()
    id_node_desc.innerText = game_node_map.get(id).getDesc()
}

export function SetOptions(node:any, father:HTMLElement) {
    father.innerHTML=""
    const nodeId = CreateElementWithid("div", node.id+"_option", node.id, father)
    nodeId.classList.add("continer")
    node.params.forEach((value:string, key:string) => {
        CreateInput(node.id, key, value, father)
    })
}

export function CreateNodeAndView(node:GameNode, father:HTMLElement) {
    let nodeId = CreateElementWithid("div", node.id, "", father)
    nodeId.classList.add("node_div")
    let nodeId_div =  CreateElement("div", "", nodeId)
    CreateElementWithIdAndClasses("div",node.getId()+"_node_name", node.getType(), nodeId_div,["node_name"])
    CreateElementWithIdAndClasses("div",node.getId()+"_node_desc", node.getDesc(), nodeId_div, ["node_description"])
    nodeId.addEventListener("click", function (event){
        SetOptions(game_node_map.get(nodeId.id), document.getElementById("options_home")!)
        //document.getElementById(node.getId()+"_desc")!.innerText = game_node_map.get(nodeId.id).getDesc()
    });
    switch (node.getType()) {
        case "begin":
            nodeId.classList.add("begin")
            break;
        case "person":
            nodeId.classList.add("person")
            break;
        default:
            break;
    }
    return nodeId
}