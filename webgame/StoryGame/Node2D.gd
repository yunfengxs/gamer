extends Node2D

@onready var vbox_container = $VBoxContainer  # 绑定到场景中的一个 VBoxContainer 节点
var cur_sentence = 0
# Called when the node enters the scene tree for the first time.
func _ready():
	GameLoader.init()
	var now = GameLoader.AllNodes.get("Begin")
	var tmpNodes:Array[BaseNode] = []
	tmpNodes.append(now)
	procNode(tmpNodes)
	


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func procNode(nodes:Array[BaseNode]):
	if nodes[0].type == "begin":
		var tmpNodes:Array[BaseNode] = []
		for chds in nodes[0].chdNoIds:
			tmpNodes.append(GameLoader.AllNodes[chds])
		procNode(tmpNodes)
	if nodes[0].type == "person":
		for oneNpc in nodes[0].NPCs:
			GameLoader.all_npcs[oneNpc.npc_name]=oneNpc
		var tmpNodes:Array[BaseNode] = []
		for chds in nodes[0].chdNoIds:
			tmpNodes.append(GameLoader.AllNodes[chds])
		procNode(tmpNodes)
	if nodes[0].type == "dialog":
		var covs = []
		if nodes.size() == 1 :
			covs = nodes[0].dialogs
		else:
			var xuanxiang = []
			var i = 0
			for dialogsNode in nodes:
				xuanxiang.append(dialogsNode.id)
				var button = Button.new()
				button.text = i+"、"+dialogsNode.dialogs[0].convs[0]
				i += 1
				button.min_size = Vector2(100, 50)
				var num:int = button.pressed.connect(_on_button_pressed.bind(button,covs, xuanxiang))
				vbox_container.add_child(button)
		print(covs)
		$Button.pressed.connect(_on_button1_pressed.bind(covs))

				
		#for oneNpc in nodes[0].NPCs:
			#GameLoader.all_npcs[oneNpc.name]=oneNpc
		#var tmpNodes:Array[BaseNode] = []
		#for chds in nodes[0].chdNoIds:
			#tmpNodes.append(GameLoader.AllNodes[chds])
			
			
func _on_button_pressed(button: Button, covs,xuanxiang) :
	print("Button pressed: " + button.text)
	covs = xuanxiang[button.text[0].to_int()].convs

func _on_button1_pressed(covs):
	if cur_sentence < covs.size():
		for one_line in covs[cur_sentence].convs:
			$Button.text = one_line
	else:
		$Button.hide()
		
	cur_sentence += 1
	
	
	
