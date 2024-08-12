extends Node2D

var cur_spker = 0
var cur_line = 0
# Called when the node enters the scene tree for the first time.
func _ready():
	GameLoader.init()
	procNode(GameLoader.AllNodes.get("Begin"))
	$Bag.pressed.connect(_on_open_bag_pressed)
	$Equipment.pressed.connect(_on_open_equipment_pressed)

# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func procNode(node:BaseNode):
	if node.type == "begin":
		procNode(GameLoader.AllNodes[node.chdNoIds[0]])
	if node.type == "person":
		for oneNpc in node.NPCs:
			GameLoader.AllNPCs[oneNpc.npc_name]=oneNpc
		procNode(GameLoader.AllNodes[node.chdNoIds[0]])
	if node.type == "dialog":
		cur_line = 0
		cur_spker = 0
		var button = Button.new()
		print(node.id)
		button.size = Vector2(200, 40)  # 设置按钮的大小
		add_child(button)
		button.pressed.connect(_on_main_button_pressed.bind(node, button))
		button.emit_signal("pressed")
	if node.type == "package":
		for item in node.items:
			GameLoader.Package[item.name] = item
		procNode(GameLoader.AllNodes[node.chdNoIds[0]])
	
	if  node.type == "event":
		if node.condition.type == "存在":
			if node.condition.condition1.split("|")[0] == "部位":
				pass

func _on_main_button_pressed(node:BaseNode, button):
	var covs = node.dialogs
	if cur_spker < covs.size():
		if cur_line < covs[cur_spker].convs.size():
			button.text = covs[cur_spker].spkr +" says:" + covs[cur_spker].convs[cur_line]
			cur_line += 1
			if cur_line == covs[cur_spker].convs.size():
				cur_spker += 1
				cur_line = 0
	else:
		button.hide()
		if node.chdNoIds.size() != 0:
			if GameLoader.AllNodes.get(node.chdNoIds[0]).type == "dialog":
				var xuanxiang:Array[String] = []
				var idsArray:Array[String] = []
				for ids in node.chdNoIds:
					idsArray.append(ids)
					xuanxiang.append(GameLoader.AllNodes.get(ids).desc)
				add_option_button(idsArray,xuanxiang)
			else:
				procNode(GameLoader.AllNodes.get(node.chdNoIds[0]))

func add_option_button(idsArray:Array[String], button_texts:Array[String]):
	# 确保数组中不超过四个元素
	var count = min(button_texts.size(), 4)
	var buttons = []
	for i in range(count):
		var button = Button.new()
		buttons.append(button)
		button.text = button_texts[i]
		button.size = Vector2(200, 40)  # 设置按钮的大小
		add_child(button)
		# 设置按钮位置
		button.set_position(Vector2(0, (count - 1 - i) * 50))
		button.pressed.connect(_on_option_button_pressed.bind(idsArray[i], buttons))

func _on_option_button_pressed(id: String, buttons):
	#button.hide()
	#$Button.show()
	for button in buttons:
		button.queue_free()
	procNode(GameLoader.AllNodes.get(id))

# 保存背包面板的引用
var grid_container: GridContainer = null
const ROWS = 4
const COLUMNS = 5
var inventory = []

var name_png = {
	"未知的玉片":"res://玉简.png",
	"虎豹拳法":"res://book.png",
	"云先生的信":"res://玉简.png"
	}
# 打开背包的函数
func _on_open_bag_pressed():
	if not grid_container:
		# 创建一个GridContainer作为背包的容器
		grid_container = GridContainer.new()
		grid_container.columns = COLUMNS
		grid_container.set_position(Vector2(60,60))
		# 设置父容器不接受鼠标事件
		grid_container.mouse_filter = Control.MOUSE_FILTER_IGNORE
		add_child(grid_container)
		for i in range(ROWS * COLUMNS):
			var item_slot = TextureButton.new()
			item_slot.name = "empty"
			# 你可以在这里设置每个槽位的图标或背景图片
			var icon_texture = preload("res://empty.png")
			item_slot.texture_normal = icon_texture
			grid_container.add_child(item_slot)
			inventory.append(item_slot)
		var i = 0
		for item in GameLoader.Package:
			inventory[i].name = item
			var icon_texture = ResourceLoader.load(name_png[item])
			if icon_texture:
		# 创建一个 Sprite 并设置纹理
				var sprite = Sprite2D.new()
				sprite.texture = icon_texture
				inventory[i].texture_normal = icon_texture
			else:
				print("Failed to load the texture.")
			inventory[i].custom_minimum_size = Vector2(20, 20)  # 设置最小尺寸
			inventory[i].pressed.connect(_on_item_slot_pressed.bind(i))
			i += 1

	else:
		# 如果背包已经打开，则关闭背包
		grid_container.queue_free()
		grid_container = null
		inventory.clear()
# 当物品槽被点击时执行
func _on_item_slot_pressed(slot_index):
	var item = inventory[slot_index]
	if item != null:
		show_item_details(slot_index)

# 显示物品详情
func show_item_details(slot_index):
	if inventory[slot_index].name != "empty":
		var item = GameLoader.Package[inventory[slot_index].name]
	# 在这里创建一个弹窗显示物品信息
		var popup = Popup.new()
		add_child(popup)
		popup.popup_centered()
		
		var label = Label.new()
		label.set_position(Vector2(0,0))
		label.text = "名称: %s\n简介: %s" % [item.name, item.desc]
		popup.add_child(label)
		
		var remove_button = Button.new()
		remove_button.set_position(Vector2(0,60))
		remove_button.text = "丢弃"
		remove_button.pressed.connect(_on_remove_item_pressed.bind(slot_index))
		popup.add_child(remove_button)
		
		var remove_button1 = Button.new()
		remove_button1.text = "装备"
		remove_button1.set_position(Vector2(0,90))
		remove_button1.pressed.connect(_on_remove_item_pressed.bind(slot_index))
		popup.add_child(remove_button1)
		
		var remove_button2 = Button.new()
		remove_button2.text = "阅读"
		remove_button2.set_position(Vector2(0,120))
		remove_button2.pressed.connect(_on_remove_item_pressed.bind(slot_index))
		popup.add_child(remove_button2)

# 移除物品
func _on_remove_item_pressed(slot_index):
	inventory[slot_index] = null
	# 你可以在这里更新UI以显示该槽位为空
	var item_slot = get_node(str(slot_index))
	item_slot.add_icon_override("icon", preload("res://icon.svg"))
	
func _on_open_equipment_pressed():
	var equipment = load("res://equipment.tscn")
	var equipment_ins = equipment.instantiate()
	add_child(equipment_ins)
