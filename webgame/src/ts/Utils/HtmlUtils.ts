import $ from 'jquery'
import {DeleteNode, game_node_map} from '../../index'
import {GameNode} from "../Nodes/GameNodeItf";
import {BaseModal, DialogModal, EventModal, PackageModal, PersonModal} from "./BaseModal";
import {DialogNode, PackageNode, PersonNode, Refresh} from "../Nodes/GameNode";
import "../../css/style.css"

const personModal = new PersonModal()
const packageModal = new PackageModal()
const dialogModal = new DialogModal()
const eventModal = new EventModal()
let contextShower = document.getElementById('options_shower') as HTMLElement;

let ModalMap: Map<string, BaseModal>;
// @ts-ignore
ModalMap = new Map([
    ["person",personModal],
    ["dialog", dialogModal],
    ["package", packageModal],
    ["event", eventModal],
]);

export function UpdateOptionShower(id:string) {
    if (game_node_map.get(id).type != "begin"){
        ModalMap.get(game_node_map.get(id).type)!.UpdateShowerContext(id)
    }
}
export function DeleteNodeView(id:string) {
    let node = document.getElementById(id)!
    node.parentNode!.removeChild(node);
    document.getElementById("options_shower")!.innerHTML=""
    document.getElementById("options_home")!.innerHTML=""
}
export function CreateInput(id:string, name:string, fatherId:HTMLElement) {
    const div = CreateElementWithClasses("div", "", fatherId, ["input-group", "mb-3"]);
    CreateElementWithClasses("text", "desc", div, ["form-control","mb-1"]).setAttribute('for','inputField');

    let input = CreateElementWithClasses("input", "desc", div, ["form-control"]) as HTMLInputElement
    input.type = "text"
    input.id = "options_"+id+"_desc"

    let submit = CreateElementWithClasses("button", "ok", div, ["btn", "btn-primary"]) as HTMLButtonElement;
    submit.onclick = () => {
        let content = document.getElementById("options_"+id+"_desc")! as HTMLInputElement
        game_node_map.get(id).desc = content.value
        Refresh(id)
    }
    CreateElement("br", "", div);
    CreateElementWithClasses("button", name, fatherId,["button_edit","form-control"]).addEventListener("click", () => {
        if (game_node_map.get(id).type != "begin"){
            ModalMap.get(game_node_map.get(id).type)!.Init(id)
        }
    })
    CreateElementWithClasses("button", "delete", fatherId,["button_delete","form-control"]).addEventListener("click", () => {
        DeleteNode(id)
    })
}
/*
设置组件的位置
 */
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

export function GetCompPosition(node:GameNode, lastNode:string) {
    if (node.getParentNodeIds()!.indexOf(lastNode) != -1) {
        const firstPar = node!.getParentNodeIds()![0]
        return GetBottomPosition(firstPar, game_node_map.get(firstPar).getChildrenNodeIds()!.length - 1)
    } else {
        return GetRightPosition(lastNode)
    }
}
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