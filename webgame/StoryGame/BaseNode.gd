extends Node

class_name BaseNode
var desc = ""
var id = ""
var type = ""
var chdNoIds = []
var parNoIds = []

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func _init(desc_in, id_in, type_in, chd_in, par_in):
	desc = desc_in
	id = id_in
	type = type_in
	chdNoIds = chd_in
	parNoIds = par_in
	
