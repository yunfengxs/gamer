import {game_node_map, game_node_map_loaded} from "../../index";
import {GameNode} from "../Nodes/GameNodeItf";
import {DeleteNodeView} from "./HtmlUtils";

export function SetJsplumb(jsplumbInstance:any, uuid_jsplumb:string) {
    /* global jsPlumb */
    // @ts-ignore
    jsplumbInstance.ready(function(){
        var btm = {
            isSource: true,
            isTarget: false,
            connector: ['Straight'],
            maxConnections: -1,
        }
        var top = {
            isSource: false,
            isTarget: true,
            connector: ['Straight'],
            maxConnections: -1,
        }
        jsplumbInstance.draggable(uuid_jsplumb)
        jsplumbInstance.addEndpoint(uuid_jsplumb, {
            anchors: ['Bottom'],
            uuid : "btm"+uuid_jsplumb,
            overlays: [ ['Arrow', { width: 5, length: 5, location: 0.5 }] ]
        },btm)
        jsplumbInstance.addEndpoint(uuid_jsplumb, {
            anchors: ['Top'],
            uuid : "top"+uuid_jsplumb,
            overlays: [ ['Arrow', { width: 5, length: 5, location: 0.5 }] ]
        },top)
    });
}

export function InitJsPlumb(jsplumbInstance:any) {
    /* global jsPlumb */
    // @ts-ignore
    jsPlumb.ready(function() {
        jsplumbInstance.bind('connection', function (info:any) {
            if (!game_node_map.get(info.targetId)!.getParentNodeIds()!.includes(info.sourceId)) {
                game_node_map.get(info.targetId)!.getParentNodeIds()!.push(info.sourceId)
            }
            if (!game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.includes(info.targetId)) {
                game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.push(info.targetId)
            }
        })

        jsplumbInstance.bind('beforeDrop', function (info:any) {
            if (!game_node_map.get(info.targetId)!.getParentNodeIds()!.includes(info.sourceId)) {
                game_node_map.get(info.targetId)!.getParentNodeIds()!.push(info.sourceId)
            }
            if (!game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.includes(info.targetId)) {
                game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.push(info.targetId)
            }
            let index1 = game_node_map.get(info.targetId)!.getParentNodeIds()!.indexOf(info.sourceId)
            let index2 = game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.indexOf(info.targetId)
            if(CheckCircle(game_node_map)){
                alert("注意产生了环！")
                jsplumbInstance.deleteConnection()
                game_node_map.get(info.targetId)!.getParentNodeIds()!.splice(index1, 1)
                game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.splice(index2, 1)
                return false
            }
            game_node_map.get(info.targetId)!.getParentNodeIds()!.splice(index1, 1)
            game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.splice(index2, 1)
            if (info.targetId != info.sourceId && !game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.includes(info.targetId)) {
                return true
            } else {
                return false
            }
        })

        jsplumbInstance.bind('connectionDetached', function (info:any) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@")
            let index1 = game_node_map.get(info.targetId)!.getParentNodeIds()!.indexOf(info.sourceId)
            let index2 = game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.indexOf(info.targetId)
            game_node_map.get(info.targetId)!.getParentNodeIds()!.splice(index1, 1)
            game_node_map.get(info.sourceId)!.getChildrenNodeIds()!.splice(index2, 1)
        })
    });
}
/*
检查是否有环路产生
 */
function CheckCircle(nodes: Map<string,GameNode>): boolean {
    const visited: Set<string> = new Set(); // 记录已经访问过的节点
    const inStack: Set<string> = new Set(); // 记录当前搜索路径上的节点
    function dfs(nodeId: string): boolean {
        visited.add(nodeId);
        inStack.add(nodeId);
        const node = nodes.get(nodeId)!
        for (const childId of node.getChildrenNodeIds()!) {
            if (!visited.has(childId)) {
                if (dfs(childId)) {
                    return true;
                }
            } else if (inStack.has(childId)) {
                // 如果该节点已经在当前搜索路径上出现过，说明存在环
                return true;
            }
        }
        inStack.delete(nodeId);
        return false;
    }
    // @ts-ignore
    for (let [key,value] of nodes) {
        if (!visited.has(key)) {
            if (dfs(key)) {
                return true;
            }
        }
    }
    return false;
}
export function SetConnectionJsplumb(jsplumbInstance:any, recs:string, tar:string) {
    /* global jsPlumb */
    // @ts-ignore
    jsplumbInstance.ready(function(){
        jsplumbInstance.connect({ uuids: ["btm"+recs, "top"+tar] })
    });
}

export function ClearJsplumb (jsplumbInstance:any, uuid:string) {
    /* global jsPlumb */
    // @ts-ignore
    jsPlumb.ready(function(){
        console.log(uuid)
        jsplumbInstance.remove(uuid)
    });
}

export function DeleteJsplumbNode (jsplumbInstance:any, uuid:string) {
    /* global jsPlumb */
    // @ts-ignore
    jsPlumb.ready(function(){
        let connections = jsplumbInstance.getAllConnections();
        for (let i = 0; i < connections.length; i++) {
            let connection = connections[i];
            if (connection.sourceId === uuid || connection.targetId === uuid) {
                jsplumbInstance.deleteConnection(connection);
            }
        }
        // 获取节点的所有端点，并删除
        var endpoints = jsplumbInstance.getEndpoints(uuid);
        for (var j = 0; j < endpoints.length; j++) {
            // 删除端点
            jsplumbInstance.deleteEndpoint(endpoints[j]);
        }
        DeleteNodeView(uuid)
        game_node_map.delete(uuid)
    });

}