extends BaseNode

class_name DialogNode
class dialog :
	var spkr = ""
	var convs = []
	func _init(new_spkr: String = "", new_convs: Array[String] = []) -> void:
		spkr = new_spkr
		convs = new_convs

var dialogs: Array[dialog] = []

func _init(desc_in, id_in, chd_in, par_in, new_dialogs: Array[dialog] = []) -> void:
	super._init(desc_in, id_in, "dialog", chd_in, par_in)
	dialogs = new_dialogs
# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

