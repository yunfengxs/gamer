import {
    CreateElement, CreateElementWithClasses,
    CreateElementWithid, CreateElementWithIdAndClasses, CreateInput, UpdateOptionShower
} from "../Utils/HtmlUtils";
import {game_node_map, game_node_map_loaded} from "../../index";
import {GameNode} from "./GameNodeItf";
import {Item} from "./Items";


const node_name="_node_name"
const node_desc="_node_desc"

export class BaseNode implements GameNode{
    desc: string = "";
    id: string = "";
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

    constructor(id:string, desc:string) {
        this.id = id;
        this.desc = desc;
    }
}

export class BeginNode extends BaseNode{
    constructor(id: string, desc: string) {
        super(id, desc);
    }
    type: string = "begin";
    getType(): string {
        return this.type;
    }
}

export class Person{
    name: string = ""
    age: number = 0
    race:string = ""
    gender: string =""
    level: number = 0
    state:string = ""

    constructor(name: string, age: number, race: string, gender: string, level: number, state:string) {
        this.name = name;
        this.age = age;
        this.race = race;
        this.gender = gender;
        this.level = level;
        this.state = state;
    }
}

export class PersonNode extends BaseNode{
    type:string = "person"
    people:Person[] = []

    getType(): string {
        return this.type;
    }
    constructor(id:string, desc:string, people: Person[]) {
        super(id,desc)
        this.people = people
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
    }
}

export function Refresh(id:string){
    let id_node_desc = document.getElementById(id+node_desc)!
    id_node_desc.innerText = game_node_map.get(id)!.getDesc()
}

export function SetOptions(node:any, father:HTMLElement) {
    father.innerHTML=""
    const nodeId = CreateElementWithid("div", node.id+"_option", node.id, father)
    nodeId.classList.add("continer")
    CreateInput(node.id,"change "+node.type, father)
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