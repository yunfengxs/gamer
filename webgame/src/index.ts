// 引入 jQuery 和 jQuery UI
import $ from 'jquery'
import './css/style.css'
import 'jquery-ui-dist/jquery-ui'; // 注意这里引入的路径可能需要根据实际情况调整
import 'bootstrap/dist/css/bootstrap.css'
import { v4 as uuidv4 } from 'uuid';
import {CreateElementWithid, CreateElementWithClasses, CreateElement} from "./ts/Utils/HtmlUtils";
import {Begin, CreateNodeAndView, GameNode, Person, SetOptions} from "./ts/Nodes/GameNode";
import {jsPlumb} from "jsplumb";
import {SetJsplumb} from "./ts/Utils/JsplumbUtils";
let settings = ["person","event","dialog","attribute"]

export let game_node_map = new Map<string, any>();
export const jsPlumbInstance = jsPlumb.getInstance()
jsPlumbInstance.setContainer("nodes_shower")
let settings_home:HTMLElement = document.getElementById("settings_home")!;
let options_home= document.getElementById("options_home")!
let nodes_shower= document.getElementById("nodes_shower")!


function  AddNewNodeDiv(node:GameNode, left:number, top:number)
{
    game_node_map.set(node.id,node)
    let this_node = CreateNodeAndView(node, nodes_shower)
    SetOptions(node,options_home)
    this_node.style.left = left+"px"
    this_node.style.top = top+"px"
    SetJsplumb(jsPlumbInstance, node.id)
}

function InitBegin() {
    const uuid = uuidv4()
    let new_node = new Begin(uuid,"this is test node")
    AddNewNodeDiv(new_node,0,0)
}

function init() {

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
                    let new_node = new Person(uuid,"this is test node", "刘晓明",12,"直升飞机")
                    AddNewNodeDiv(new_node, xPos, yPos)
                    break;
                case "event":
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