// 引入 jQuery 和 jQuery UI
import $ from 'jquery'
import './css/style.css'
import 'jquery/dist/jquery.slim'
import 'jquery-ui-dist/jquery-ui'; // 注意这里引入的路径可能需要根据实际情况调整
import bootstrap from 'bootstrap'
import Modal from 'bootstrap/js/dist/modal'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { v4 as uuidv4 } from 'uuid';
import {CreateElementWithid, CreateElementWithClasses, CreateElement} from "./ts/Utils/HtmlUtils";
import {BeginNode, CreateNodeAndView, DialogNode, PersonNode, SetOptions} from "./ts/Nodes/GameNode";
import {jsPlumb} from "jsplumb";
import {SetJsplumb} from "./ts/Utils/JsplumbUtils";
import {GameNode} from "./ts/Nodes/GameNodeItf";
let settings = ["person","event","dialog","attribute"]

export let game_node_map = new Map<string, any>();
export const jsPlumbInstance = jsPlumb.getInstance()
jsPlumbInstance.setContainer("nodes_shower")
let all_container = document.getElementById("all_container")!;
let settings_home:HTMLElement = document.getElementById("settings_home")!;
let options_home= document.getElementById("options_home")!
let nodes_shower= document.getElementById("nodes_shower")!

function AddNewNodeDiv(node:GameNode, left:number, top:number)
{
    game_node_map.set(node.id, node)
    let this_node = CreateNodeAndView(node, nodes_shower)
    SetOptions(node,options_home)
    this_node.style.left = left+"px"
    this_node.style.top = top+"px"
    console.log("@@@@@@@@"+node.id)
    SetJsplumb(jsPlumbInstance, node.id)
}

function InitBegin() {
    let new_node = new BeginNode("Begin","Game Begin")
    console.log(new_node.getId())
    AddNewNodeDiv(new_node,
        nodes_shower.offsetWidth / 1.7,
        60)
}

function init() {
    InitBegin()
    for (const name of settings) {
        var setting = CreateElementWithid("div",name, name, settings_home)
        setting.classList.add("setting_button");
        $("#"+name).draggable({
            helper:"clone",
            scope:"setting",
            start: function(event, ui) {
                // 设置克隆元素的样式
                ui.helper.css({
                    'opacity': '1',
                    'z-Index': 1000  // 确保克隆元素在最上层显示
                });
            }
        });

    }
    $("#nodes_shower").droppable({
        scope:"setting",
        drop:function(event,ui){
            let name = ui.draggable[0].id;
            const uuid = uuidv4()
            let offset = $(this).offset()!;
            let xPos = ui.offset.left// - offset.left;
            let yPos = ui.offset.top// - offset.top;
            switch(name){
                case "person":
                    //let new_node = new Person(uuid, "");            let per = new Person("1","", "2",12,"难")
                    let person = new PersonNode(uuid,"this is test node", "刘晓明",12,"直升飞机")
                    AddNewNodeDiv(person, xPos, yPos)
                    break;
                case "event":
                    break;
                case "dialog":
                    let dialog = new DialogNode(uuid,"this is dialog", )
                    AddNewNodeDiv(dialog, xPos, yPos)
                    break;
                default:
                    break;
            }
        }
    })

}
function main_fun() {
    init()
}

main_fun()
let rowCount = 0;

function addRow(containerId: string, data = { inputValue: '', textareaValue: '' }) {
    const container = document.getElementById(containerId) as HTMLElement;
    const rows = container.querySelectorAll('.row-item');
    const newIndex = rows.length + 1;

    const newRow = document.createElement('div');
    newRow.className = 'row-item d-flex mb-2';
    newRow.dataset.index = newIndex.toString();

    const serialNumber = document.createElement('div');
    serialNumber.className = 'col-1 serial-number';
    serialNumber.textContent = `序号 ${newIndex}: `;
    newRow.appendChild(serialNumber);

    const outputBox = document.createElement('input');
    outputBox.type = 'text';
    outputBox.className = 'form-control col-2';
    outputBox.value = data.inputValue;
    newRow.appendChild(outputBox);

    const textArea = document.createElement('textarea');
    textArea.className = 'form-control col';
    textArea.value = data.textareaValue;
    newRow.appendChild(textArea);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger col-1';
    deleteBtn.textContent = '删除';
    deleteBtn.addEventListener('click', () => {
        newRow.remove();
        updateSerialNumbers(containerId);
    });
    newRow.appendChild(deleteBtn);

    const dragHandle = document.createElement('div');
    dragHandle.className = 'drag-handle col-1';
    dragHandle.textContent = '≡';
    newRow.appendChild(dragHandle);

    container.appendChild(newRow);

    $(`#${containerId}`).sortable({
        handle: '.drag-handle',
        axis: 'y',
        stop: () => updateSerialNumbers(containerId)
    }).disableSelection();
}

function updateSerialNumbers(containerId: string) {
    const rows = document.querySelectorAll(`#${containerId} .row-item`);
    rows.forEach((row, index) => {
        (row.querySelector('.serial-number') as HTMLElement).textContent = `序号 ${index + 1}: `;
        (row as HTMLDivElement).dataset.index = (index + 1).toString();
    });
}

function exportData() {
    const rows = document.querySelectorAll('#rowsContainer .row-item');
    const data = Array.from(rows).map((row, index) => {
        const input = (row.querySelector('input') as HTMLInputElement).value;
        const textarea = (row.querySelector('textarea') as HTMLTextAreaElement).value;
        return `序号 ${index + 1}: ${input}, ${textarea}`;
    });
    (document.getElementById('exportArea') as HTMLTextAreaElement).value = data.join(' | ');
}

function restoreData() {
    const container = document.getElementById('rowsContainer') as HTMLElement;
    container.innerHTML = '';

    const data = (document.getElementById('exportArea') as HTMLTextAreaElement).value.split(' | ');
    data.forEach(rowData => {
        const matches = rowData.match(/序号 \d+: (.*), (.*)/);
        if (matches) {
            addRow('rowsContainer', { inputValue: matches[1], textareaValue: matches[2] });
        }
    });
    updateSerialNumbers('rowsContainer');
}

function openEditModal() {
    const container = document.getElementById('modalRowsContainer') as HTMLElement;
    container.innerHTML = '';

    const data = (document.getElementById('exportArea') as HTMLTextAreaElement).value.split(' | ');
    data.forEach(rowData => {
        const matches = rowData.match(/序号 \d+: (.*), (.*)/);
        if (matches) {
            addRow('modalRowsContainer', { inputValue: matches[1], textareaValue: matches[2] });
        }
    });
    updateSerialNumbers('modalRowsContainer');
    const editModalElement = document.getElementById('editModal');
    if (editModalElement) {
        const editModal = new Modal(editModalElement);
        editModal.show();
    }
}

function saveData() {
    const modalRows = document.querySelectorAll('#modalRowsContainer .row-item');
    let hasEmptyFields = false;

    modalRows.forEach(row => {
        const input = (row.querySelector('input') as HTMLInputElement).value.trim();
        const textarea = (row.querySelector('textarea') as HTMLTextAreaElement).value.trim();
        if (!input || !textarea) {
            hasEmptyFields = true;
        }
    });

    if (hasEmptyFields) {
        alert('所有字段都是必填的，请填写完整再保存。');
        return;
    }

    const container = document.getElementById('rowsContainer') as HTMLElement;
    container.innerHTML = '';

    modalRows.forEach(row => {
        const input = (row.querySelector('input') as HTMLInputElement).value;
        const textarea = (row.querySelector('textarea') as HTMLTextAreaElement).value;
        addRow('rowsContainer', { inputValue: input, textareaValue: textarea });
    });

    updateSerialNumbers('rowsContainer');
    exportData();
    const editModalElement = document.getElementById('editModal');
    if (editModalElement) {
        const editModal = Modal.getInstance(editModalElement);
        editModal?.hide();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (bootstrap == undefined) {
        console.log("sadsadasssssssssssss@@@@@@@@@@@@@@@sssssssssssssssssssssss@@@@@")
    }
    if (Modal == undefined) {
        console.log("sadsadasssssssssssss@@@@@@@@@@@@@@@@@@@@")
    }
    document.getElementById('addRowBtn')?.addEventListener('click', () => addRow('modalRowsContainer'));
    document.getElementById('editBtn')?.addEventListener('click', openEditModal);
    document.getElementById('saveBtn')?.addEventListener('click', saveData);
    restoreData();
});