// 引入 jQuery 和 jQuery UI
import $ from 'jquery'
import './css/style.css'
import 'jquery-ui-dist/jquery-ui'; // 注意这里引入的路径可能需要根据实际情况调整
import 'bootstrap/dist/css/bootstrap.css'
import { v4 as uuidv4 } from 'uuid';
import {CreateElementWithid, CreateElementWithClasses, CreateElement} from "./ts/Utils/HtmlUtils";
import {CreateNodeAndView, Person, SetOptions} from "./ts/Nodes/GameNode";
import {jsPlumb} from "jsplumb";
let settings = ["person","event","dialog","attribute"]

export let game_node_map = new Map<string, any>();
export const jsPlumbInstance = jsPlumb.getInstance()
jsPlumbInstance.setContainer("nodes_shower")

function init() {
    let settings_home:HTMLElement = document.getElementById("settings_home")!;
    for (const name of settings) {
        var setting = CreateElementWithid("div",name, name, settings_home)
        $("#"+name).draggable({
            helper:"clone",
            scope:"setting"
        });
        setting.classList.add("setting_button");
    }
    $("#nodes_shower").droppable({
        scope:"setting",
        drop:function(event,ui){
            var name = ui.draggable[0].id;
            const uuid = uuidv4()
            let options_home= document.getElementById("options_home")!
            let nodes_shower= document.getElementById("nodes_shower")!
            switch(name){
                case "person":
                    //let new_node = new Person(uuid, "");            let per = new Person("1","", "2",12,"难")
                    let new_node = new Person(uuid,"this is test node", "刘晓明",12,"直升飞机")
                    game_node_map.set(uuid,new_node)
                    CreateNodeAndView(jsPlumbInstance,  new_node, nodes_shower)
                    SetOptions(new_node,options_home)
                    break;
                case "event":
                    break;
                default:
                    break;
            }



            console.log(name)
        }
    })

}
function main_fun() {
    init()
}

main_fun()