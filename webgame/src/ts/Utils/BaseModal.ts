import {Item} from "../Nodes/Items";
import {CreateElement, CreateElementWithClasses, UpdatePersonContext} from "./HtmlUtils";
import {game_node_map} from "../../index";
import {UpdatePackageContext} from "./PackageModal";
import "../../css/BaseModal.css"
import {DialogNode, GameDialog, Person} from "../Nodes/GameNode";
import {UpdateDialogContext} from "./DialogModel";
import Modal from "bootstrap/js/dist/modal";

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
        UpdatePackageContext(id)
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
        UpdateDialogContext(id)
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
        UpdatePersonContext(id)
    }
}