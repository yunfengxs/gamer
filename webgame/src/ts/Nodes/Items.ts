const ItemType = ["任务道具","功法","装备","法宝","丹药","材料","宝物","旁门"]
class Items {
    name:string = ""
    id:string = ""
    desc: string = ""
    type: string = ""
}
class SystemItem extends Items {
    type: string = "System"
}
class BookItem extends Items {
    type: string = "Book"
}

