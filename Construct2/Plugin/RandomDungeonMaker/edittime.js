function GetPluginSettings() {
    return {
        "name": "Random Dungeon Maker",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
        "id": "random_dungeon_maker",				// this is used to identify this plugin and is saved to the project; never change it
        "version": "1.2.2",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
        "description": "Addon that allow you make random labyrinths",
        "author": "Medina_Team",
        "help url": "",
        "category": "Own-Maded",				// Prefer to re-use existing categories, but you can set anything here
        "type": "object",				// either "world" (appears in layout and is drawn), else "object"
        "rotatable": false,					// only used when "type" is "world".  Enables an angle property on the object.
        "flags": 0						// uncomment lines to enable flags...
        | pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
    };
};

// Conditions //////////////////////////////////////////////////////
AddCondition(0, cf_trigger, "Dungeon Maked", "Dungeon Maker", "The dungeon is created", "The dungeon is created", "onDungeonCreated");

// Actions //////////////////////////////////////////////////////
AddNumberParam("Width", "Set the dungeon width","10");
AddNumberParam("Height", "Set the dungeon height","10");
AddNumberParam("Blocks", "Set the dungeon blocks (this length can be auto readjusted if this parameter is too long)","60");
AddAction(0, af_none, "Create dungeon", "Creation", "Create a dungeon with the basic parameters (Width: {0}, Height: {1}, Blocks: {2})", "Create a dungeon with the basic parameters", "CreateDungeonSimple");

AddNumberParam("Width", "Set the dungeon width","10");
AddNumberParam("Height", "Set the dungeon height","10");
AddNumberParam("Blocks", "Set the dungeon total blocks (this length can be auto readjusted if this parameter is too long)","60");
AddNumberParam("MinRoom", "Set the dungeon minimum room size","2");
AddNumberParam("MaxRoom", "Set the dungeon maximum room size","5");
AddComboParamOption("YES");
AddComboParamOption("NO");
AddComboParamOption("RANDOM");
AddComboParam("LabyrinthInn", "Walls around the cells for a labyrinth design");
AddAction(1, af_none, "Create Dungeon (Extra)", "Creation", "Create a dungeon with the basic parameters and room size configuration. (Width: {0}, Height: {1}, Blocks: {2}, MinRoom: {3}, MaxRoom: {4}, LabyrinthInn: {5})", "Create a dungeon with the basic parameters and room size configuration.", "CreateDungeonExtra");

AddStringParam("JSON", "Set the JSON to load");
AddAction(2, af_none, "Load Dungeon", "Creation", "Create a dungeon using a string with JSON format({0})", "Load a dungeon with JSON", "LoadDungeonJSON");

AddAction(3, af_none, "Set next block", "Management", "Set the dungeon block current cursor (horizontally)", "Set the dungeon block current cursor (horizontally)", "SetCurrentBlockNext");

AddNumberParam("Id", "The room ID");
AddAction(4, af_none, "Set current room", "Management", "Set the current room using his ID ({0})", "Set the current room using his ID  (and reset the room´s current block)", "SetCurrentRoom");

AddAction(5, af_none, "Set next room block", "Management", "Set the Current cursor in the current Room (horizontally)", "Set the current cursor in the current Room (horizontally)", "SetCurrentRoomBlockNext");

AddAction(6, af_none, "Reset next block", "Management", "Reset the current cursor", "Reset the Current cursor (pos 0,0)", "SetCurrentBlockReset");

AddStringParam("Name", "Name Tag");
AddNumberParam("Total", "Total elements spawned (this length can be auto readjusted if this parameter is too long)","10");
AddNumberParam("OcuppedTolerance", "Can spawn in blocks ocupped for other elements (Recommended 0,1 or 2)","0");
AddComboParamOption("NO");
AddComboParamOption("YES");
AddComboParam("NotIndoor", "Can´t spawn next to a door ('YES' activate this option)");
AddComboParamOption("NO");
AddComboParamOption("YES");
AddComboParamOption("NONE");
AddComboParam("ObligatoryBottomWall", "Only spawn in cells who has Bottom Wall");
AddComboParamOption("NO");
AddComboParamOption("YES");
AddComboParamOption("NONE");
AddComboParam("ObligatoryTopWall", "Only spawn in cells who has Top Wall");
AddComboParamOption("NO");
AddComboParamOption("YES");
AddComboParamOption("NONE");
AddComboParam("ObligatoryLeftWall", "Only spawn in cells who has Left Wall");
AddComboParamOption("NO");
AddComboParamOption("YES");
AddComboParamOption("NONE");
AddComboParam("ObligatoryRightWall", "Only spawn in cells who has Right Wall");
AddNumberParam("Priority", "Element priority", "1");
AddAction(7, af_none, "New dungeon element", "Elements (Management)", "New dungeon element (Name Tag: {0}, Total: {1}, OcuppedTolerance: {2}, NotIndoor: {3}, ObligatoryBottomWall: {4}, ObligatoryTopWall: {5}, ObligatoryLeftWall: {6}, ObligatoryRightWall: {7}, Priority: {8})", "New dungeon element", "NewDungeonElement");

AddAction(8, af_none, "Reset dungeon elements", "Elements (Management)", "Reset dungeon elements list", "Reset dungeon elements", "ResetDungeonElements");

AddNumberParam("ElementId", "Set the Element ID");
AddAction(9, af_none, "Remove dungeon element", "Elements (Management)", "Remove dungeon element ({0})" , "Remove dungeon individual element (still exists but has a deleted tag status for element querys)", "RemoveDungeonElement");

AddNumberParam("Width", "Set the dungeon width","10");
AddNumberParam("Height", "Set the dungeon height","10");
AddNumberParam("Blocks", "Set the dungeon total blocks (this length can be auto readjusted if this parameter is too long)","60");
AddNumberParam("MinRoom", "Set the dungeon minimum room size","2");
AddNumberParam("MaxRoom", "Set the dungeon maximum room size","5");
AddComboParamOption("LABYRINTH");
AddComboParamOption("CASTLE");
AddComboParamOption("TOWER");
AddComboParamOption("RANDOM");
AddComboParam("Mode", "Dungeon Shape Mode");
AddComboParamOption("CENTER");
AddComboParamOption("LEFT");
AddComboParamOption("RIGHT");
AddComboParamOption("RANDOM");
AddComboParam("StartX", "Start Point X");
AddComboParamOption("CENTER");
AddComboParamOption("TOP");
AddComboParamOption("BOTTOM");
AddComboParamOption("RANDOM");
AddComboParam("StartY", "Start Point Y");
AddComboParamOption("YES");
AddComboParamOption("NO");
AddComboParamOption("RANDOM");
AddComboParam("LabyrinthInn", "Walls around the cells for a labyrinth design");
AddComboParamOption("NO");
AddComboParamOption("YES");
AddComboParamOption("RANDOM");
AddComboParam("OpenWorld", "Post-creation process that removes most walls for a open world sensation");
AddAction(10, af_none, "Create Dungeon (Advanced)", "Creation",
					   "Create a dungeon with the advanced configuration. (Width: {0}, Height: {1}, Blocks: {2}, MinRoom: {3}, MaxRoom: {4}, Mode: {5}, StartX: {6}, StartY: {7}, LabyrinthInn: {8}, OpenWorld: {9})", 
					   "Create a dungeon with the advanced configuration.", "CreateDungeonAdvanced");

AddAction(11, af_none, "Clear Dungeon", "Management", "Erase all dungeon data (blocks, elements, config, etc)", "Erase all dungeon data ", "ClearDungeon");

AddAction(12, af_none, "Revive all elements", "Elements (revive)", "Put active again all elements", "Put active all dungeon elements", "ReviveDungeonElementsAll");

AddNumberParam("Priority", "Element priority to revive", "1");
AddAction(13, af_none, "Revive elements by priority", "Elements (revive)", "Put active again elements with specific priority ({0})", "Put active again dungeon elements with specific priority", "ReviveDungeonElementsByPriority");

AddNumberParam("NameTag", "Name Tag to revive");
AddAction(14, af_none, "Revive elements by name tag", "Elements (revive)", "Put active again elements with specific Name Tag ({0})", "Put active again dungeon elements with specific Name Tag", "ReviveDungeonElementsByNameTag");

AddNumberParam("ElementId", "Element Id to revive");
AddAction(15, af_none, "Revive elements by id", "Elements (revive)", "Put active again dungeon with specific Element Id ({0})", "Put active again dungeon elements with specific Element Id", "ReviveDungeonElementsByElementId");

AddNumberParam("ElementId", "Element Id");
AddStringParam("Name", "Variable name");
AddStringParam("Value", "Variable value");
AddAction(16, af_none, "add aditional value to element", "Elements (Management)", "Add element aditional value (Id: {0}, Name: {1}, Value: {2})", "Add an aditional value to an element", "AddDungeonValueElement");

// Expressions //////////////////////////////////////////////////////

/*Dungeon Data*/
AddExpression(0, ef_return_number, "Dungeon width", "Dungeon Data", "DungeonWidth", "Return dungeon width");
AddExpression(1, ef_return_number, "Dungeon height", "Dungeon Data", "DungeonHeight", "Return dungeon height");
AddExpression(2, ef_return_number, "Dungeon blocks", "Dungeon Data", "DungeonBlocks", "Return dungeon total blocks");
AddExpression(3, ef_return_string, "Dungeon JSON", "Dungeon Data", "DungeonDataJSON", "Get dungeon data by a JSON");

/*Current Block Data*/
AddExpression(4, ef_return_number, "Current block ID", "Current Block Data", "BlockCurrentID", "Return current block ID");
AddExpression(5, ef_return_number, "Current block position X", "Current Block Data", "BlockCurrentX", "Return current block position X");
AddExpression(6, ef_return_number, "Current block position Y", "Current Block Data", "BlockCurrentY", "Return current block position Y");
AddExpression(7, ef_return_number, "Current block room", "Current Block Data", "BlockCurrentRoom", "Return current block room Id");

/*Block Data*/
AddNumberParam("X", "The block X position");
AddNumberParam("Y", "The block Y position");
AddExpression(8, ef_return_number, "Block ID", "Block Data", "BlockID", "Return block ID");
AddNumberParam("Id", "The block ID");
AddExpression(9, ef_return_number, "Block position X", "Block Data", "BlockX", "Return block position X");
AddNumberParam("Id", "The block ID");
AddExpression(10, ef_return_number, "Block position Y ", "Block Data", "BlockY", "Return block position Y");
AddNumberParam("Id", "The block ID");
AddExpression(11, ef_return_number, "Block room", "Block Data", "BlockRoom", "Return block room ID");
AddNumberParam("Id", "The block ID");
AddExpression(12, ef_return_string, "Block information", "Block Data", "BlockInfo", "Return block position and room in a string 'X,Y,Room'");

/*Block Wall*/
AddNumberParam("Id", "The block ID");
AddExpression(13, ef_return_string, "Block wall top", "Block Wall", "WallTop", "Return block wall top type (ROOM, BORDER, NONE)");
AddNumberParam("Id", "The block ID");
AddExpression(14, ef_return_string, "Block wall left", "Block Wall", "WallLeft", "Return block wall left type (ROOM, BORDER, NONE)");
AddNumberParam("Id", "The block ID");
AddExpression(15, ef_return_string, "Block wall right", "Block Wall", "WallRight", "Return block wall right type (ROOM, BORDER, NONE)");
AddNumberParam("Id", "The block ID");
AddExpression(16, ef_return_string, "Block wall bottom", "Block Wall", "WallBottom", "Return block wall bottom type (ROOM, BORDER, NONE)");

/*Support Platform*/
AddNumberParam("Id", "The block ID");
AddExpression(17, ef_return_string, "Platform top", "Support Platform", "PlatformTop", "Return block top platform type (LEFT,CENTER,RIGHT)");
AddNumberParam("Id", "The block ID");
AddExpression(18, ef_return_string, "Platform center", "Support Platform", "PlatformCenter", "Return block center platform type (LEFT,CENTER,RIGHT)");
AddNumberParam("Id", "The block ID");
AddExpression(19, ef_return_string, "Platform bottom", "Support Platform", "PlatformBottom", "Return block bottom platform type (LEFT,CENTER,RIGHT)");

/*Room Connect*/
AddNumberParam("Id", "The block ID");
AddExpression(20, ef_return_number, "Room connect top", "Room Connect", "RoomConnectTop", "Show the adjacent block ID (top) if both blocks found in different rooms");
AddNumberParam("Id", "The block ID");
AddExpression(21, ef_return_number, "Room connect left", "Room Connect", "RoomConnectLeft", "Show the adjacent block ID (left) if both blocks found in different rooms");
AddNumberParam("Id", "The block ID");
AddExpression(22, ef_return_number, "Room connect right", "Room Connect", "RoomConnectRight", "Show the adjacent block ID (right) if both blocks found in different rooms");
AddNumberParam("Id", "The block ID");
AddExpression(23, ef_return_number, "Room connect bottom", "Room Connect", "RoomConnectBottom", "Show the adjacent block ID (bottom) if both blocks found in different rooms");

/*Room Data*/
AddExpression(24, ef_return_number, "Current room ID", "Room Data", "RoomCurrentID", "Return current room ID");
AddNumberParam("Id", "The room ID");
AddExpression(25, ef_return_number, "Room width", "Room Data", "RoomWidth", "Return room width");
AddNumberParam("Id", "The room ID");
AddExpression(26, ef_return_number, "Room height", "Room Data", "RoomHeight", "Return room height");
AddExpression(27, ef_return_number, "Current block position X (Room)", "Room Current Block", "RoomBlockCurrentX", "Current room block, position X");
AddExpression(28, ef_return_number, "Current block position Y (Room)", "Room Current Block", "RoomBlockCurrentY", "Current room block, position Y");
AddNumberParam("X", "The block X room position");
AddNumberParam("Y", "The block Y room position");
AddExpression(29, ef_return_number, "Block ID (using room coordinates)", "Room Data", "RoomBlockID", "Return current room block ID using room coordinates");

/*Block Elements*/
AddNumberParam("Id", "The block ID");
AddExpression(30, ef_return_string, "Block Elements NameTag", "Block Elements", "BlockElementsNameTag", "Return block elements NameTag");
AddNumberParam("Id", "The block ID");
AddExpression(31, ef_return_string, "Block Elements (EID)", "Block Elements", "BlockElementsEID", "Return block elements (Dungeon Element ID)");

/*Adjacent Block*/
AddNumberParam("Id", "The block ID");
AddExpression(32, ef_return_number, "Adjacent Block top", "Block Data Adjacent", "AdjacentBlockTop", "Show the adjacent block ID (top) of the selected block");
AddNumberParam("Id", "The block ID");
AddExpression(33, ef_return_number, "Adjacent Block left", "Block Data Adjacent", "AdjacentBlockLeft", "Show the adjacent block ID (left) of the selected block");
AddNumberParam("Id", "The block ID");
AddExpression(34, ef_return_number, "Adjacent Block right", "Block Data Adjacent", "AdjacentBlockRight", "Show the adjacent block ID (right) of the selected block");
AddNumberParam("Id", "The block ID");
AddExpression(35, ef_return_number, "Adjacent Block bottom", "Block Data Adjacent", "AdjacentBlockBottom", "Show the adjacent block ID (bottom) of the selected block");

/*Dungeon Data*/
AddExpression(35, ef_return_number, "Already exists", "Dungeon Data", "AlreadyExists", "Check if a dungeon is already created (0 = NO, 1 = YES)");

/*Block Elements*/
AddNumberParam("ElementId", "Element");
AddStringParam("Name", "Variable name");
AddExpression(35, ef_return_string, "Get element aditional value", "Block Elements", "GetDungeonValueElement", "Get element aditional value");

ACESDone();

/*CONSTRUCT CODE*/

var property_list = [];

function CreateIDEObjectType() {return new IDEObjectType();}
function IDEObjectType() {assert2(this instanceof arguments.callee, "Constructor called as a function");}
IDEObjectType.prototype.CreateInstance = function (instance) {return new IDEInstance(instance);}

function IDEInstance(instance, type) {
    assert2(this instanceof arguments.callee, "Constructor called as a function");

    this.instance = instance;
    this.type = type;

    this.properties = {};

    for (var i = 0; i < property_list.length; i++)
        this.properties[property_list[i].name] = property_list[i].initial_value;
}

IDEInstance.prototype.OnInserted = function () {}
IDEInstance.prototype.OnDoubleClicked = function () {}
IDEInstance.prototype.OnPropertyChanged = function (property_name) {}
IDEInstance.prototype.OnRendererInit = function (renderer) {}
IDEInstance.prototype.Draw = function (renderer) {}
IDEInstance.prototype.OnRendererReleased = function (renderer) {}