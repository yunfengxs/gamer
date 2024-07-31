import {
    CreateElement, CreateElementWithClasses,
    CreateElementWithid, CreateElementWithIdAndClasses, CreateInput,
    CreateNumberInput,
    CreateSelectInput,
    CreateTextInput,
    CreateTextsInput, UpdateOptionShower
} from "../Utils/HtmlUtils";
import {game_node_map, game_node_map_loaded} from "../../index";
import {GameNode} from "./GameNodeItf";
import {Item} from "./Items";


const node_name="_node_name"
const node_desc="_node_desc"

export class BaseNode implements GameNode{
    desc: string = "";
    id: string = "";
    params: string[][] = [];
    type: string = "Base";
    chdNoIds: string[] = [];
    parNoIds: string[] = [];

    getDesc(): string {
        return this.desc;
    }

    getId(): string {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    getParentNodeIds(): string[]|undefined {
        return this.parNoIds;
    }

    getChildrenNodeIds(): string[]|undefined {
        return this.chdNoIds;
    }

    getParams(): string[][] {
        return this.params;
    }

    constructor(id:string, desc:string) {
        this.id = id;
        this.desc = desc;
        this.params.push(["desc","string"]);
    }
}

export class BeginNode extends BaseNode{
    constructor(id: string, desc: string) {
        super(id, desc);
        this.params.push(["type","show"])
    }
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
        this.params.push(["type","show"])
        this.params.push(["name","string"])
        this.params.push(["age","number"])
        this.params.push(["sexes","enums"])
    }
}
export class GameDialog{
    constructor(spker: string, convs: string[]) {
        this.spker = spker;
        this.convs = convs;
    }
    spker:string = ""
    convs:string[] = new Array
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
        this.params.push(["type","show"])
        this.params.push(["dialogs","modal"])
    }
}
export class PackageNode extends BaseNode{
    type:string = "package"
    target:Item[] = new Array()
    getType(): string {
        return this.type;
    }
    constructor(id:string, desc:string) {
        super(id,desc)
        this.params.push(["type","show"])
        this.params.push(["修改包裹","modal"])
    }
}

export function Refresh(id:string){
    let id_node_name = document.getElementById(id+node_name)!
    let id_node_desc = document.getElementById(id+node_desc)!
    id_node_name.innerText = game_node_map.get(id)!.getType()
    id_node_desc.innerText = game_node_map.get(id)!.getDesc()
}

export function SetOptions(node:any, father:HTMLElement) {
    father.innerHTML=""
    const nodeId = CreateElementWithid("div", node.id+"_option", node.id, father)
    nodeId.classList.add("continer")
    for (const paramsStr of node.params) {
        CreateInput(node.id, paramsStr[0], paramsStr[1], father)
    }
}

export function CreateNodeAndView(node:GameNode, father:HTMLElement) {
    let nodeId = CreateElementWithid("div", node.id, "", father)
    nodeId.classList.add("node_div")
    let nodeId_div =  CreateElement("div", "", nodeId)
    let name = node.getId()
    CreateElementWithIdAndClasses("div",name+"_node_name", node.getType(), nodeId_div,["node_name"])
    CreateElementWithIdAndClasses("div",name+"_node_desc", node.getDesc(), nodeId_div, ["node_description"])
    nodeId.addEventListener("click", function (event){
        SetOptions(game_node_map.get(nodeId.id), document.getElementById("options_home")!)
        UpdateOptionShower(nodeId.id)
    });
    nodeId.classList.add(node.getType())
    return nodeId
}
    // switch (node.getType()) {
    //     case "begin":
    //         nodeId.classList.add("begin")
    //         break;
    //     case "person":
    //         nodeId.classList.add("person")
    //         break;
    //     case "dialog":
    //         nodeId.classList.add("dialog")
    //         break;
    //     case "package":
    //         nodeId.classList.add()
    //     default:
    //         break;
    // }
