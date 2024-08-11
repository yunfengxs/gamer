extends Node

var AllNPCs = {}
var DialogNodes = {}
var AllNodes = {}
var Package = {}
# Called when the node enters the scene tree for the first time.
func _ready():
	pass

func init():
	print("sadsadsad")
	var json_data = parse_json_file("res://game.json")
	for item in json_data:
		if item.type == "person":
			var npcs:Array[NPCNode.NPC] = []
			for person in item.people:
				var one_npc = NPCNode.NPC.new(person.name,person.age,person.race,person.gender,person.level,person.state)
				npcs.append(one_npc)
			AllNodes[item.id] = NPCNode.new(item.desc,item.id,item.chdNoIds, item.parNoIds,npcs)
		
		if item.type == "dialog":
			var dialogs:Array[DialogNode.dialog] = []
			for dialog in item.dialogs:
				var lines:Array[String] = []
				for line in dialog.convs:
					lines.append(line)
				var one_dialog = DialogNode.dialog.new(dialog.spker,lines)
				dialogs.append(one_dialog)
			AllNodes[item.id] = DialogNode.new(item.desc,item.id,item.chdNoIds, item.parNoIds,dialogs)

		if item.type == "begin":
			AllNodes[item.id] = BaseNode.new(item.desc,item.id,item.type,item.chdNoIds,item.parNoIds)

		if item.type == "package":
			var items:Array[PackageNode.Item] = []
			for item_one in item.target:
				items.append(PackageNode.Item.new(item_one.name,item_one.id,item_one.desc,item_one.type))
			AllNodes[item.id] = PackageNode.new(item.desc,item.id,item.chdNoIds,item.parNoIds,items)

		if item.type == "event":
			var event = EventNode.Condition.new(item.condition.type,item.condition.cond1,item.condition.cond2)
			AllNodes[item.id] = EventNode.new(item.desc,item.id,item.chdNoIds,item.parNoIds,event)
			

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func parse_json_file(file_path: String):
	var file = FileAccess.open(file_path, FileAccess.ModeFlags.READ)
	# 打开文件以读取
	if file:
		var json_string = file.get_as_text()
		file.close()

		# 解析 JSON 字符串
		var json = JSON.new()
		var error = json.parse(json_string)
		if error != OK:
			print("Failed to parse JSON: ", json.error_string())
			return {}
		return json.data
	else:
		print("File does not exist: ", file_path)
		return {}
