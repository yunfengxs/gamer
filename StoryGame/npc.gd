extends BaseNode

class_name NPCNode
class NPC :
	var npc_name = ""
	var age = 0
	var race  = ""
	var gender = ""
	var level = 0
	var state = ""
	func _init(new_npc_name: String = "", new_age: int = 0, new_race: String = "", new_gender: String = "", new_level: int = 0, new_state: String = "") -> void:
		npc_name = new_npc_name
		age = new_age
		race = new_race
		gender = new_gender
		level = new_level
		state = new_state
		print("NPC created: ", npc_name, ", Age: ", age, ", Race: ", race, ", Gender: ", gender, ", Level: ", level, ", State: ", state)
var NPCs:Array[NPC] = []


func _init(desc_in, id_in, chd_in, par_in, new_npcs: Array[NPC] = []) -> void:
	super._init(desc_in, id_in, "person", chd_in, par_in)
	NPCs = new_npcs

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

