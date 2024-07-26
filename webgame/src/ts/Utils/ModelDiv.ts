import $ from "jquery";

let rowCount = 0;

export function addRow(containerId: string, data = { inputValue: '', textareaValue: '' }) {
    const container = document.getElementById(containerId) as HTMLElement;
    const rows = container.querySelectorAll('.row-item');
    const newIndex = rows.length + 1;

    const newRow = document.createElement('div');
    newRow.className = 'row-item';
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

export function openEditModal() {
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
    $('#editModal').modal('show');
}

export function saveData() {
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
    $('#editModal').modal('hide');
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addRowBtn')?.addEventListener('click', () => addRow('modalRowsContainer'));
    document.getElementById('editBtn')?.addEventListener('click', openEditModal);
    document.getElementById('saveBtn')?.addEventListener('click', saveData);
    restoreData();
});
document.getElementById('addRowBtn')?.addEventListener('click', () => addRow('modalRowsContainer'));
document.getElementById('editBtn')?.addEventListener('click', openEditModal);
document.getElementById('saveBtn')?.addEventListener('click', saveData);
document.addEventListener('DOMContentLoaded', restoreData);
