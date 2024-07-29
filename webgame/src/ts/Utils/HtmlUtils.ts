import $ from 'jquery'
import {game_node_map} from '../../index'
import {DialogNode, Refresh} from '../Nodes/GameNode'
import {openEditModal} from "./ModalDiv";
import {GameNode} from "../Nodes/GameNodeItf";
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
export function CreateDialogInput(id:string, name:string, fatherId:HTMLElement) {
    CreateElementWithClasses("button","编辑",fatherId,["form-control"]).addEventListener("click", () => openEditModal(id))
}
export function CreateInput(id:string, name:string, type:string, fatherId:HTMLElement) {
    if (type == "show") {

    } else if(type == "dialog") {
        CreateDialogInput(id, name, fatherId)
    } else {
        const div = CreateElementWithClasses("form", "", fatherId, ["input-group", "mb-3"]);
        const before = CreateElementWithClasses("div", "", div, ["input-group-prepend"])
        switch (type) {
            case "string":
                CreateTextInput(id, name, game_node_map.get(id)[name], div)
                break;
            case "number":
                CreateNumberInput(id, name,game_node_map.get(id)[name], div)
                break;
            case "texts":
                CreateTextsInput(id, name, game_node_map.get(id)[name], div)
                break;
            default:
                break;
        }
        const after = CreateElementWithClasses("div", "", div, ["input-group-append"])
        CreateElementWithClasses("span", name, before, ["input-group-text"]);
        let submit = CreateElementWithClasses("button", "ok", after, ["input-group-text"]) as HTMLButtonElement;
        div.addEventListener('submit', function (event: Event) {
            event.preventDefault()
            let content = document.getElementById(id + "_" + name + "_input")! as HTMLInputElement
            if(type == "number") {
                game_node_map.get(id)[name] = Number(content.value)
            } else {
                game_node_map.get(id)[name] = content.value
            }
            Refresh(id)
        });
        CreateElement("br", "", div);
    }
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