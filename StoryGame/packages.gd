extends BaseNode

class_name PackageNode
class Item:
	var name = ""
	var id = ""
	var desc = ""
	var type = ""
	func _init(name: String = "", id: String = "", desc: String = "", type: String = ""):
		self.name = name
		self.id = id
		self.desc = desc
		self.type = type
var items: Array[Item] = []

func _init(desc_in, id_in, chd_in, par_in, new_items: Array[Item] = []) -> void:
	super._init(desc_in, id_in, "package", chd_in, par_in)
	items = new_items
# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
