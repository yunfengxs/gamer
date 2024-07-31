const ItemType = ["任务道具","功法","装备","法宝","丹药","材料","宝物","旁门"]
export class Item {
    name:string = ""
    id:string = ""
    desc: string = ""
    type: string = ""

    constructor( id: string, type: string , name: string, desc: string) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.desc = desc;
    }
}
class SystemItem extends Item {
    type: string = "System"
}
class BookItem extends Item {
    type: string = "Book"
}

