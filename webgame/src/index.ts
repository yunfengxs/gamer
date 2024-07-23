console.log('Hello, TypeScript!');
// 引入 jQuery 和 jQuery UI
import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui'; // 注意这里引入的路径可能需要根据实际情况调整

function onon() {

}
// 使用 jQuery UI
$(function() {
    // jQuery UI 代码写在这里
    let name = $('#node1').text()
    console.log(name)
    $('#node1').draggable(); // 示例：使元素可拖拽
    $('#node1').sortable();   // 示例：使元素可排序
});


