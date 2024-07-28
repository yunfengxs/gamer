// 引入 jQuery 和 jQuery UI
import $ from 'jquery'
import './css/style.css'
import 'jquery/dist/jquery.slim'
import 'jquery-ui-dist/jquery-ui'; // 注意这里引入的路径可能需要根据实际情况调整
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { v4 as uuidv4 } from 'uuid';
import {CreateElementWithid, CreateElementWithClasses, CreateElement, SetCompPosition} from "./ts/Utils/HtmlUtils";
import {BaseNode, BeginNode, CreateNodeAndView, DialogNode, PersonNode, SetOptions} from "./ts/Nodes/GameNode";
import {jsPlumb} from "jsplumb";
import {ClearJsplumb, InitJsPlumb, SetConnectionJsplumb, SetJsplumb} from "./ts/Utils/JsplumbUtils";
//import {GameNode} from "./ts/Nodes/GameNodeItf";
import {addRow, openEditModal, saveData} from "./ts/Utils/ModalDiv";
import {GameNode} from "./ts/Nodes/GameNodeItf";
let settings = ["person","event","dialog","attribute"]
import { stringify, parse } from 'flatted';

export let game_node_map = new Map<string, any>();
export let game_node_map_loaded = new Map<string, any>();
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
    SetJsplumb(jsPlumbInstance, node.id)
}

function InitBeginNode() {
    let new_node = new BeginNode("Begin","Game Begin")
    console.log(new_node.getId())
    AddNewNodeDiv(new_node,
        nodes_shower.offsetWidth / 1.7,
        60)
}

function SaveFile(){
    let jsons = "["
    console.log(game_node_map)
    // game_node_map.forEach((value, key) => {
    //     jsons += stringify(value) + ","
    //     console.log(jsons)
    // });
    console.log("@@@@@@@@")
    console.log(stringify(game_node_map))
    const replaced = jsons.replace(/.$/, ']');
    // 创建一个a标签
    const link = document.createElement('a');
    link.download = 'out_put.json'; // 设置文件名
    link.href = URL.createObjectURL(new Blob([replaced], { type: 'text/plain' })); // 设置文件内容
    link.click(); // 模拟点击下载链接
}
function InitSettings(){
    CreateElementWithClasses("div","save",settings_home,["setting_button","save_bt"]).addEventListener("click",SaveFile)
    CreateElementWithClasses("div","load",settings_home,["setting_button","load_bt"]).addEventListener("click",LoadFromFile)
    CreateElement("hr","",settings_home)
    for (const name of settings) {
        var setting = CreateElementWithid("div",name, name, settings_home)
        setting.classList.add("setting_button");
        setting.classList.add(name)
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
    });
}
function InitNodesView() {
    InitBeginNode()
    InitSettings()
}

function InitModals() {
    document.getElementById('addRowBtn')?.addEventListener('click', () => addRow('modalRowsContainer'));
    document.getElementById('saveBtn')?.addEventListener('click', saveData);
}

document.addEventListener('DOMContentLoaded', () => {
    InitModals()
    InitNodesView()
    InitJsPlumb(jsPlumbInstance)
});


function LoadClearAll(){
    game_node_map.forEach((value, key) => {
        ClearJsplumb(jsPlumbInstance, key)
    })
    game_node_map.clear()
}


function breadthFirstTraversal(root: GameNode) {
    const queue: GameNode[] = [root];
    let nodeIdMap = new Map()
    let lastNode = ""
    let addedchile:string[] = []
    while (queue.length > 0) {
        const nodeOne:GameNode = queue.shift() as GameNode;
        console.log(nodeOne.id)
        AddNewNodeDiv(nodeOne, 0,0)
        SetCompPosition(nodeOne, lastNode , "load")
        SetJsplumb(jsPlumbInstance, nodeOne.id)
        if (nodeOne.id) {
            for (const child of nodeOne.getChildrenNodeIds()!) {
                if(addedchile.indexOf(child) == -1){
                    queue.push(game_node_map_loaded.get(child));
                    addedchile.push(child)
                }
                nodeIdMap.set(nodeOne.id, child)
            }
        }
        lastNode = nodeOne.id
    }
    nodeIdMap.forEach((value, key) => {
        SetConnectionJsplumb(jsPlumbInstance, key, value)
    })
}

function LoadFromFile() {
    // 创建一个input标签
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json'; // 限制只能选择json文件
    input.onchange = () => {
        const file = input.files![0];
        const reader = new FileReader();
        // 读取文件内容
        reader.readAsText(file);
        reader.onload = () => {
            let str = reader.result
            if (typeof str === "string") {
                let nodes: any[] = parse(str)
                console.log(nodes)
                if (nodes.length >= 0) {
                    LoadClearAll()
                    for (const nodesKey in nodes) {
                        let nodeOne :any;
                        switch(nodes[nodesKey].type){
                            case "begin":
                                nodes[nodesKey].__proto__ = BeginNode.prototype
                                nodeOne = nodes[nodesKey] as BaseNode
                                break;
                            case "person":
                                nodes[nodesKey].__proto__ = PersonNode.prototype
                                nodeOne = nodes[nodesKey] as PersonNode
                                break;
                            case "dialog":
                                nodes[nodesKey].__proto__ = DialogNode.prototype
                                nodeOne = nodes[nodesKey] as DialogNode
                                break;
                            default:
                                alert("wrong type" + nodes[nodesKey].type)
                                break;
                        }
                        game_node_map_loaded.set(nodeOne.id, nodeOne)
                    }
                    console.log(game_node_map_loaded)
                    let rootNode:GameNode = game_node_map_loaded.get("Begin")!
                    breadthFirstTraversal(rootNode)
                }
            }
        };
    };
    input.click(); // 模拟点击选择文件
}