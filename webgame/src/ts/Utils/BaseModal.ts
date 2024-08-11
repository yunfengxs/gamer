import {Item} from "../Nodes/Items";
import {CreateElement, CreateElementWithClasses} from "./HtmlUtils";
import {game_node_map} from "../../index";
import "../../css/BaseModal.css"
import {Condition, DialogNode, GameDialog, PackageNode, Person, PersonNode} from "../Nodes/GameNode";

class OneRow{
    label:string = ""
    type:string = ""
    size1:string = ""
    size2:string = ""
    value:string = ""
    options:string[] = []
    values:string[]
    constructor(label: string, type: string, size1: string, size2: string, value: string, options: string[], values: string[]) {
        this.label = label;
        this.type = type;
        this.size1 = size1;
        this.size2 = size2;
        this.value = value;
        this.options = options;
        this.values = values
    }
}
export class BaseModal {
    baseModal: HTMLElement | undefined;
    baseModalContainer: HTMLElement | undefined;
    baseAddRowBtn: HTMLElement | undefined;
    baseSaveBtn: HTMLElement | undefined;
    baseCloseBtn: HTMLElement | undefined;
    contextShower: HTMLElement = document.getElementById("options_shower")!;

    Init(id:string) {
        this.baseModal = document.getElementById("BaseModal")!;
        this.baseModalContainer = document.getElementById("BaseModalContainer")!;
        this.baseAddRowBtn = document.getElementById("BaseAddRowBtn")!;
        this.baseSaveBtn = document.getElementById("BaseSaveBtn")!;
        this.baseCloseBtn = document.getElementById("BaseCloseBtn")!;

        this.baseModalContainer.innerHTML = ""
        this.baseModal.style.display = "block";

        window.onclick = event => {
            if (event.target === this.baseModal) {
                this.baseModal.style.display = "none";
            }
        }
        this.Restore(id)
        this.baseAddRowBtn.onclick = ()=>{this.Add()}
        this.baseSaveBtn.onclick = () => {this.Save(id)}
    }
    Add() {
        console.log("this is base modal")
    }
    Restore(id:string) {
        console.log("this is base modal " + id)
    }
    Save(id:string) {
        console.log("this is base modal " + id)
    }
    UpdateShowerContext(id:string) {

    }
    AddOneRaw(fields:OneRow[]) {
        const row = CreateElementWithClasses("div","",this.baseModalContainer!, ["row-modal"])
        fields!.forEach(field => {
            const label = document.createElement("label");
            label.textContent = field.label;
            label.style.width=field.size1
            row.appendChild(label);
            const tmpDiv = CreateElement("div","", row)
            tmpDiv.style.width = field.size2
            if (field.type === "select") {
                const select = CreateElement("select", "", tmpDiv) as HTMLInputElement
                field.options!.forEach(optionText => {
                    const option = document.createElement("option");
                    option.textContent = optionText;
                    select.value = field.value
                    select.style.width="100%"
                    select.appendChild(option);
                });
            } else if (field.type === "textarea") {
                const input = CreateElement("textarea", "", tmpDiv) as HTMLTextAreaElement
                input.value = field.values.join();
                input.style.width="100%"
            } else if (field.type === "number") {
                const input = CreateElement("input", "", tmpDiv) as HTMLInputElement
                input.type = field.type;
                input.value = field.value;
                input.style.width="100%"
            } else {
                const input = CreateElement("input", "", tmpDiv) as HTMLInputElement
                input.type = field.type;
                input.value = field.value;
                input.style.width="100%"
            }
        });
        const deleteBtn = CreateElementWithClasses("button","X",row,["modal-button", "modal-button-delete"])
        deleteBtn.style.width="5%"
        deleteBtn.onclick = () => row.remove();
    }
    CommonSave(id:string) {
        this.baseModal!.style.display = "none";
        this.baseModalContainer!.innerHTML = ""
    }
}

export class PackageModal extends BaseModal {
    Add() {
        this.AddOneRaw(this.GetOneRow(new Item("","","","")))
    }
    Restore(id:string) {
        for (const item of game_node_map.get(id).target) {
            this.AddOneRaw(this.GetOneRow(item))
        }
    }
    GetOneRow(item:Item) {
        let fields : OneRow[] = []
        fields.push(new OneRow("id:","text","3%","12%",item.id,[],[]))
        fields.push(new OneRow("种类:","select","5%","10%",item.type,["功法","装备","法宝","丹药","材料","宝物","阵法","旁门"],[]))
        fields.push(new OneRow("名称:","text","5%","10%",item.name,[],[]))
        fields.push(new OneRow("描述:","text","5%","45%",item.desc,[],[]))
        return fields
    }
    UpdateShowerContext(id:string) {
        this.contextShower!.innerHTML = ""
        CreateElementWithClasses("text","包裹", this.contextShower!,["col-3"])
        for (const item of (game_node_map.get(id) as PackageNode).target){
            let oneline = CreateElementWithClasses("div","", this.contextShower!,["row"])!
            CreateElementWithClasses("text","新增", oneline,["col-2"])
            CreateElementWithClasses("text",item.type, oneline,["col-2"])
            CreateElementWithClasses("text",item.name, oneline,["col-8"])
        }
    }
    Save(id:string) {
        const rows = Array.from(this.baseModalContainer!.getElementsByClassName("row-modal"));
        let items = new Array()
        for (const row of rows) {
            const inputs = row.querySelectorAll("input");
            const select = row.querySelector("select");
            items.push(new Item(inputs[0].value,select ? select.value : '',inputs[1].value,inputs[2].value))
        }
        game_node_map.get(id).target = items
        this.CommonSave(id)
        this.UpdateShowerContext(id)
    }
}

export class DialogModal extends BaseModal {
    Add() {
        this.AddOneRaw(this.GetOneRow(new GameDialog("",[])))
    }
    Restore(id:string) {
        for (const item of game_node_map.get(id).dialogs) {
            this.AddOneRaw(this.GetOneRow(item))
        }
    }
    GetOneRow(item:GameDialog) {
        let fields : OneRow[] = []
        fields.push(new OneRow("speaker:","text","7%","10%",item.spker,[],[]))
        fields.push(new OneRow("dialog:","textarea","7%","70%","",[], item.convs))
        return fields
    }
    UpdateShowerContext(id:string) {
        this.contextShower!.innerHTML = ""
        for (const dialogOne of (game_node_map.get(id) as DialogNode).getDialog()){
            let oneline = CreateElementWithClasses("div","", this.contextShower!,["row"])!
            CreateElementWithClasses("text",dialogOne.spker, oneline,["col-2"])
            CreateElementWithClasses("pre",dialogOne.convs.join('\n'), oneline,["option_show", "col-10"])
        }
    }
    Save(id:string) {
        const rows = Array.from(this.baseModalContainer!.getElementsByClassName("row-modal"));
        let items:GameDialog[] = new Array()
        for (const row of rows) {
            const speaker = row.querySelector("input")!;
            const convers = row.querySelector("textarea")!;
            items.push(new GameDialog(speaker.value,convers.value.split("\n")))
        }
        game_node_map.get(id).dialogs = items
        this.CommonSave(id)
        this.UpdateShowerContext(id)
    }
}

export class PersonModal extends BaseModal{
    Add() {
        this.AddOneRaw(this.GetOneRow(new Person("",0,"","",0,"")))
    }
    Restore(id:string) {
        for (const item of game_node_map.get(id).people) {
            this.AddOneRaw(this.GetOneRow(item))
        }
    }
    GetOneRow(item:Person) {
        let fields : OneRow[] = []
        fields.push(new OneRow("名称:","text","5%","10%",item.name,[],[]))
        fields.push(new OneRow("年龄:","number","5%","10%",item.age.toString(),[], []))
        fields.push(new OneRow("种族:","select","5%","10%",item.race,["人族","妖族","巫族","邪异","魔族","鬼族","灵族","精怪"],[]))
        fields.push(new OneRow("性别:","select","5%","15%",item.gender,["男","女","阴阳调和","无","男扮女装","女扮男装"],[]))
        fields.push(new OneRow("等级:","number","5%","10%",item.level.toString(),[], []))
        fields.push(new OneRow("境界:","select","5%","10%",item.state,["凡人","武者","锻体","练气","筑基","金丹","元婴","飞升"],[]))
        return fields
    }
    UpdateShowerContext(id:string) {
        this.contextShower!.innerHTML = ""
        for (const item of (game_node_map.get(id) as PersonNode).people){
            let oneline1 = CreateElementWithClasses("div","", this.contextShower!,["row"])!
            CreateElement("text","新增", oneline1).style.width="10%"
            CreateElement("text",item.name, oneline1).style.width="20%"
            CreateElement("text","种族："+item.race, oneline1).style.width="30%"
            CreateElement("text","境界："+item.state, oneline1).style.width="30%"
            let oneline2 = CreateElementWithClasses("div","", this.contextShower!,["row"])!
            CreateElement("text","性别："+item.gender, oneline2).style.width="33%"
            CreateElement("text","年龄："+item.age, oneline2).style.width="33%"
            CreateElement("text","等级："+item.level, oneline2).style.width="33%"
        }
    }
    Save(id:string) {
        const rows = Array.from(this.baseModalContainer!.getElementsByClassName("row-modal"));
        let items:Person[] = new Array()
        for (const row of rows) {
            const inputs = row.querySelectorAll("input")!;
            const selects = row.querySelectorAll("select")!;
            items.push(new Person(
                inputs[0].value,
                parseInt(inputs[1].value),
                selects[0] ? selects[0].value : '',
                selects[1] ? selects[1].value : '',
                parseInt(inputs[2].value),
                selects[2] ? selects[2].value : '',))
        }
        game_node_map.get(id).people = items
        this.CommonSave(id)
        this.UpdateShowerContext(id)
    }
}
export class EventModal extends BaseModal{
    Add() {
        this.AddOneRaw(this.GetOneRow(new Condition("","","")))
    }
    GetOneRow(item:Condition) {
        let fields : OneRow[] = []
        fields.push(new OneRow("条件:","select","5%","10%",item.type,["存在","不存在","大于","小于","等于"],[]))
        fields.push(new OneRow("","select","5%","10%","",["物品","状态","属性","时间"],[]))
        fields.push(new OneRow("内容1:","text","10%","20%",item.type,[],[]))
        fields.push(new OneRow("","select","5%","10%","",["部位","时间"],[]))
        fields.push(new OneRow("内容2:","text","10%","20%",item.type,[],[]))
        return fields
    }
    Save(id:string) {
        const rows = Array.from(this.baseModalContainer!.getElementsByClassName("row-modal"));
        const inputs = rows[0].querySelectorAll("input")!;
        const selects = rows[0].querySelectorAll("select")!;
        game_node_map.get(id).condition = new Condition(
            selects[0] ? selects[0].value : '',
            (selects[1] ? selects[1].value : '') + inputs[0].value,
            (selects[2] ? selects[2].value : '') + inputs[1].value)
        this.CommonSave(id)
        this.UpdateShowerContext(id)
    }
    UpdateShowerContext(id:string) {
        this.contextShower!.innerHTML = ""
        let condition = game_node_map.get(id).condition
        let oneline1 = CreateElementWithClasses("div","", this.contextShower!,["row"])!
        CreateElement("text","if", oneline1).style.width="10%"
        CreateElement("text",condition.type, oneline1).style.width="20%"
        CreateElement("text",condition.cond1, oneline1).style.width="35%"
        CreateElement("text",condition.cond2, oneline1).style.width="35%"
    }
    Restore(id:string) {
        this.AddOneRaw(this.GetOneRow(game_node_map.get(id).condition))
    }
}