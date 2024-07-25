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
        console.log(uuid_jsplumb)
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