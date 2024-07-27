import $ from 'jquery'
import Modal from "bootstrap/js/dist/modal";
import {GameDialog} from "../Nodes/GameNode";
import {game_node_map} from "../../index";
import {CreateElement, CreateElementWithClasses} from "./HtmlUtils";
import '../../css/testdiv.css'

let contextShower = document.getElementById('options_shower') as HTMLElement;

export function openEditModal(id:string) {
    const container = document.getElementById('modalRowsContainer') as HTMLElement;
    container.innerHTML = '';
    let dialogs:GameDialog[] = game_node_map.get(id).dialogs
    dialogs.forEach(rowData => {
        addRow('modalRowsContainer', { inputValue: rowData.speaker, textareaValue: rowData.conversation.toString()});
    });
    updateSerialNumbers('modalRowsContainer');
    const editModalElement = document.getElementById('editModal');
    if (editModalElement) {
        editModalElement.title = id
        const editModal = new Modal(editModalElement);
        editModal.show();
    }
}

export function saveData() {
    const editModalElement = document.getElementById('editModal')!;
    let title = editModalElement.title;
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
    exportData(title);

    if (editModalElement) {
        const editModal = Modal.getInstance(editModalElement);
        editModal?.hide();
    }
}

let rowCount = 0;

export function addRow(containerId: string, data = { inputValue: '', textareaValue: '' }) {
    const container = document.getElementById(containerId) as HTMLElement;
    const rows = container.querySelectorAll('.row-item');
    const newIndex = rows.length + 1;
    const newRow = CreateElementWithClasses("div","", container,["row","row-item","d-flex","mb-2"])
    newRow.dataset.index = newIndex.toString();
    const serialNumber = CreateElementWithClasses("div", `${newIndex}`, newRow,["col-1", "serial-number"])
    serialNumber.textContent = `${newIndex}`;
    const in_div = CreateElementWithClasses("div","", newRow,["col-2"])
    const outputBox:HTMLInputElement = CreateElementWithClasses("input","", in_div, ["form-control", "col-2"]) as HTMLInputElement;
    outputBox.type = 'text';
    outputBox.value = data.inputValue;
    const text_div = CreateElementWithClasses("div","", newRow,["col-7"])
    const textArea:HTMLTextAreaElement = CreateElementWithClasses("textarea","", text_div, ["form-control"]) as HTMLTextAreaElement;
    textArea.value = data.textareaValue;
    const deleteBtn:HTMLButtonElement = CreateElementWithClasses("button","删除", newRow, ["btn", "btn-danger", "col-1"]) as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => {
        newRow.remove();
        updateSerialNumbers(containerId);
    });
    const dragHandle = CreateElementWithClasses("div","≡", newRow,["drag-handle", "btn", "col-1"])
    $(`#${containerId}`).sortable({
        handle: '.drag-handle',
        axis: 'y',
        stop: () => updateSerialNumbers(containerId)
    }).disableSelection();
}

function updateSerialNumbers(containerId: string) {
    const rows = document.querySelectorAll(`#${containerId} .row-item`);
    rows.forEach((row, index) => {
        (row.querySelector('.serial-number') as HTMLElement).textContent = `${index + 1}`;
        (row as HTMLDivElement).dataset.index = (index + 1).toString();
    });
}
function UpdateDialogContext(id:string) {
    contextShower.innerHTML = ""
    for (const dialogOne of game_node_map.get(id).getDialog()){
        let oneline = CreateElement("div","", contextShower)!
        CreateElement("text",dialogOne.speaker, oneline)
        CreateElementWithClasses("text",dialogOne.conversation, oneline,["option_show"])
    }
}
function exportData(id:string) {
    const rows = document.querySelectorAll('#rowsContainer .row-item');
    let tmpDialogs: GameDialog[] = Array();
    const data = Array.from(rows).map((row, index) => {
        const input = (row.querySelector('input') as HTMLInputElement).value;
        console.log(input)
        const textarea = (row.querySelector('textarea') as HTMLTextAreaElement).value.split('\n');
        return new GameDialog(input,textarea);
    });
    console.log(data)
    game_node_map.get(id).setDialog(data)
    UpdateDialogContext(id)
}

export function restoreData() {
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