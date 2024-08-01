import $ from 'jquery'
import {DeleteNode, game_node_map} from '../../index'
import {GameNode} from "../Nodes/GameNodeItf";
import {BaseModal, DialogModal, PackageModal, PersonModal} from "./BaseModal";
import {DialogNode, PackageNode, PersonNode} from "../Nodes/GameNode";

const personModal = new PersonModal()
const packageModal = new PackageModal()
const dialogModal = new DialogModal()
let contextShower = document.getElementById('options_shower') as HTMLElement;
export function CreateElement(tag:string, innerText:string, father:HTMLElement) {
    var element = document.createElement(tag)
    element.innerText = innerText
    father.appendChild(element)
    return element
}
export function CreateElementWithClasses(tag:string, innerText:string, father:HTMLElement, classes:Array<string>) {
    let element = CreateElement(tag, innerText, father)
    for (const oneClass of classes) {
        element.classList.add(oneClass)
    }
    return element
}
export function CreateElementWithIdAndClasses(tag:string, id:string,innerText:string, father:HTMLElement, classes:Array<string>) {
    let element = CreateElementWithClasses(tag, innerText, father,classes)
    element.id=id
    return element
}
export function CreateElementWithid(tag:string, id:string, innerText:string, father:HTMLElement) {
    let element = CreateElement(tag, innerText, father)
    element.id = id
    return element
}
export function CreateTextInput(id:string, name:string, value:string, fatherId:HTMLElement) {
    let input_button:HTMLInputElement = CreateElementWithClasses("input","", fatherId,["form-control"]) as HTMLInputElement
    input_button.type="text"
    input_button.value=value
    input_button.id = id+"_"+name+"_input"
}
export function CreateTextsInput(id:string, name:string, value:string, fatherId:HTMLElement) {
    let input_button:HTMLElement = CreateElementWithClasses("textarea","", fatherId, ["form-control"]);
    input_button.id = id+"_"+name+"_input"
    input_button.innerText = value
}
export function CreateNumberInput(id:string, name:string,value:number, fatherId:HTMLElement) {
    let input_button:HTMLInputElement = CreateElementWithClasses("input","", fatherId,["form-control"]) as HTMLInputElement
    input_button.type="number"
    input_button.value=String(value)
    input_button.id = id+"_"+name+"_input"
}
function CreateModal(id:string, name:string, fatherId:HTMLElement, func:any) {
    CreateElementWithClasses("button", name, fatherId,["form-control"]).addEventListener("click", () => func(id))
}

let ModalMap: Map<string, BaseModal>;
// @ts-ignore
ModalMap = new Map([
    ["person",personModal],
    ["dialog", dialogModal],
    ["package", packageModal],
]);
export function DeleteNodeView(id:string) {
    let node = document.getElementById(id)!
    node.parentNode!.removeChild(node);
    document.getElementById("options_shower")!.innerHTML=""
    document.getElementById("options_home")!.innerHTML=""
}
export function CreateInput(id:string, name:string, fatherId:HTMLElement) {
    CreateElementWithClasses("button", name, fatherId,["form-control"]).addEventListener("click", () => {
        console.log(game_node_map.get(id).type)
        ModalMap.get(game_node_map.get(id).type)!.Init(id)
    })
    CreateElementWithClasses("button", "delete", fatherId,["form-control"]).addEventListener("click", () => {
        DeleteNode(id)
    })
}
export function UpdatePersonContext(id:string) {
    contextShower.innerHTML = ""
    for (const item of (game_node_map.get(id) as PersonNode).people){
        let oneline1 = CreateElementWithClasses("div","", contextShower,["row"])!
        CreateElement("text","新增", oneline1).style.width="10%"
        CreateElement("text",item.name, oneline1).style.width="20%"
        CreateElement("text","种族："+item.race, oneline1).style.width="30%"
        CreateElement("text","境界："+item.state, oneline1).style.width="30%"
        let oneline2 = CreateElementWithClasses("div","", contextShower,["row"])!
        CreateElement("text","性别："+item.gender, oneline2).style.width="33%"
        CreateElement("text","年龄："+item.age, oneline2).style.width="33%"
        CreateElement("text","等级："+item.level, oneline2).style.width="33%"
    }
}
export function UpdatePackageContext(id:string) {
    contextShower.innerHTML = ""
    CreateElementWithClasses("text","包裹", contextShower,["col-3"])
    for (const item of (game_node_map.get(id) as PackageNode).target){
        let oneline = CreateElementWithClasses("div","", contextShower,["row"])!
        CreateElementWithClasses("text","新增", oneline,["col-2"])
        CreateElementWithClasses("text",item.type, oneline,["col-2"])
        CreateElementWithClasses("text",item.name, oneline,["col-8"])
    }
}

export function UpdateDialogContext(id:string) {
    contextShower.innerHTML = ""
    for (const dialogOne of (game_node_map.get(id) as DialogNode).getDialog()){
        let oneline = CreateElementWithClasses("div","", contextShower,["row"])!
        CreateElementWithClasses("text",dialogOne.spker, oneline,["col-2"])
        CreateElementWithClasses("pre",dialogOne.convs.join('\n'), oneline,["option_show", "col-10"])
    }
}
export function UpdateOptionShower(id:string) {
    let contextShower = document.getElementById('options_shower') as HTMLElement;
    let UpdateMap = new Map([
        ["dialog",UpdateDialogContext],
        ["package",UpdatePackageContext],
        ["person",UpdatePersonContext]
    ])
    UpdateMap.get(game_node_map.get(id)["type"])!(id)
}
export function CreateSelectInput(name:string, options: string[], fatherId:HTMLElement) {
    const div = CreateElementWithClasses("div", ""  ,fatherId,["input_row"]);
    CreateElementWithClasses("text", name ,div, ["name_text"]);
// 创建select元素
    const select = document.createElement('select');
// 循环生成并添加option元素
    options.forEach((optionText) => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
    });
    select.classList.add("input_content")
    div.appendChild(select)
    CreateElementWithClasses("button","ok",div,["ok_button"]);
}

export function GetRightPosition(lastNodeId:string) {
    let $lastElement = $("#"+lastNodeId)!;
    let positionTop = $lastElement!.offset()!.top;
    let positionLeft = $lastElement!.offset()!.left;
    let width = $lastElement.outerWidth()!;
    return [positionLeft + width + 10, positionTop]
}

export function GetBottomPosition(lastNodeId:string, size:number) {
    let $lastElement = $("#"+lastNodeId);
    let positionTop = $lastElement!.offset()!.top;
    let positionLeft = $lastElement!.offset()!.left;
    let height = $lastElement.outerHeight()!;
    let width = $lastElement.outerWidth()!;
    let top = positionTop + height + 30;
    if (top + height > window.innerHeight - 60) {
        document.body.style.height = (document.body.offsetHeight * 1.5) + "px";
    }
    return [positionLeft - width * size, top]
}
/*
设置组件的位置
 */
export function GetCompPosition(node:GameNode, lastNode:string) {
    if (node.getParentNodeIds()!.indexOf(lastNode) != -1) {
        const firstPar = node!.getParentNodeIds()![0]
        return GetBottomPosition(firstPar, game_node_map.get(firstPar).getChildrenNodeIds()!.length - 1)
    } else {
        return GetRightPosition(lastNode)
    }
}