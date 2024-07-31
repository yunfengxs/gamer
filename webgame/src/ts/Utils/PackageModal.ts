import '../../css/modal_package.css'
import {CreateElement, CreateElementWithClasses} from "./HtmlUtils";
import {Item} from "../Nodes/Items";
import {game_node_map} from "../../index";
import {DialogNode, PackageNode} from "../Nodes/GameNode";
// Get modal elements
const PackageModal = document.getElementById("PackageModal")!;
const PackageInputContainer = document.getElementById("PackageInputContainer")!;
// const closeBtn = document.querySelector(".close")!;
const PackageAddRowBtn = document.getElementById("PackageAddRowBtn")!;
const PackageModalSaveBtn = document.getElementById("PackageModalSaveBtn")!;
let contextShower = document.getElementById('options_shower') as HTMLElement;
function createRow(item:Item) {
    const row = document.createElement("div");
    row.classList.add("row-pkg");

    const fields = [
        { label: "id:", type: "text", size1:"3%", size2: "12%" ,value: item.id},
        { label: "种类:", type: "select", options: ["功法","装备","法宝","丹药","材料","宝物","阵法","旁门"] , size1:"5%", size2: "10%",value: item.type },
        { label: "名称:", type: "text", size1:"5%", size2: "10%",value: item.name },
        { label: "描述:", type: "text", size1:"5%", size2: "45%", value: item.desc },
    ];

    fields.forEach(field => {
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
        } else {
            const input = CreateElement("input", "", tmpDiv) as HTMLInputElement
            input.type = field.type;
            input.value = field.value;
            input.style.width="100%"
        }
    });
    const deleteBtn = CreateElementWithClasses("button","X",row,["button-pkg", "button-delete-pkg"])
    deleteBtn.style.width="5%"
    deleteBtn.onclick = () => row.remove();
    return row;
}
function PackageModalInit(id:string) {
    PackageAddRowBtn.onclick = () => PackageInputContainer.appendChild(createRow(new Item("","","","")));
    // Save data
    PackageModalSaveBtn!.onclick = () => {
        const rows = Array.from(PackageInputContainer.getElementsByClassName("row-pkg"));
        let items = new Array()
        const data = rows.map(row => {
            const inputs = row.querySelectorAll("input");
            console.log(inputs.keys())
            const select = row.querySelector("select");
            items.push(new Item(inputs[0].value,select ? select.value : '',inputs[1].value,inputs[2].value))
        });
        game_node_map.get(id).target = items
        console.log(game_node_map)
        console.log("保存的数据:", data);
        PackageModal.style.display = "none";
        PackageInputContainer.innerHTML = ""
        UpdatePackageContext(id)
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
export function PackageModalRun(id:string) {
    PackageModalInit(id)
    PackageInputContainer.innerHTML = ""
    PackageModal.style.display = "block";
    window.onclick = event => {
        if (event.target === PackageModal) {
            PackageModal.style.display = "none";
        }
    }
    for(const item of game_node_map.get(id).target) {
        PackageInputContainer.appendChild(createRow(item));
    }
}

