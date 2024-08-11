extends BaseNode

class_name EventNode
class Condition:
	var type = ""
	var condition1 = ""
	var condition2 = ""
	func _init(new_type: String = "", new_condition1: String = "", new_condition2: String = ""):
		type = new_type
		condition1 = new_condition1
		condition2 = new_condition2

var condition = Condition.new("","","")

func _init(desc_in, id_in, chd_in, par_in,new_condition) -> void:
	super._init(desc_in, id_in, "event", chd_in, par_in)
	condition = new_condition
# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass
