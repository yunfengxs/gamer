import $ from 'jquery'
import Modal from "bootstrap/js/dist/modal";
import {DialogNode, GameDialog} from "../Nodes/GameNode";
import {game_node_map} from "../../index";
import {CreateElement, CreateElementWithClasses} from "./HtmlUtils";
import '../../css/modal_dialog.css'

let contextShower = document.getElementById('options_shower') as HTMLElement;

export function DialogModalRun(id:string) {
    const container = document.getElementById('DialogModalRowsContainer') as HTMLElement;
    container.innerHTML = '';
    let dialogs:GameDialog[] = (game_node_map.get(id) as DialogNode).dialogs
    dialogs.forEach(rowData => {
        addRow('DialogModalRowsContainer', { inputValue: rowData.spker, textareaValue: rowData.convs.join('\n')});
    });
    updateSerialNumbers('DialogModalRowsContainer');
    const DialogModalElement = document.getElementById('DialogModal');
    if (DialogModalElement) {
        DialogModalElement.title = id
        const DialogModal = new Modal(DialogModalElement);
        DialogModal.show();
    }
}

export function saveData() {
    const DialogModalElement = document.getElementById('DialogModal')!;
    let title = DialogModalElement.title;
    const modalRows = document.querySelectorAll('#DialogModalRowsContainer .row-item');
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
    if (DialogModalElement) {
        const DialogModal = Modal.getInstance(DialogModalElement);
        DialogModal?.hide();
    }
}
export function addRow(containerId: string, data = { inputValue: '', textareaValue: '' }) {
    const container = document.getElementById(containerId) as HTMLElement;
    const rows = container.querySelectorAll('.row-item');
    const newIndex = rows.length + 1;
    const newRow = CreateElementWithClasses("div","", container,["row","row-item","d-flex","mb-2"])
    newRow.dataset.index = newIndex.toString();
    const serialNumber = CreateElementWithClasses("div", `${newIndex}`, newRow,["serial-number", "bb"])
    serialNumber.textContent = `${newIndex}`;
    const in_div = CreateElementWithClasses("div","", newRow,["cc"])
    const outputBox:HTMLInputElement = CreateElementWithClasses("input","", in_div, ["form-control"]) as HTMLInputElement;
    outputBox.type = 'text';
    outputBox.value = data.inputValue;
    const text_div = CreateElementWithClasses("div","", newRow,["dd"])
    const textArea:HTMLTextAreaElement = CreateElementWithClasses("textarea","", text_div, ["form-control"]) as HTMLTextAreaElement;
    textArea.value = data.textareaValue;
    const deleteBtn:HTMLButtonElement = CreateElementWithClasses("button","删除", newRow, ["btn", "btn-danger", "ee"]) as HTMLButtonElement;
    deleteBtn.addEventListener('click', () => {
        newRow.remove();
        updateSerialNumbers(containerId);
    });
    const dragHandle = CreateElementWithClasses("div","≡", newRow,["drag-handle", "btn","ff"])
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
export function UpdateDialogContext(id:string) {
    contextShower.innerHTML = ""
    for (const dialogOne of (game_node_map.get(id) as DialogNode).getDialog()){
        let oneline = CreateElementWithClasses("div","", contextShower,["row"])!
        CreateElementWithClasses("text",dialogOne.spker, oneline,["col-2"])
        CreateElementWithClasses("pre",dialogOne.convs.join('\n'), oneline,["option_show", "col-10"])
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
    (game_node_map.get(id) as DialogNode).setDialog(data)
    UpdateDialogContext(id)
}