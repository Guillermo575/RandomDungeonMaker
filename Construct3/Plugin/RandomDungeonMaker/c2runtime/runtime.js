assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

//var rt;
//var random_dungeon_maker;
cr.plugins_.random_dungeon_maker = function (runtime) {this.runtime = runtime;};

(function () {
	
	/*CONSTRUCT CODE*/
	
    var pluginProto = cr.plugins_.random_dungeon_maker.prototype;

    pluginProto.Type = function (plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;
    typeProto.onCreate = function () {};

    pluginProto.Instance = function (type) {
        this.type = type;
        this.runtime = type.runtime;
    };

    var instanceProto = pluginProto.Instance.prototype;

    instanceProto.onCreate = function () {
        //var self = this;
        //rt = this.runtime;
		this.CurX = 0;
		this.CurY = 0;
		this.CurRoom = 1;
		this.CurRoomX = 0;
		this.CurRoomY = 0;
		this.GameDungeon = null;
    };

    instanceProto.onDestroy = function () {};
    instanceProto.saveToJSON = function () {
		//return JSON2.stringify(this.GameDungeon);
	};
    instanceProto.loadFromJSON = function (o) {};
    instanceProto.draw = function (ctx) {};
    instanceProto.drawGL = function (glw) {};

    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function (propsections) 
	{
		//propsections.push({});
		propsections.push({
			"title": "Labyrinth",
			"properties": [
				{"name": "Map", 
				 "value": this.GameDungeon == null? "<b>NOT DUNGEON CREATED YET</b>" : GraphiqueDungeon(this.GameDungeon), 
				 "html": true, 
				 "readonly": true}
			]
		});
	};
    instanceProto.onDebugValueEdited = function (header, name, value) {};
    /**END-PREVIEWONLY**/
	
	/*FUNCIONES GLOBALES*/
			
	function getDungeonBlockPos(GameDungeon,X,Y)
	{
		if(GameDungeon.DungeonBlocks[Y] != null && GameDungeon.DungeonBlocks[Y][X] != null)
		{
			return GameDungeon.DungeonBlocks[Y][X];			
		}else
		{
			var error = emptyDungeonBlock();
			return error;
		}
	}		
	
	function getDungeonBlockPosRoom(GameDungeon,Room,X,Y)
	{
		var dungeonroom = getDungeonRoom(GameDungeon,Room);
		if(dungeonroom.Blocks[Y] != null && dungeonroom.Blocks[Y][X] != null)
		{
			return dungeonroom.Blocks[Y][X].Block;			
		}else
		{
			var error = emptyDungeonBlock();
			return error;
		}
	}
	
	function getDungeonBlock(GameDungeon,Id)
	{
		var retorno = emptyDungeonBlock();
		if(Id > 0 && GameDungeon != null)
		{
			for(var l = 0; l < GameDungeon.DungeonHeight; l++)
			{
				for(var m = 0; m < GameDungeon.DungeonWidth; m++)
				{
					if(GameDungeon.DungeonBlocks[l][m].Id == Id)
					{
						retorno = GameDungeon.DungeonBlocks[l][m];
						return retorno;
					}
				}
			}			
		}
		return retorno;
	}

	function getDungeonRoom(GameDungeon,Id)
	{
		var retorno = emptyDungeonRoom();
		if(Id > 0 && GameDungeon != null)
		{
			for(var l = 0; l < GameDungeon.DungeonRooms.length; l++)
			{
				if(GameDungeon.DungeonRooms[l].Id == Id)
				{
					retorno = GameDungeon.DungeonRooms[l];
					return retorno;
				}			
			}			
		}
		return retorno;
	}
	
	function emptyDungeonBlock()
	{
		var retorno = 
		{ 
			Id: 0,
			X: -1, Y: -1,
			RoomX: 0, RoomY: 0, Room: -1,
			WallTop: 0, WallRight: 0, WallBottom: 0, WallLeft: 0,
			RoomWallTop: 0, RoomWallRight: 0, RoomWallBottom: 0, RoomWallLeft: 0,
			ConnectTop: 0, ConnectRight: 0, ConnectBottom: 0, ConnectLeft: 0,
			Status: "ERROR",
			SupportPlatformTop: "NONE", SupportPlatformCenter: "NONE", SupportPlatformBottom: "NONE",
		};	
		return retorno;
	}

	function emptyDungeonRoom()
	{
		var retorno = 
		{ 
			Id: -1,
			index: -1,
			Blocks: [], Connections: [],
			Width: 0, Height: 0,
			Status: "ERROR",
		};	
		return retorno;
	}
	
	function DungeonBasicConfiguration(Width,Height,Blocks)
	{
		var GameDungeon = DefaultDungeonConfiguration();
		
		GameDungeon.DungeonWidth = Width;
		GameDungeon.DungeonHeight = Height;
		GameDungeon.TotalBloquesDungeon = Blocks;
		
		return GameDungeon;
	}

	function DungeonExtraConfiguration(Width,Height,Blocks,MinRoom,MaxRoom,LabyrinthDesign)
	{	
		var GameDungeon = DungeonBasicConfiguration(Width,Height,Blocks);
		
		GameDungeon.DungeonRoomsWidthMin = MinRoom;
		GameDungeon.DungeonRoomsWidthMax = MaxRoom;
		GameDungeon.DungeonRoomsHeightMin = MinRoom;
		GameDungeon.DungeonRoomsHeightMax = MaxRoom;
		GameDungeon.LabyrinthInn = LabyrinthDesign;
		
		return GameDungeon;
	}

	function DungeonAdvancedConfiguration(Width,Height,Blocks,MinRoom,MaxRoom,Mode,StartX,StartY,LabyrinthDesign,OpenWorldDesign)
	{
		var GameDungeon = DungeonExtraConfiguration(Width,Height,Blocks,MinRoom,MaxRoom,LabyrinthDesign);
		
		GameDungeon.DungeonMode = Mode;
		GameDungeon.StartPointX = StartX;
		GameDungeon.StartPointY = StartY;
		GameDungeon.OpenWorld = OpenWorldDesign;
		
		return GameDungeon;
	}	
	
	function DefaultDungeonConfiguration()
	{
		return GameDungeon = 	
		{
			DungeonBlocks: [],
			DungeonRooms: [],
			DungeonRegions: [],
			DungeonHeight: 30,
			DungeonWidth: 30,
			TotalBloquesDungeon: 600,
			DungeonRoomsWidthMin: 2,
			DungeonRoomsWidthMax: 5,
			DungeonRoomsHeightMin: 2,
			DungeonRoomsHeightMax: 5,
			DungeonRoomsSizeAmbivalence: 1,
			DungeonMode: "LABYRINTH",//"LABYRINTH","CASTLE","TOWER"
			LabyrinthInn: 1,
			OpenWorld: 0,
			SupportPlatforms: 1,
			StartPointX: 0,
			StartPointY: 0,
			Status: "NOT",
			Elements: [],
			SubBlockWidth: 4,
			SubBlockHeight: 4,
		} 
	}
	
    // Conditions
    function Cnds() {};

    Cnds.prototype.onDungeonCreated = function (){return true;};

    pluginProto.cnds = new Cnds();

    // Actions
    function Acts() {};

    Acts.prototype.CreateDungeonSimple = function (Width,Height,Blocks) 
	{
		this.CurX = 0;
		this.CurY = 0;
		this.CurRoom = 1;
		this.CurRoomX = 0;
		this.CurRoomY = 0;
		var objDungeon = DungeonBasicConfiguration(Width, Height, Blocks);
		objDungeon.Elements = (!(this.ConfigElements === undefined)) ? this.ConfigElements : [];
		this.GameDungeon = makeDungeon(objDungeon);
		this.runtime.trigger(cr.plugins_.random_dungeon_maker.prototype.cnds.onDungeonCreated, this);
    };

	Acts.prototype.CreateDungeonExtra = function (Width,Height,Blocks,MinRoom,MaxRoom,LabyrinthInn) 
	{
		this.CurX = 0;
		this.CurY = 0;
		this.CurRoom = 1;
		this.CurRoomX = 0;
		this.CurRoomY = 0;
		
		var LabyrinthInnCombo = "YES";
		switch (LabyrinthInn) {
			case 0: LabyrinthInnCombo = "YES"; break;
			case 1: LabyrinthInnCombo = "NO"; break;
			case 2: switch (Math.round(Math.random() * 1))
					{
						case 0: LabyrinthInnCombo = "YES"; break;
						case 1: LabyrinthInnCombo = "NO"; break;
					} break;
		}
		var LabInn = LabyrinthInnCombo == "NO" ? 0 : 1;
		
		var objDungeon = DungeonExtraConfiguration(Width, Height, Blocks, MinRoom, MaxRoom, LabInn);
		objDungeon.Elements = (!(this.ConfigElements === undefined)) ? this.ConfigElements : [];
		this.GameDungeon = makeDungeon(objDungeon);
		this.runtime.trigger(cr.plugins_.random_dungeon_maker.prototype.cnds.onDungeonCreated, this);
    };
	
	Acts.prototype.CreateDungeonAdvanced = function (Width,Height,Blocks,MinRoom,MaxRoom,Mode,StartX,StartY,LabyrinthInn,OpenWorld) 
	{
		this.CurX = 0;
		this.CurY = 0;
		this.CurRoom = 1;
		this.CurRoomX = 0;
		this.CurRoomY = 0;
		
		var ModeCombo = "LABYRINTH";
		switch (Mode) {
			case 0: ModeCombo = "LABYRINTH"; break;
			case 1: ModeCombo = "CASTLE"; break;
			case 2: ModeCombo = "TOWER"; break;
			case 3: switch (Math.round(Math.random() * 2))
					{
						case 0: ModeCombo = "LABYRINTH"; break;
						case 1: ModeCombo = "CASTLE"; break;
						case 2: ModeCombo = "TOWER"; break;
					} break;
		}

		var StartXCombo = "CENTER";
		switch (StartX) {
			case 0: StartXCombo = "CENTER"; break;
			case 1: StartXCombo = "LEFT"; break;
			case 2: StartXCombo = "RIGHT"; break;
			case 3: switch (Math.round(Math.random() * 2))
					{
						case 0: StartXCombo = "CENTER"; break;
						case 1: StartXCombo = "LEFT"; break;
						case 2: StartXCombo = "RIGHT"; break;
					} break;
		}		
		var PointX = 0;
		PointX = StartXCombo == "LEFT" ? -1: PointX;
		PointX = StartXCombo == "RIGHT" ? 1: PointX;

		var StartYCombo = "CENTER";
		switch (StartY) {
			case 0: StartYCombo = "CENTER"; break;
			case 1: StartYCombo = "TOP"; break;
			case 2: StartYCombo = "BOTTOM"; break;
			case 3: switch (Math.round(Math.random() * 2))
					{
						case 0: StartYCombo = "CENTER"; break;
						case 1: StartYCombo = "TOP"; break;
						case 2: StartYCombo = "BOTTOM"; break;
					} break;
		}				
		var PointY = 0;
		PointY = StartYCombo == "TOP" ? -1: PointY;
		PointY = StartYCombo == "BOTTOM" ? 1: PointY;
		
		var LabyrinthInnCombo = "YES";
		switch (LabyrinthInn) {
			case 0: LabyrinthInnCombo = "YES"; break;
			case 1: LabyrinthInnCombo = "NO"; break;
			case 2: switch (Math.round(Math.random() * 1))
					{
						case 0: LabyrinthInnCombo = "YES"; break;
						case 1: LabyrinthInnCombo = "NO"; break;
					} break;
		}
		var LabInn = LabyrinthInnCombo == "NO" ? 0 : 1;

		var OpenWorldCombo = "NO";
		switch (OpenWorld) {
			case 0: OpenWorldCombo = "NO"; break;
			case 1: OpenWorldCombo = "YES"; break;
			case 2: switch (Math.round(Math.random() * 1))
					{
						case 0: OpenWorldCombo = "NO"; break;
						case 1: OpenWorldCombo = "YES"; break;
					} break;
		}
		var OpWorld = OpenWorldCombo == "YES" ? 1 : 0;
		
		var objDungeon = DungeonAdvancedConfiguration(Width, Height, Blocks, MinRoom, MaxRoom, ModeCombo, PointX, PointY, LabInn, OpWorld);
		objDungeon.Elements = (!(this.ConfigElements === undefined)) ? this.ConfigElements : [];
		this.GameDungeon = makeDungeon(objDungeon);
		this.runtime.trigger(cr.plugins_.random_dungeon_maker.prototype.cnds.onDungeonCreated, this);
    };
	
	Acts.prototype.LoadDungeonJSON = function (JSON) 
	{
		this.CurX = 0;
		this.CurY = 0;
		this.CurRoom = 1;
		this.CurRoomX = 0;
		this.CurRoomY = 0;
		this.GameDungeon = JSON2.parse(JSON);
		this.runtime.trigger(cr.plugins_.random_dungeon_maker.prototype.cnds.onDungeonCreated, this);
    };

	Acts.prototype.ClearDungeon = function ()
	{
		this.ConfigElements = [];
		this.GameDungeon = null;
	};	
	
	Acts.prototype.SetCurrentBlockNext = function () 
	{
		try 
		{
			this.DungeonBlockCurrent = getDungeonBlockPos(this.GameDungeon,this.CurX,this.CurY);
			this.CurX++;
			if(!(this.CurX < this.GameDungeon.DungeonWidth))
			{
				this.CurX = 0;
				this.CurY++;
			}
			if(!(this.CurY < this.GameDungeon.DungeonHeight))
			{
				this.CurY = 0;
			}
		}catch(err) 
		{
			this.DungeonBlockCurrent = emptyDungeonBlock();
		}
	}

	Acts.prototype.SetCurrentRoom = function (Id)
	{
		this.CurRoom = Id;
		this.CurRoomX = 0;
		this.CurRoomY = 0;
    };
	
	Acts.prototype.SetCurrentRoomBlockNext = function () 
	{
		try 
		{
			this.DungeonBlockCurrent = this.GameDungeon.DungeonRooms[this.CurRoom - 1].Blocks[this.CurRoomY][this.CurRoomX].Block;
			this.CurRoomX++;
			if(!(this.CurRoomX < this.GameDungeon.DungeonRooms[this.CurRoom - 1].Width))
			{
				this.CurRoomX = 0;
				this.CurRoomY++;
			}
			if(!(this.CurRoomY < this.GameDungeon.DungeonRooms[this.CurRoom - 1].Height))
			{
				this.CurRoomY = 0;
			}
		}catch(err) 
		{
			this.DungeonBlockCurrent = emptyDungeonBlock();
		}
	}
	
	Acts.prototype.SetCurrentBlockReset = function () 
	{
		this.CurX = 0;
		this.CurY = 0;
	}
	
	Acts.prototype.NewDungeonElement = function (Name, Total, OcuppedTolerance, NotIndoor,
												 ObligatoryBottomWall, ObligatoryTopWall, ObligatoryLeftWall, ObligatoryRightWall, Priority)
	{
		var NotIndoorCombo = "NO";
		switch (NotIndoor) {
			case 0: NotIndoorCombo = "NO"; break;
			case 1: NotIndoorCombo = "YES"; break;
		}
		var ObligatoryBottomWallCombo = "NO";
		switch (ObligatoryBottomWall) {
			case 0: ObligatoryBottomWallCombo = "NO"; break;
			case 1: ObligatoryBottomWallCombo = "YES"; break;
			case 2: ObligatoryBottomWallCombo = "NONE"; break;
		}	
		var ObligatoryTopWallCombo = "NO";
		switch (ObligatoryTopWall) {
			case 0: ObligatoryTopWallCombo = "NO"; break;
			case 1: ObligatoryTopWallCombo = "YES"; break;
			case 2: ObligatoryTopWallCombo = "NONE"; break;
		}
		var ObligatoryLeftWallCombo = "NO";
		switch (ObligatoryLeftWall) {
			case 0: ObligatoryLeftWallCombo = "NO"; break;
			case 1: ObligatoryLeftWallCombo = "YES"; break;
			case 2: ObligatoryLeftWallCombo = "NONE"; break;
		}
		var ObligatoryRightWallCombo = "NO";
		switch (ObligatoryRightWall) {
			case 0: ObligatoryRightWallCombo = "NO"; break;
			case 1: ObligatoryRightWallCombo = "YES"; break;
			case 2: ObligatoryRightWallCombo = "NONE"; break;
		}		
		var objnuevo = 
		{
			NameTag: Name,
			Total: Total,
			OcuppedTolerance: OcuppedTolerance,	
			NotIndoor: (NotIndoorCombo == "YES") ? 1 : 0,
			ObligatoryBottomWall: ObligatoryBottomWallCombo,
			ObligatoryTopWall: ObligatoryTopWallCombo,
			ObligatoryLeftWall: ObligatoryLeftWallCombo,
			ObligatoryRightWall: ObligatoryRightWallCombo,
			Objetos: [],
			Width: 1,
			Height: 1,
			Priority: Priority === undefined ? 1 : Priority,
		};
		if(this.ConfigElements === undefined)
		{
			this.ConfigElements = [];
		}
		this.ConfigElements[this.ConfigElements.length] = objnuevo;
    };

	Acts.prototype.ResetDungeonElements = function ()
	{
		this.ConfigElements = [];
    };

	Acts.prototype.RemoveDungeonElement = function (ElementId)
	{
		if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
		{
			for(var x = 0; x < this.GameDungeon.Elements.length; x++)
			{
				var itemElement = this.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					if(itemElement.Objetos[l].ElementId == ElementId)
					{
						itemElement.Objetos[l].Status = 0;
						return true;
					}
				}
			}
		}
    };
	
	Acts.prototype.ReviveDungeonElementsAll = function ()
	{
		if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
		{
			for(var x = 0; x < this.GameDungeon.Elements.length; x++)
			{
				var itemElement = this.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					itemElement.Objetos[l].Status = 1;
				}
			}
		}
	};

	Acts.prototype.ReviveDungeonElementsByPriority = function (Priority)
	{
		if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
		{
			for(var x = 0; x < this.GameDungeon.Elements.length; x++)
			{
				var itemElement = this.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					if(itemElement.Objetos[l].Priority == Priority)
					{
						itemElement.Objetos[l].Status = 1;
					}
				}
			}
		}
	};

	Acts.prototype.ReviveDungeonElementsByNameTag = function (NameTag)
	{
		if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
		{
			for(var x = 0; x < this.GameDungeon.Elements.length; x++)
			{
				var itemElement = this.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					if(itemElement.Objetos[l].NameTag == NameTag)
					{
						itemElement.Objetos[l].Status = 1;
					}
				}
			}
		}
	};

	Acts.prototype.ReviveDungeonElementsByElementId = function (ElementId)
	{
		if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
		{
			for(var x = 0; x < this.GameDungeon.Elements.length; x++)
			{
				var itemElement = this.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					if(itemElement.Objetos[l].ElementId == ElementId)
					{
						itemElement.Objetos[l].Status = 1;
						return true;
					}
				}
			}
		}
	};

	Acts.prototype.AddDungeonValueElement = function (ElementId, Name, Value)
	{
		if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
		{
			for(var x = 0; x < this.GameDungeon.Elements.length; x++)
			{
				var itemElement = this.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					if(itemElement.Objetos[l].ElementId == ElementId)
					{
						itemElement.Objetos[l].Data[Name] = Value;
						return true;
					}
				}
			}
		}
	};
	
    pluginProto.acts = new Acts();

	// Expressions
    function Exps(){};

	/*Dungeon Data*/
    Exps.prototype.DungeonWidth = 
		function (ret){ ret.set_int(this.GameDungeon.DungeonWidth); };
	Exps.prototype.DungeonHeight = 
		function (ret){ ret.set_int(this.GameDungeon.DungeonHeight); };
	Exps.prototype.DungeonBlocks = 
		function (ret){ ret.set_int(this.GameDungeon.TotalBloquesDungeon); };
	Exps.prototype.DungeonDataJSON = 
		function (ret){ ret.set_string(JSON2.stringify(this.GameDungeon)); };
	Exps.prototype.AlreadyExists = 
		function (ret){ ret.set_int(this.GameDungeon == null ? 0 : 1); };
		
	/*Current Block Data*/
	Exps.prototype.BlockCurrentID = 
		function (ret) { ret.set_int(this.DungeonBlockCurrent.Id); };
	Exps.prototype.BlockCurrentX = 
		function (ret) { ret.set_int(this.DungeonBlockCurrent.X); };
	Exps.prototype.BlockCurrentY = 
		function (ret) { ret.set_int(this.DungeonBlockCurrent.Y); };	
	Exps.prototype.BlockCurrentRoom = 
		function (ret) { ret.set_int(this.DungeonBlockCurrent.Room); };	
	
	/*Block Data*/
	Exps.prototype.BlockID = 
		function (ret,X,Y) { ret.set_int(getDungeonBlockPos(this.GameDungeon,X,Y).Id); };
	Exps.prototype.BlockX = 
		function (ret,Id) { ret.set_int(getDungeonBlock(this.GameDungeon,Id).X); };
	Exps.prototype.BlockY = 
		function (ret,Id) { ret.set_int(getDungeonBlock(this.GameDungeon,Id).Y); };	
	Exps.prototype.BlockRoom = 
		function (ret,Id) { ret.set_int(getDungeonBlock(this.GameDungeon,Id).Room); };	
	Exps.prototype.BlockInfo = 
		function (ret,Id)
		{ 
			var Block = getDungeonBlock(this.GameDungeon,Id);
			ret.set_string(Block.X + "," + Block.Y + "," + Block.Room); 
		};
		
	/*Block Wall*/	
	Exps.prototype.WallTop = 
		function (ret,Id)
		{ 
			var TypeWall = "NONE";
			var Block = getDungeonBlock(this.GameDungeon,Id);
			TypeWall = (Block.WallTop > 0)? "BORDER" : ((Block.RoomWallTop > 0)? "ROOM" : TypeWall);
			ret.set_string(TypeWall); 
		};
	Exps.prototype.WallLeft = 
		function (ret,Id)
		{
			var TypeWall = "NONE";
			var Block = getDungeonBlock(this.GameDungeon,Id);
			TypeWall = (Block.WallLeft > 0)? "BORDER" : ((Block.RoomWallLeft > 0)? "ROOM" : TypeWall);
			ret.set_string(TypeWall); 
		};
	Exps.prototype.WallRight = 
		function (ret,Id)
		{
			var TypeWall = "NONE";
			var Block = getDungeonBlock(this.GameDungeon,Id);
			TypeWall = (Block.WallRight > 0)? "BORDER" : ((Block.RoomWallRight > 0)? "ROOM" : TypeWall);
			ret.set_string(TypeWall); 	
		};
	Exps.prototype.WallBottom = 
		function (ret,Id)
		{
			var TypeWall = "NONE";
			var Block = getDungeonBlock(this.GameDungeon,Id);
			TypeWall = (Block.WallBottom > 0) ? "BORDER" : ((Block.RoomWallBottom > 0) ? "ROOM" : TypeWall);
			ret.set_string(TypeWall); 	
		};	
	
	/*Support Platform*/
	Exps.prototype.PlatformTop = 
		function (ret,Id)
		{ 
			var Block = getDungeonBlock(this.GameDungeon,Id);
			ret.set_string(Block.SupportPlatformTop); 
		};
	Exps.prototype.PlatformCenter = 
		function (ret,Id)
		{ 
			var Block = getDungeonBlock(this.GameDungeon,Id);
			ret.set_string(Block.SupportPlatformCenter); 
		};
	Exps.prototype.PlatformBottom = 
		function (ret,Id)
		{ 
			var Block = getDungeonBlock(this.GameDungeon,Id);
			ret.set_string(Block.SupportPlatformBottom); 
		};
	
	/*Room Connect*/
	Exps.prototype.RoomConnectTop = 
		function (ret,Id)
		{ 
			var retorno = getDungeonBlock(this.GameDungeon,Id).ConnectTop;
			ret.set_int(retorno == 0? 0: retorno.Id); 
		};
	Exps.prototype.RoomConnectLeft = 
		function (ret,Id)
		{ 
			var retorno = getDungeonBlock(this.GameDungeon,Id).ConnectLeft;
			ret.set_int(retorno == 0? 0: retorno.Id); 
		};
	Exps.prototype.RoomConnectRight = 
		function (ret,Id)
		{ 
			var retorno = getDungeonBlock(this.GameDungeon,Id).ConnectRight;
			ret.set_int(retorno == 0? 0: retorno.Id); 
		};
	Exps.prototype.RoomConnectBottom = 
		function (ret,Id)
		{ 
			var retorno = getDungeonBlock(this.GameDungeon,Id).ConnectBottom;
			ret.set_int(retorno == 0? 0: retorno.Id); 
		};
		
	/*Room Data*/
	Exps.prototype.RoomCurrentID = 
		function (ret){ ret.set_int(this.CurRoom); };	
	Exps.prototype.RoomWidth = 
		function (ret,Id){ ret.set_int(getDungeonRoom(this.GameDungeon,Id).Width); };	
	Exps.prototype.RoomHeight = 
		function (ret,Id){ ret.set_int(getDungeonRoom(this.GameDungeon,Id).Height); };	
	Exps.prototype.RoomBlockCurrentX = 
		function (ret) { ret.set_int(this.DungeonBlockCurrent.RoomX); };
	Exps.prototype.RoomBlockCurrentY = 
		function (ret) { ret.set_int(this.DungeonBlockCurrent.RoomY); };
	Exps.prototype.RoomBlockID = 
		function (ret,X,Y) { ret.set_int(getDungeonBlockPosRoom(this.GameDungeon,this.CurRoom,X,Y).Id); };	
	
	/*Block Elements*/
	Exps.prototype.BlockElementsNameTag = 
		function (ret,Id) 
		{
			var Block = getDungeonBlock(this.GameDungeon,Id);
			var retorno = [];
			for(var x = 0; x < Block.Elements.length; x++)
			{
				if(Block.Elements[x].Status == 1)
					retorno[x] = Block.Elements[x].NameTag;
			}
			ret.set_string(retorno.join()); 
		};
	Exps.prototype.BlockElementsEID = 
		function (ret,Id) 
		{
			var Block = getDungeonBlock(this.GameDungeon,Id);
			var retorno = [];
			for(var x = 0; x < Block.Elements.length; x++)
			{
				if(Block.Elements[x].Status == 1)
					retorno[x] = Block.Elements[x].ElementId;
			}
			ret.set_string(retorno.join()); 
		};
	Exps.prototype.GetDungeonValueElement =
		function (ret, ElementId, Name)
		{
			if(!(this.ConfigElements === undefined) && !(this.GameDungeon == null))
			{
				for(var x = 0; x < this.GameDungeon.Elements.length; x++)
				{
					var itemElement = this.GameDungeon.Elements[x];
					for(var l = 0; l < itemElement.Objetos.length; l++)
					{
						if(itemElement.Objetos[l].ElementId == ElementId)
						{
							if(itemElement.Objetos[l].Data[Name] == null)
								ret.set_string("");
							else
								ret.set_string(itemElement.Objetos[l].Data[Name]);
						}
					}
				}
			}
		};
	
	/*Room Connect*/
	Exps.prototype.AdjacentBlockTop = 
		function (ret,Id)
		{ 
			var adjacentBlock = emptyDungeonBlock();
			var Block = getDungeonBlock(this.GameDungeon,Id);
			if((Block.Y - 1) >= 0)
			{
				adjacentBlock = this.GameDungeon.DungeonBlocks[Block.Y - 1][Block.X];
			}
			ret.set_int(adjacentBlock.Id);
		};
	Exps.prototype.AdjacentBlockLeft = 
		function (ret,Id)
		{ 
			var adjacentBlock = emptyDungeonBlock();
			var Block = getDungeonBlock(this.GameDungeon,Id);
			if((Block.X - 1) >= 0)
			{
				adjacentBlock = this.GameDungeon.DungeonBlocks[Block.Y][Block.X - 1];
			}
			ret.set_int(adjacentBlock.Id);
		};
	Exps.prototype.AdjacentBlockRight = 
		function (ret,Id)
		{ 
			var adjacentBlock = emptyDungeonBlock();
			var Block = getDungeonBlock(this.GameDungeon,Id);
			if((Block.X + 1) < this.GameDungeon.DungeonWidth)
			{
				adjacentBlock = this.GameDungeon.DungeonBlocks[Block.Y][Block.X + 1];
			}
			ret.set_int(adjacentBlock.Id);
		};
	Exps.prototype.AdjacentBlockBottom = 
		function (ret,Id)
		{ 
			var adjacentBlock = emptyDungeonBlock();
			var Block = getDungeonBlock(this.GameDungeon,Id);
			if((Block.Y + 1) < this.GameDungeon.DungeonHeight)
			{
				adjacentBlock = this.GameDungeon.DungeonBlocks[Block.Y + 1][Block.X];
			}
			ret.set_int(adjacentBlock.Id);
		};	
	
    pluginProto.exps = new Exps();

}());
function makeDungeon(GameDungeon)
{	
	GameDungeon.TotalBloquesDungeon = (GameDungeon.DungeonWidth*GameDungeon.DungeonHeight)<= GameDungeon.TotalBloquesDungeon ? (GameDungeon.DungeonWidth*GameDungeon.DungeonHeight) : GameDungeon.TotalBloquesDungeon;
	for(var l = 0; l < GameDungeon.DungeonHeight; l++)
	{
		GameDungeon.DungeonBlocks[l] = [];
		for(var m = 0; m < GameDungeon.DungeonWidth; m++)
		{
			GameDungeon.DungeonBlocks[l][m] = 
											{ 
												Id: 0,
												X: m, Y: l,
												RoomX: m, RoomY: l,
												Room: 0,
												WallTop: 0, WallRight: 0, WallBottom: 0, WallLeft: 0,
												RoomWallTop: 0, RoomWallRight: 0, RoomWallBottom: 0, RoomWallLeft: 0,
												ConnectTop: 0, ConnectRight: 0, ConnectBottom: 0, ConnectLeft: 0,
												Status:"OK",
												SupportPlatformTop: "NONE", SupportPlatformCenter: "NONE", SupportPlatformBottom: "NONE",
												Elements:[],
												SubBlockWidth: 4,
												SubBlockHeight: 4,
											};
		}
	}
	GameDungeon = MakeDungeonShape(GameDungeon);    
	GameDungeon = MakeDungeonRoomShape(GameDungeon);
	GameDungeon = MakeDungeonRoomConnections(GameDungeon);  
	GameDungeon = (GameDungeon.LabyrinthInn == 1) ? MakeDungeonRoomInner(GameDungeon) : GameDungeon;
	GameDungeon = (GameDungeon.SupportPlatforms == 1) ? MakeDungeonSupportPlatform(GameDungeon) : GameDungeon;
	GameDungeon = (GameDungeon.OpenWorld == 1) ? ConfigureOpenWorld(GameDungeon) : GameDungeon;	
	GameDungeon = (!(GameDungeon.Elements === undefined)) ? DistributeDungeonElements(GameDungeon) : GameDungeon;
	GameDungeon.Status = "LOADED";
	return GameDungeon;
}

function MakeDungeonShape(GameDungeon)
{
	var CuadrosDisponibles = [];
	var DungeonArray = GameDungeon.DungeonBlocks;
	
	var StartX = Math.floor(GameDungeon.DungeonWidth/2);	
	var StartY = Math.floor(GameDungeon.DungeonHeight/2);
	StartX = (GameDungeon.StartPointX < 0) ? 0 : StartX; 
	StartX = (GameDungeon.StartPointX > 0) ? (GameDungeon.DungeonWidth - 1) : StartX;
	StartY = (GameDungeon.StartPointY < 0) ? 0 : StartY; 
	StartY = (GameDungeon.StartPointY > 0) ? (GameDungeon.DungeonHeight - 1) : StartY;
	
	CuadrosDisponibles[CuadrosDisponibles.length] = ([StartY, StartX]);	
	for(var l = 1; l <= GameDungeon.TotalBloquesDungeon; l++)
	{
		var comprobado = 0;
		while(comprobado == 0)
		{
			var randomNumber =  Math.floor((Math.random() * CuadrosDisponibles.length));
			if(GameDungeon.DungeonMode == "CASTLE" || GameDungeon.DungeonMode == "TOWER")
			{
				randomNumber = Math.floor((Math.random() * 3)) != 1 ? (CuadrosDisponibles.length - 1): randomNumber;
			}	
			var CuadroSeleccionado = CuadrosDisponibles[randomNumber];
			var CuadroSeleccionadoY = CuadroSeleccionado[0];			
			var CuadroSeleccionadoX = CuadroSeleccionado[1];
			if(DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX].Id == 0)
			{
				DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX].Id = l;
				comprobado = 1;						
			}
			CuadrosDisponibles.splice(randomNumber,1);	
		}
		switch(GameDungeon.DungeonMode)
		{
			case "TOWER":
				if((CuadroSeleccionadoX - 1) >= 0 && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX - 1].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY, CuadroSeleccionadoX - 1]);
				}
				if((CuadroSeleccionadoX + 1) < GameDungeon.DungeonWidth && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX + 1].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY, CuadroSeleccionadoX + 1]);
				}
				if((CuadroSeleccionadoY - 1) >= 0 && DungeonArray[CuadroSeleccionadoY - 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY - 1, CuadroSeleccionadoX]);
				}
				if((CuadroSeleccionadoY + 1) < GameDungeon.DungeonHeight && DungeonArray[CuadroSeleccionadoY + 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY + 1, CuadroSeleccionadoX]);
				}
			break;
			default:
				if((CuadroSeleccionadoY - 1) >= 0 && DungeonArray[CuadroSeleccionadoY - 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY - 1, CuadroSeleccionadoX]);
				}
				if((CuadroSeleccionadoY + 1) < GameDungeon.DungeonHeight && DungeonArray[CuadroSeleccionadoY + 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY + 1, CuadroSeleccionadoX]);
				}
				if((CuadroSeleccionadoX - 1) >= 0 && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX - 1].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY, CuadroSeleccionadoX - 1]);
				}
				if((CuadroSeleccionadoX + 1) < GameDungeon.DungeonWidth && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX + 1].Id == 0)
				{
					CuadrosDisponibles.push([CuadroSeleccionadoY, CuadroSeleccionadoX + 1]);
				}
			break;
		}
	}
	for(var l = 0; l < GameDungeon.DungeonHeight; l++)
	{
		for(var m = 0; m < GameDungeon.DungeonWidth; m++)
		{	
			if(DungeonArray[l][m].Id > 0)
			{		
				DungeonArray[l][m].WallTop = ((l - 1) < 0 )? 1 : (DungeonArray[l - 1][m].Id == 0)? 1 : 0;
				DungeonArray[l][m].WallBottom = ((l + 1) >= GameDungeon.DungeonHeight )? 1 : (DungeonArray[l + 1][m].Id == 0)? 1 : 0;
				DungeonArray[l][m].WallLeft = ((m - 1) < 0 )? 1 : (DungeonArray[l][m - 1].Id == 0)? 1 : 0;
				DungeonArray[l][m].WallRight = ((m + 1) >= GameDungeon.DungeonWidth )? 1 : (DungeonArray[l][m + 1].Id == 0)? 1 : 0;
			}else
			{
				DungeonArray[l][m].Status = "VOID";	
			}
		}
	}
	return GameDungeon;
}

function MakeDungeonRoomShape(GameDungeon)
{
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	var DungeonWidth = GameDungeon.DungeonWidth;
    var DungeonHeight = GameDungeon.DungeonHeight;
	
	for(var l = 0; l < DungeonHeight; l++)
	{
		for(var m = 0; m < DungeonWidth; m++)
		{
			if(DungeonArray[l][m].Id > 0)
			{
				DungeonArray[l][m].Status = "NOT";
			}
		}
	}

	for(var y = 0; y < DungeonHeight; y++)
	{
		for(var x = 0; x < DungeonWidth; x++)
		{
			if(DungeonArray[y][x].Status == "NOT")
			{
				var randomWidth =  Math.floor((Math.random() * ((GameDungeon.DungeonRoomsWidthMax + 1) - GameDungeon.DungeonRoomsWidthMin)) + GameDungeon.DungeonRoomsWidthMin);
				var randomHeight =  Math.floor((Math.random() * ((GameDungeon.DungeonRoomsHeightMax + 1) - GameDungeon.DungeonRoomsHeightMin)) + GameDungeon.DungeonRoomsHeightMin);
				randomHeight = GameDungeon.DungeonRoomsSizeAmbivalence == 1 ? randomWidth : randomHeight;
				var encontradoX = x;
				var encontradoY = y;
				var l = 0;
				var m = 0;
				var EspacioDisponible = true;
				var retroceso = 0;
				var newRoom = 
					{
						Id:DungeonRooms.length + 1,
						index: DungeonRooms.length,
						Blocks: [],
						Connections: [],
						Width: randomWidth,
						Height: randomHeight,
						Status: "OK",
					};	
				for(var yl = 0; yl < randomHeight; yl++)
				{
					newRoom.Blocks[yl] = [];
					for(var xm = 0; xm < randomWidth; xm++)
					{
						newRoom.Blocks[yl][xm] = 
									{
										Block:
										{ 
											Id: 0,
											X: xm, Y: yl,
											RoomX: xm, RoomY: yl,
											Room: 0,
											WallTop: 0, WallRight: 0, WallBottom: 0, WallLeft: 0,
											RoomWallTop: 0, RoomWallRight: 0, RoomWallBottom: 0, RoomWallLeft: 0,
											ConnectTop: 0, ConnectRight: 0, ConnectBottom: 0, ConnectLeft: 0,
											Status:"NOT",
											SupportPlatformTop: "NONE", SupportPlatformCenter: "NONE", SupportPlatformBottom: "NONE",
											Elements:[],
										},
										RoomX: xm,
										RoomY: yl
									};
					}
				}	
				var BloquesLiberados = [];
				var BlockCursor = DungeonArray[encontradoY][encontradoX];
				BlockCursor.Status = "OK";
				BlockCursor.Room = newRoom.Id;
				BlockCursor.RoomY = l;
				BlockCursor.RoomX = m;
				BloquesLiberados[BloquesLiberados.length] = BlockCursor;	
				newRoom.Blocks[l][m] = 
						{
							Block: BlockCursor,
							RoomX: m,
							RoomY: l
						};
				while(EspacioDisponible)
				{
					var BloquesDisponibles = [];
					var DireccionesDisponibles = [];
					if(DungeonArray[(encontradoY + l)][(encontradoX + m) - 1] != null &&
					   DungeonArray[(encontradoY + l)][(encontradoX + m) - 1].Status != "OK" && 
					   DungeonArray[(encontradoY + l)][(encontradoX + m) - 1].Id > 0 && (m - 1) >= 0 )
					{
						BloquesDisponibles[BloquesDisponibles.length] = DungeonArray[(encontradoY + l)][(encontradoX + m) - 1];
						DireccionesDisponibles[DireccionesDisponibles.length] = "LEFT";	
					}
				
					if(DungeonArray[(encontradoY + l)][(encontradoX + m) + 1] != null &&
					   DungeonArray[(encontradoY + l)][(encontradoX + m) + 1].Status != "OK" &&
					   DungeonArray[(encontradoY + l)][(encontradoX + m) + 1].Id > 0 && (m + 1) < randomWidth)
					{
						BloquesDisponibles[BloquesDisponibles.length] = DungeonArray[(encontradoY + l)][(encontradoX + m) + 1];
						DireccionesDisponibles[DireccionesDisponibles.length] = "RIGHT";
					}					
						
					if(DungeonArray[(encontradoY + l) - 1]!= null && DungeonArray[(encontradoY + l) - 1][(encontradoX + m)] != null &&
					   DungeonArray[(encontradoY + l) - 1][(encontradoX + m)].Status != "OK" &&
					   DungeonArray[(encontradoY + l) - 1][(encontradoX + m)].Id > 0 && (l - 1) >= 0 )
					{
						BloquesDisponibles[BloquesDisponibles.length] = DungeonArray[(encontradoY + l) - 1][(encontradoX + m)];
						DireccionesDisponibles[DireccionesDisponibles.length] = "TOP";										
					}						
						
					if(DungeonArray[(encontradoY + l) + 1] != null && DungeonArray[(encontradoY + l) + 1][(encontradoX + m)] != null &&
					   DungeonArray[(encontradoY + l) + 1][(encontradoX + m)].Status != "OK" &&
					   DungeonArray[(encontradoY + l) + 1][(encontradoX + m)].Id > 0 && (l + 1) < randomHeight)
					{
						BloquesDisponibles[BloquesDisponibles.length] = DungeonArray[(encontradoY + l) + 1][(encontradoX + m)];
						DireccionesDisponibles[DireccionesDisponibles.length] = "BOTTOM";	
					}		
					if(BloquesDisponibles.length > 0)
					{
						var numseleccionado = Math.floor((Math.random() * BloquesDisponibles.length));
						var nuevoBloque = BloquesDisponibles[numseleccionado];
						switch(DireccionesDisponibles[numseleccionado])
						{
							case "LEFT": m--; break;
							case "RIGHT": m++; break;
							case "TOP": l--; break;
							case "BOTTOM": l++; break;
						}
						BlockCursor = nuevoBloque;
						BlockCursor.Status = "OK";
						BlockCursor.Room = newRoom.Id;
						BlockCursor.RoomY = l;
						BlockCursor.RoomX = m;
						BloquesLiberados[BloquesLiberados.length] = BlockCursor;
						newRoom.Blocks[l][m] = 
											{
												Block: BlockCursor,
												RoomX: m,
												RoomY: l
											};
						retroceso = 0;
					}else
					{
						retroceso++;
						if(BloquesLiberados.length - retroceso < 0)
						{
							EspacioDisponible = false;
						}
						else
						{
							BlockCursor = BloquesLiberados[BloquesLiberados.length - retroceso];
							l = BlockCursor.RoomY;
							m = BlockCursor.RoomX;
						}
					}
				}
				DungeonRooms[DungeonRooms.length] = newRoom;
			}
		}
	}
	for(var r = 0; r < DungeonRooms.length; r++)
	{
		for(var b = 0; b < DungeonRooms[r].Blocks.length; b++)
		{
			for(var a = 0; a < DungeonRooms[r].Blocks[b].length; a++)
			{
				var DungeonRoomsBlocks = DungeonRooms[r].Blocks;
				var DungeonSelectedBlock = DungeonRoomsBlocks[b][a].Block;
				
				DungeonSelectedBlock.WallTop = (DungeonRoomsBlocks[b - 1] == null)? 1 : (DungeonRoomsBlocks[b - 1][a] == null || DungeonRoomsBlocks[b - 1][a].Block.Id == 0)? 1 : DungeonSelectedBlock.WallTop;					
				DungeonSelectedBlock.WallLeft = (DungeonRoomsBlocks[b][a - 1] == null || DungeonRoomsBlocks[b][a - 1].Block.Id == 0)? 1 : DungeonSelectedBlock.WallLeft;
				DungeonSelectedBlock.WallRight = (DungeonRoomsBlocks[b][a + 1] == null || DungeonRoomsBlocks[b][a + 1].Block.Id == 0)? 1 : DungeonSelectedBlock.WallRight;
				DungeonSelectedBlock.WallBottom = (DungeonRoomsBlocks[b + 1] == null)? 1 : (DungeonRoomsBlocks[b + 1][a] == null || DungeonRoomsBlocks[b + 1][a].Block.Id == 0)? 1 : DungeonSelectedBlock.WallBottom;
			}
		}
	}
	return GameDungeon;
}

function MakeDungeonRoomConnections(GameDungeon)
{
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	var RoomVisited = [];
	RoomVisited[RoomVisited.length] = {
										Room: DungeonRooms[0],
										RoomAnterior: 0
									  };
	var RoomVisitedActual = RoomVisited[0];
	while(RoomVisited.length < DungeonRooms.length)
	{
		var r = RoomVisitedActual.Room.index;
		var puertaColocada = 0;
		var cuartoCumplido = 0;
		var DungeonRoomSelected = DungeonRooms[r];
		var DungeonRoomBlocksLotery = [];
		for(var b = 0; b < DungeonRoomSelected.Blocks.length; b++)
		{
			for(var a = 0; a < DungeonRoomSelected.Blocks[b].length; a++)
			{
				if(DungeonRoomSelected.Blocks[b][a].Block.Id > 0)
				{
					DungeonRoomBlocksLotery[DungeonRoomBlocksLotery.length] = DungeonRoomSelected.Blocks[b][a];						
				}
			}
		}
		while(DungeonRoomBlocksLotery.length > 0 && puertaColocada == 0)
		{
			var randomNumber = Math.floor((Math.random() * DungeonRoomBlocksLotery.length)); 
			var randomConnection = Math.floor(Math.random() * 2);
			randomNumber = randomConnection == 1 ? 0 : randomNumber;
			randomNumber = randomConnection == 2 ? DungeonRoomBlocksLotery.length - 1 : randomNumber;
			var DungeonSelected = DungeonRoomBlocksLotery[randomNumber];
			DungeonRoomBlocksLotery.splice(randomNumber,1);
			var DungeonBlockSelected = DungeonSelected.Block;
			
			if(DungeonBlockSelected.X > 0 && puertaColocada == 0)
			{
				var DungeonSelectedLeft = DungeonArray[DungeonBlockSelected.Y][DungeonBlockSelected.X-1];
				if(DungeonSelectedLeft.Id > 0 && DungeonSelectedLeft.Room != DungeonRoomSelected.Id)
				{
					puertaColocada = DungeonSelectedLeft.Room;
					var encontrado = 0;
					for(var l=0; l < RoomVisited.length; l++)
					{
						if(RoomVisited[l].Room.Id == (puertaColocada))
						{
							encontrado = 1;
							puertaColocada = 0;
						}
					}
					if(encontrado == 0)
					{
						cuartoCumplido = 1;
						DungeonBlockSelected.ConnectLeft = DungeonSelectedLeft;
						DungeonBlockSelected.WallLeft = 0;
						DungeonSelectedLeft.ConnectRight = DungeonBlockSelected;
						DungeonSelectedLeft.WallRight = 0;	
						RoomVisited[RoomVisited.length] = 
						{
							Room: DungeonRooms[puertaColocada - 1],
							RoomAnterior: RoomVisitedActual
						};
						DungeonRoomSelected.Connections[DungeonRoomSelected.Connections.length] = DungeonSelectedLeft.Room;
						DungeonRooms[puertaColocada - 1].Connections[DungeonRooms[puertaColocada - 1].Connections.length] = DungeonRoomSelected.Id; 							
					}
				}
			}
			
			if(DungeonBlockSelected.X < (GameDungeon.DungeonWidth - 1) && puertaColocada == 0)
			{
				var DungeonSelectedRight = DungeonArray[DungeonBlockSelected.Y][DungeonBlockSelected.X+1];
				if(DungeonSelectedRight.Id > 0 && DungeonSelectedRight.Room != DungeonRoomSelected.Id)
				{
					puertaColocada = DungeonSelectedRight.Room;
					var encontrado = 0;
					for(var l=0; l < RoomVisited.length; l++)
					{
						if(RoomVisited[l].Room.Id == (puertaColocada))
						{
							encontrado = 1;
							puertaColocada = 0;
						}
					}
					if(encontrado == 0)
					{
						cuartoCumplido = 1;
						DungeonBlockSelected.ConnectRight = DungeonSelectedRight;
						DungeonBlockSelected.WallRight = 0;
						DungeonSelectedRight.ConnectLeft = DungeonBlockSelected;
						DungeonSelectedRight.WallLeft = 0;
						RoomVisited[RoomVisited.length] = 
						{
							Room: DungeonRooms[puertaColocada - 1],
							RoomAnterior: RoomVisitedActual
						};
						DungeonRoomSelected.Connections[DungeonRoomSelected.Connections.length] = DungeonSelectedRight.Room; 
						DungeonRooms[puertaColocada - 1].Connections[DungeonRooms[puertaColocada - 1].Connections.length] = DungeonRoomSelected.Id; 	
					}
				}
			}
			
			if(DungeonBlockSelected.Y > 0 && puertaColocada == 0)
			{
				var DungeonSelectedTop = DungeonArray[DungeonBlockSelected.Y - 1][DungeonBlockSelected.X];
				if(DungeonSelectedTop.Id > 0 && DungeonSelectedTop.Room != DungeonRoomSelected.Id)
				{
					puertaColocada = DungeonSelectedTop.Room;
					var encontrado = 0;
					for(var l=0; l < RoomVisited.length; l++)
					{
						if(RoomVisited[l].Room.Id == (puertaColocada))
						{
							encontrado = 1;
							puertaColocada = 0;
						}
					}
					if(encontrado == 0)
					{
						cuartoCumplido = 1;
						DungeonBlockSelected.ConnectTop = DungeonSelectedTop;
						DungeonBlockSelected.WallTop = 0;
						DungeonSelectedTop.ConnectBottom = DungeonBlockSelected;
						DungeonSelectedTop.WallBottom = 0;
						RoomVisited[RoomVisited.length] = 
						{
							Room: DungeonRooms[puertaColocada - 1],
							RoomAnterior: RoomVisitedActual
						};
						DungeonRoomSelected.Connections[DungeonRoomSelected.Connections.length] = DungeonSelectedTop.Room;
						DungeonRooms[puertaColocada - 1].Connections[DungeonRooms[puertaColocada - 1].Connections.length] = DungeonRoomSelected.Id; 	
					}
				}
			}
			
			if(DungeonBlockSelected.Y < (GameDungeon.DungeonHeight - 1) && puertaColocada == 0)
			{
				var DungeonSelectedBottom = DungeonArray[DungeonBlockSelected.Y + 1][DungeonBlockSelected.X];
				if(DungeonSelectedBottom.Id > 0 && DungeonSelectedBottom.Room != DungeonRoomSelected.Id)
				{
					puertaColocada = DungeonSelectedBottom.Room;
					var encontrado = 0;
					for(var l=0; l < RoomVisited.length; l++)
					{
						if(RoomVisited[l].Room.Id == (puertaColocada))
						{
							encontrado = 1;
							puertaColocada = 0;
						}
					}
					if(encontrado == 0)
					{
						cuartoCumplido = 1;
						DungeonBlockSelected.ConnectBottom = DungeonSelectedBottom;
						DungeonBlockSelected.WallBottom = 0;
						DungeonSelectedBottom.ConnectTop = DungeonBlockSelected;
						DungeonSelectedBottom.WallTop = 0;
						RoomVisited[RoomVisited.length] = 
						{
							Room: DungeonRooms[puertaColocada - 1],
							RoomAnterior: RoomVisitedActual
						};
						DungeonRoomSelected.Connections[DungeonRoomSelected.Connections.length] = DungeonSelectedBottom.Room;
						DungeonRooms[puertaColocada - 1].Connections[DungeonRooms[puertaColocada - 1].Connections.length] = DungeonRoomSelected.Id; 						
					}
				}
			}	
		}
		RoomVisitedActual = (cuartoCumplido != 0)? RoomVisited[RoomVisited.length - 1] : RoomVisitedActual.RoomAnterior;
	}
	return GameDungeon;
}

function MakeDungeonRoomInner(GameDungeon)
{
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	
	for(var l = 0; l < GameDungeon.DungeonHeight; l++)
	{
		for(var m = 0; m < GameDungeon.DungeonWidth; m++)
		{
			if(DungeonArray[l][m].Id > 0)
			{
				DungeonArray[l][m].RoomWallLeft = DungeonArray[l][m].ConnectLeft == 0 ? 1 : DungeonArray[l][m].WallLeft;
				DungeonArray[l][m].RoomWallRight = DungeonArray[l][m].ConnectRight == 0 ? 1 : DungeonArray[l][m].WallRight;
				DungeonArray[l][m].RoomWallBottom = DungeonArray[l][m].ConnectBottom == 0 ? 1 : DungeonArray[l][m].WallBottom;
				DungeonArray[l][m].RoomWallTop = DungeonArray[l][m].ConnectTop == 0 ? 1 : DungeonArray[l][m].WallTop;
				DungeonArray[l][m].Status = "NOT";
			}
		}
	}
	
	for(var r = 0; r < DungeonRooms.length; r++)
	{
		var RoomsWithConnect = [];
		var cont = 0;
		if(DungeonRooms[r].Blocks.length == 1 || DungeonRooms[r].Blocks[0].length == 1)
		{
			for(var b = 0; b < DungeonRooms[r].Blocks.length; b++)
			{
				for(var a = 0; a < DungeonRooms[r].Blocks[b].length; a++)
				{
					var bloqueact = DungeonRooms[r].Blocks[b][a].Block;
					if(bloqueact.Id > 0)
					{
						bloqueact.Status = "OK";
						bloqueact.RoomWallLeft = bloqueact.ConnectLeft == 0 ? 0 : bloqueact.WallLeft;
						bloqueact.RoomWallRight = bloqueact.ConnectRight == 0 ? 0 : bloqueact.WallRight;
						bloqueact.RoomWallBottom = bloqueact.ConnectBottom == 0 ? 0 : bloqueact.WallBottom;
						bloqueact.RoomWallTop = bloqueact.ConnectTop == 0 ? 0 : bloqueact.WallTop;								
					}
				}
			}			
		}
		else
		{
			for(var b = 0; b < DungeonRooms[r].Blocks.length; b++)
			{
				for(var a = 0; a < DungeonRooms[r].Blocks[b].length; a++)
				{
					if(DungeonRooms[r].Blocks[b][a].Block.Id > 0)
					{
						RoomsWithConnect[cont] = DungeonRooms[r].Blocks[b][a].Block;
						cont++;
					}				
				}
			}
			if(RoomsWithConnect.length > 1)
			{
				var BloquesLiberados = [];
				var bloquesCompletados = 0;
			
				var BlockCursor = RoomsWithConnect[0];
				BlockCursor.Status = "OK";
				BloquesLiberados[BloquesLiberados.length] = BlockCursor;	
							
				while(bloquesCompletados < RoomsWithConnect.length)
				{
					bloquesCompletados = 0;
					var bloqueColocado = 0;
					var retroceso = 0;
					while(bloqueColocado == 0)
					{
						var BloquesDisponibles = [];
						var DireccionesDisponibles = [];
						
						if(DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1] != null &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1].Block.Status != "OK" && 
						   DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1].Block.Id > 0)
						{
							BloquesDisponibles[BloquesDisponibles.length] = DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1].Block;
							DireccionesDisponibles[DireccionesDisponibles.length] = "LEFT";	
						}
					
						if(DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1] != null &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1].Block.Status != "OK" &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1].Block.Id > 0)
						{
							BloquesDisponibles[BloquesDisponibles.length] = DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1].Block;
							DireccionesDisponibles[DireccionesDisponibles.length] = "RIGHT";
						}					
							
						if(DungeonRooms[r].Blocks[BlockCursor.RoomY - 1] != null && DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX] != null &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX].Block.Status != "OK" &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX].Block.Id > 0)
						{
							BloquesDisponibles[BloquesDisponibles.length] = DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX].Block;
							DireccionesDisponibles[DireccionesDisponibles.length] = "TOP";										
						}						
							
						if(DungeonRooms[r].Blocks[BlockCursor.RoomY + 1] != null && DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX] != null &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX].Block.Status != "OK" &&
						   DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX].Block.Id > 0)
						{
							BloquesDisponibles[BloquesDisponibles.length] = DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX].Block;
							DireccionesDisponibles[DireccionesDisponibles.length] = "BOTTOM";	
						}
						
						if(BloquesDisponibles.length > 0)
						{
							var numseleccionado = Math.floor((Math.random() * BloquesDisponibles.length));
							var nuevoBloque = BloquesDisponibles[numseleccionado];
							switch(DireccionesDisponibles[numseleccionado])
							{
								case "LEFT": BlockCursor.RoomWallLeft = 0;nuevoBloque.RoomWallRight = 0;break;
								case "RIGHT": BlockCursor.RoomWallRight = 0;nuevoBloque.RoomWallLeft = 0;break;
								case "TOP": BlockCursor.RoomWallTop = 0;nuevoBloque.RoomWallBottom = 0;break;
								case "BOTTOM": BlockCursor.RoomWallBottom = 0;nuevoBloque.RoomWallTop = 0;break;
							}
							BlockCursor = nuevoBloque;
							BlockCursor.Status = "OK";
							BloquesLiberados[BloquesLiberados.length] = BlockCursor;
							bloqueColocado = 1;
						}else
						{
							retroceso++;
							BlockCursor = BloquesLiberados[BloquesLiberados.length - retroceso];
						}			
					}			
					for(var b = 0; b < DungeonRooms[r].Blocks.length; b++)
					{
						for(var a = 0; a < DungeonRooms[r].Blocks[b].length; a++)
						{
							if(DungeonRooms[r].Blocks[b][a].Block.Status == "OK")
							{
								for(var c = 0; c < RoomsWithConnect.length; c++)
								{
									if(DungeonRooms[r].Blocks[b][a].Block.Id == RoomsWithConnect[c].Id)
									{
										bloquesCompletados++;	
									}
								}
							}				
						}
					}
				}
			}else
			{
				var BlockCursor = RoomsWithConnect[0];
				BlockCursor.Status = "OK";
				if(DungeonRooms[r].Blocks.length > 1 || DungeonRooms[r].Blocks[0].length > 1)
				{
					for(var b = 0; b < DungeonRooms[r].Blocks.length; b++)
					{
						for(var a = 0; a < DungeonRooms[r].Blocks[b].length; a++)
						{
							var bloqueact = DungeonRooms[r].Blocks[b][a].Block;
							if(bloqueact.Id > 0)
							{
								bloqueact.Status = "OK";
								bloqueact.RoomWallLeft = bloqueact.ConnectLeft == 0 ? 0 : bloqueact.WallLeft;
								bloqueact.RoomWallRight = bloqueact.ConnectRight == 0 ? 0 : bloqueact.WallRight;
								bloqueact.RoomWallBottom = bloqueact.ConnectBottom == 0 ? 0 : bloqueact.WallBottom;
								bloqueact.RoomWallTop = bloqueact.ConnectTop == 0 ? 0 : bloqueact.WallTop;									
							}
						}
					}			
				}
			}
		}
	}
	return GameDungeon;
}

function ConfigureOpenWorld(GameDungeon)
{
	var DungeonArray = GameDungeon.DungeonBlocks;
	for(l = 0; l < GameDungeon.DungeonHeight; l++)
	{
		for(m = 0; m < GameDungeon.DungeonWidth; m++)
		{	
			var DungeonSelectedBlock = DungeonArray[l][m];
			if(DungeonSelectedBlock.Id > 0)
			{
				DungeonSelectedBlock.ConnectTop = 0;
				DungeonSelectedBlock.ConnectRight = 0;
				DungeonSelectedBlock.ConnectBottom = 0;
				DungeonSelectedBlock.ConnectLeft = 0;
				var randNum = Math.floor((Math.random() * 2));
				//randNum = 1;
				if(randNum != 0)
				{
					if((l - 1) >= 0 && DungeonArray[l - 1][m].Id > 0)
					{
						DungeonSelectedBlock.WallTop = 0;
						DungeonSelectedBlock.RoomWallTop = 0;
						DungeonArray[l - 1][m].WallBottom = 0;
						DungeonArray[l - 1][m].RoomWallBottom = 0;
					}
					if((l + 1) < GameDungeon.DungeonHeight && DungeonArray[l + 1][m].Id > 0)
					{
						DungeonSelectedBlock.WallBottom = 0;
						DungeonSelectedBlock.RoomWallBottom = 0;
						DungeonArray[l + 1][m].WallTop = 0;
						DungeonArray[l + 1][m].RoomWallTop = 0;
					}
					if((m - 1) >= 0 && DungeonArray[l][m - 1].Id > 0)
					{
						DungeonSelectedBlock.WallLeft = 0;
						DungeonSelectedBlock.RoomWallLeft = 0;
						DungeonArray[l][m - 1].WallRight = 0;
						DungeonArray[l][m - 1].RoomWallRight = 0;
					}
					if((m + 1) < GameDungeon.DungeonWidth && DungeonArray[l][m + 1].Id > 0)
					{
						DungeonSelectedBlock.WallRight = 0;
						DungeonSelectedBlock.RoomWallRight = 0;
						DungeonArray[l][m + 1].WallLeft = 0;
						DungeonArray[l][m + 1].RoomWallLeft = 0;
					}
				}
			}
		}
	}
	return GameDungeon;	
}

function MakeDungeonSupportPlatform(GameDungeon)
{
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	var ZigZagPlatform = "RIGHT";
	var ZigZagPlatform2 = "RIGHT";

	for(var r = 0; r < DungeonRooms.length; r++)
	{
		for(var a = 0; a < DungeonRooms[r].Blocks[0].length; a++)
		{
			for(var b = 0; b < DungeonRooms[r].Blocks.length; b++)
			{
				var BloqueSeleccionado = DungeonRooms[r].Blocks[b][a].Block;
				if(BloqueSeleccionado.Id > 0)
				{
					if(BloqueSeleccionado.WallTop == 0 && BloqueSeleccionado.RoomWallTop == 0)
					{
						BloqueSeleccionado.SupportPlatformCenter = "CENTER";
						if(BloqueSeleccionado.WallLeft == 0 && BloqueSeleccionado.RoomWallLeft == 0 && (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0))
						{
							BloqueSeleccionado.SupportPlatformCenter = "RIGHT";
							BloqueSeleccionado.SupportPlatformCenter = (ZigZagPlatform == "RIGHT") ? "RIGHT" : "CENTER";
							ZigZagPlatform = (ZigZagPlatform == "LEFT")? "RIGHT" : "LEFT";
						}
						if(BloqueSeleccionado.WallRight == 0 && BloqueSeleccionado.RoomWallRight == 0 && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
						{
							BloqueSeleccionado.SupportPlatformCenter = "LEFT";
							BloqueSeleccionado.SupportPlatformCenter = (ZigZagPlatform == "LEFT") ? "LEFT" : "CENTER";
							ZigZagPlatform = (ZigZagPlatform == "LEFT")? "RIGHT" : "LEFT";
						}
						if((BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0) && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
						{
							BloqueSeleccionado.SupportPlatformCenter = ZigZagPlatform;
							ZigZagPlatform = (ZigZagPlatform == "LEFT")? "RIGHT" : "LEFT";
						}
					}
					if(BloqueSeleccionado.WallBottom == 0 && BloqueSeleccionado.RoomWallBottom == 0)
					{
						BloqueSeleccionado.SupportPlatformBottom = "CENTER";
						if(BloqueSeleccionado.WallLeft == 0 && BloqueSeleccionado.RoomWallLeft == 0 && (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0))
						{
							BloqueSeleccionado.SupportPlatformBottom = "RIGHT";
							BloqueSeleccionado.SupportPlatformBottom = (ZigZagPlatform == "RIGHT") ? "RIGHT" : "CENTER";
							ZigZagPlatform = (ZigZagPlatform == "LEFT")? "RIGHT" : "LEFT";
						}
						if(BloqueSeleccionado.WallRight == 0 && BloqueSeleccionado.RoomWallRight == 0 && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
						{
							BloqueSeleccionado.SupportPlatformBottom = "LEFT";
							BloqueSeleccionado.SupportPlatformBottom = (ZigZagPlatform == "LEFT") ? "LEFT" : "CENTER";
							ZigZagPlatform = (ZigZagPlatform == "LEFT")? "RIGHT" : "LEFT";
						}
						if((BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0) && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
						{
							BloqueSeleccionado.SupportPlatformBottom = ZigZagPlatform;
							ZigZagPlatform = (ZigZagPlatform == "LEFT")? "RIGHT" : "LEFT";
						}
						if(BloqueSeleccionado.ConnectRight!= "")
						{
							BloqueSeleccionado.SupportPlatformBottom = "RIGHT";
						}
						if(BloqueSeleccionado.ConnectLeft!= "")
						{
							BloqueSeleccionado.SupportPlatformBottom = "LEFT";
						}
						if(BloqueSeleccionado.ConnectBottom!= "")
						{
							BloqueSeleccionado.SupportPlatformBottom = "CENTER";
						}
					}
					if(BloqueSeleccionado.WallTop == 0 && BloqueSeleccionado.RoomWallTop == 0)
					{
						BloqueSeleccionado.SupportPlatformTop = "CENTER";
						if(BloqueSeleccionado.WallLeft == 0 && BloqueSeleccionado.RoomWallLeft == 0 && (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0))
						{
							BloqueSeleccionado.SupportPlatformTop = "RIGHT";
							BloqueSeleccionado.SupportPlatformTop = (ZigZagPlatform2 == "RIGHT") ? "RIGHT" : "CENTER";
							ZigZagPlatform2 = (ZigZagPlatform2 == "LEFT")? "RIGHT" : "LEFT";
						}
						if(BloqueSeleccionado.WallRight == 0 && BloqueSeleccionado.RoomWallRight == 0 && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
						{
							BloqueSeleccionado.SupportPlatformTop = "LEFT";
							BloqueSeleccionado.SupportPlatformTop = (ZigZagPlatform2 == "LEFT") ? "LEFT" : "CENTER";
							ZigZagPlatform2 = (ZigZagPlatform2 == "LEFT")? "RIGHT" : "LEFT";
						}
						if((BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0) && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
						{
							BloqueSeleccionado.SupportPlatformTop = ZigZagPlatform2;
							ZigZagPlatform2 = (ZigZagPlatform2 == "LEFT")? "RIGHT" : "LEFT";
						}
						if(BloqueSeleccionado.ConnectRight!= "")
						{
							BloqueSeleccionado.SupportPlatformTop = "RIGHT";
						}
						if(BloqueSeleccionado.ConnectLeft!= "")
						{
							BloqueSeleccionado.SupportPlatformTop = "LEFT";
						}
						if(BloqueSeleccionado.ConnectTop!= "")
						{
							//BloqueSeleccionado.SupportPlatformTop = "CENTER";
						}
					}
				}
			}
		}
	}
	return GameDungeon;
}

function DistributeDungeonElements(GameDungeon)
{
	var ElementIdC = 1;
	for(var x = 0; x < GameDungeon.Elements.length; x++)
	{
		var itemElement = GameDungeon.Elements[x];
		var BloquesDisponibles = [];
		for(var l = 0; l < GameDungeon.DungeonHeight; l++)
		{
			for(var m = 0; m < GameDungeon.DungeonWidth; m++)
			{
				var Block = GameDungeon.DungeonBlocks[l][m];
				var valido = true;
				valido = Block.Id == 0 ? false : valido;
				valido = itemElement.NotIndoor == 1 && (Block.ConnectTop != 0 || Block.ConnectRight != 0 || Block.ConnectBottom != 0 || Block.ConnectLeft != 0) ? false : valido;
				valido = Block.Elements.length > itemElement.OcuppedTolerance ? false : valido;
				valido = itemElement.ObligatoryBottomWall != "NO" ? CheckWallElementConsideration(itemElement.ObligatoryBottomWall, Block.WallBottom, Block.RoomWallBottom, valido) : valido;
				valido = itemElement.ObligatoryTopWall != "NO" ? CheckWallElementConsideration(itemElement.ObligatoryTopWall, Block.WallTop, Block.RoomWallTop, valido) : valido;
				valido = itemElement.ObligatoryLeftWall != "NO" ? CheckWallElementConsideration(itemElement.ObligatoryLeftWall, Block.WallLeft, Block.RoomWallLeft, valido) : valido;
				valido = itemElement.ObligatoryRightWall != "NO" ? CheckWallElementConsideration(itemElement.ObligatoryRightWall, Block.WallRight, Block.RoomWallRight, valido) : valido;
				if(valido)
				{
					BloquesDisponibles[BloquesDisponibles.length] = Block;
				}
			}
		}
		for(var l = 0; l < itemElement.Total && BloquesDisponibles.length > 0; l++)
		{
			var numseleccionado = Math.floor((Math.random() * BloquesDisponibles.length));
			var BlockSeleccionado = BloquesDisponibles[numseleccionado];
			var NewElement =
			{
				NameTag: itemElement.NameTag,
				UID: itemElement.UID,
				BlockId: BlockSeleccionado.Id,
				ElementId: ElementIdC,
				Status: 1,
				Data: {},
				PositionX: 0,
				PositionY: 0,
				Width: itemElement.Width,
				Height: itemElement.Height,
				Priority: itemElement.Priority
			};
			itemElement.Objetos[itemElement.Objetos.length] = NewElement;
			BlockSeleccionado.Elements[BlockSeleccionado.Elements.length] = NewElement;
			ElementIdC++;
			BloquesDisponibles.splice(numseleccionado,1);
		}
		itemElement.Total = itemElement.Objetos.length;
	}
	return GameDungeon;
}

function CheckWallElementConsideration(Conditional,Wall,RoomWall,valido)
{
	if(Conditional == "YES" && Wall == 0 && RoomWall == 0) return false;
	if(Conditional == "BORDER" && Wall == 0) return false;
	if(Conditional == "ROOM" && (Wall == 1 || RoomWall == 0)) return false;
	if(Conditional == "NONE" && (Wall == 1 || RoomWall == 1)) return false;
	return valido;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function GetRndColor()
{
	var rndColor = ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
	var redColor = Math.floor(Math.random()*(170)+40).toString(16);
	var GreenColor = Math.floor(Math.random()*(170)+40).toString(16);
	var BlueColor = Math.floor(Math.random()*(170)+40).toString(16);
	rndColor = redColor + "" + GreenColor + "" + BlueColor;
	return "#" + rndColor;
}

function GetRndColor2(maxLength, index)
{
	maxLength = maxLength + 1;
	index = index + 1;
	var rndColor = ('000000' + Math.floor((16777215/maxLength) * index).toString(16)).slice(-6);
	return "#" + rndColor;
}

function GraphiqueDungeon(GameDungeon)
{
	GameDungeon = GameDungeon == null ? JSON2.parse(localStorage.getItem("GraphicMap_objMapGraphic")) : GameDungeon;
	localStorage.setItem("GraphicMap_objMapGraphic", JSON2.stringify(GameDungeon));
	if(localStorage.getItem("GraphicMap_ShowSupportPlatforms") == null)
	{
		localStorage.setItem("GraphicMap_ShowSupportPlatforms", 0);
	}
	if(localStorage.getItem("GraphicMap_ShowColorRooms") == null)
	{
		localStorage.setItem("GraphicMap_ShowColorRooms", 0);
	}
	if(localStorage.getItem("GraphicMap_ShowElements") == null)
	{
		localStorage.setItem("GraphicMap_ShowElements", 0);
	}
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	var ArrayRndmColorBgn = [];
	for(var r = 0; r < DungeonRooms.length; r++)
	{
		ArrayRndmColorBgn[ArrayRndmColorBgn.length] = GetRndColor2(DungeonRooms.length, r);
	}
	var perSize = "15px";
	var minimap = "";
	minimap += "<style> .RDM_blank { width:" + perSize + "; height:" + perSize + "; font-size:10px; background-color:#FFF; border-style:solid; border-width:1px; border-color:#EEE; } </style>";
	minimap += "<style> .RDM_Block { width:100%; height:100% } .RDM_Block:active { background-color:#AAA; } </style>";
	minimap += "<style> .RDM_Table { text-align:center; width:100%; font-size: 15px; } .RDM_Table td{text-align:center;} .RDM_Table th{ border-bottom:solid 1px; font-weight: bold;} </style>";
	minimap += "<style> .RDM_MAP {text-align:center; border-spacing:0px; " + ( "width:" + GameDungeon.DungeonWidth * 20 +"px;") + ( "height:" + GameDungeon.DungeonHeight * 20 +"px;") + " } .RDM_MAP td{ width:" + perSize + "; height:" + perSize + "; font-size: 10px; padding: 0px; } </style>";
	minimap += "<style> .RDM_Platforms { width: 40%; height: 10%; position: relative; } </style>";
	
	minimap += "<table>";
		minimap += "<tr style='vertical-align:top'>";
			minimap += "<td rowspan='2'>";
				minimap += "<table class='RDM_MAP'>\n";
				minimap += "<tr>";
				minimap += "<td>X</td>";
				for(var m = 0; m < GameDungeon.DungeonWidth; m++)
				{
					minimap += "<td>" + m + "</td>";
				}
				minimap += "</tr>";
				for(var l = 0; l < GameDungeon.DungeonHeight; l++)
				{
					minimap += "<tr>";
					for(var m = 0; m < GameDungeon.DungeonWidth; m++)
					{
						minimap += m == 0 ? "<td>" + l + "</td>" : "";
						var BloqueSeleccionado = DungeonArray[l][m];
						var border = "border-style:solid;border-width:0px;";
						if(BloqueSeleccionado.Id > 0)
						{
							var RndmColorBackground = ArrayRndmColorBgn[BloqueSeleccionado.Room - 1];
							RndmColorBackground = localStorage.getItem("GraphicMap_ShowColorRooms") == 1 ? RndmColorBackground : "#FFD700";
							var backgroundcolor = "background-color:" + ((BloqueSeleccionado.Status == "OK") ? RndmColorBackground : "#000") + ";";
							if(BloqueSeleccionado.WallTop > 0 || BloqueSeleccionado.RoomWallTop > 0)
							{
								border += "border-top: solid " + (l > 0 && DungeonArray[l - 1][m] != null && DungeonArray[l - 1][m].Id == 0 ? "2" :(DungeonArray[l - 1] == null) ? "2" : "1") + "px;";
							}
							if(BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0)
							{
								border += "border-right: solid " + ((m <= GameDungeon.DungeonWidth - 1) && DungeonArray[l][m + 1] != null && DungeonArray[l][m + 1].Id == 0 ? "2" : DungeonArray[l][m + 1] == null ? "2" : "1") + "px;";					
							}
							if(BloqueSeleccionado.WallBottom > 0 || BloqueSeleccionado.RoomWallBottom > 0)
							{
								border += "border-bottom: solid " + ((l < GameDungeon.DungeonHeight - 1) && DungeonArray[l + 1][m] != null && DungeonArray[l + 1][m].Id == 0 ? "2" : (DungeonArray[l + 1] == null) ? "2" : "1") + "px;"
							}
							if(BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0)
							{
								border += "border-left: solid " + (m >= 0 && DungeonArray[l][m - 1] != null && DungeonArray[l][m - 1].Id == 0 ? "2" : DungeonArray[l][m - 1] == null ? "2" : "1") + "px;";
							}
							border += (BloqueSeleccionado.ConnectTop != "")? "border-top: dotted 1px #FFF;" : "";
							border += (BloqueSeleccionado.ConnectRight != "")? "border-right: dotted 1px #FFF;" : "";
							border += (BloqueSeleccionado.ConnectBottom != "")? "border-bottom: dotted 1px #FFF;" : "";
							border += (BloqueSeleccionado.ConnectLeft != "")? "border-left: dotted 1px #FFF;" : "";
							minimap += "<td style='" + backgroundcolor + border + "'>";
								var OnClickEvent = "OnClick='document.getElementById(\"blockinfo\").innerHTML= \" " + BlockInfoResume(JSON2.stringify(BloqueSeleccionado)) + " \" '";
								minimap += "<div " + OnClickEvent + " title='ID: "+BloqueSeleccionado.Id+" (" + BloqueSeleccionado.X + "," + BloqueSeleccionado.Y + ")' " + " class='RDM_Block'>";
								if(localStorage.getItem("GraphicMap_ShowSupportPlatforms") == 1)
								{
									switch(BloqueSeleccionado.SupportPlatformTop)
									{
										case "LEFT": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 10%; left: 0%;'></div>"; break;
										case "CENTER": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 10%; left: 30%;'></div>"; break;
										case "RIGHT": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 10%; left: 60%;'></div>"; break;
										default: minimap += "<div class='RDM_Platforms' style='background-color: rgba(0,0,0,0); top: 10%; left: 30%;'></div>";
									}
									switch(BloqueSeleccionado.SupportPlatformCenter)
									{
										case "LEFT": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 50%; left: 0%;'></div>"; break;
										case "CENTER": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 50%; left: 30%;'></div>"; break;
										case "RIGHT": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 50%; left: 60%;'></div>"; break;
										default: minimap += "<div class='RDM_Platforms' style='background-color: rgba(0,0,0,0); top: 50%; left: 30%;'></div>";
									}
									switch(BloqueSeleccionado.SupportPlatformBottom)
									{
										case "LEFT": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 80%; left: 0%;'></div>"; break;
										case "CENTER": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 80%; left: 30%;'></div>"; break;
										case "RIGHT": minimap += "<div class='RDM_Platforms' style='background-color: #000; top: 80%; left: 60%;'></div>"; break;
										default: minimap += "<div class='RDM_Platforms' style='background-color: rgba(0,0,0,0); top: 80%; left: 30%;'></div>";
									}
								}
								if(localStorage.getItem("GraphicMap_ShowElements") == 1)
								{
									for(var y = 0; y < BloqueSeleccionado.Elements.length; y++)
									{
										minimap += BloqueSeleccionado.Elements[y].NameTag;
									}
								}
								minimap += "</div>";
							minimap += "</td>";
						}else
						{
							border = "border-style:solid;border-width:1px;border-color:#EEE";
							minimap += "<td class='RDM_blank'>";
							minimap += "<div title='ID: " + BloqueSeleccionado.Id + " (" + BloqueSeleccionado.X + "," + BloqueSeleccionado.Y + ")' " + "> &nbsp </div>";
							minimap += "</td>";
						}
					}
					minimap += "</tr>";
				}
				minimap += "</table>";
			minimap += "</td>";
			minimap += "<td>";
				minimap += MapOptionsTable();
			minimap += "</td>";
		minimap += "</tr>";
		minimap += "<tr>";
			minimap += "<td style='vertical-align:middle;'><div id='blockinfo' style='width:300px;'></div></td>";
		minimap += "</tr>";
	minimap += "</table>";
	return minimap;
}

function MapOptionsTable()
{
	var GraphiqueFunction = "document.getElementById(\"minimap\").innerHTML = GraphiqueDungeon();";
	var chkShowSupportPlatforms = "localStorage.setItem(\"GraphicMap_ShowSupportPlatforms\", document.getElementById(\"chkShowSupportPlatforms\").checked ? 1 : 0);";
	var chkShowColorRooms = "localStorage.setItem(\"GraphicMap_ShowColorRooms\", document.getElementById(\"chkShowColorRooms\").checked ? 1 : 0);";
	var chkShowElements = "localStorage.setItem(\"GraphicMap_ShowElements\", document.getElementById(\"chkShowElements\").checked ? 1 : 0);";
	var stringtable = "<table>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowSupportPlatforms + GraphiqueFunction + "' id='chkShowSupportPlatforms' " + (localStorage.getItem("GraphicMap_ShowSupportPlatforms") == 1 ? "checked" : "") + "> Support Platforms </input>";
		stringtable += "</td>";
	stringtable += "</tr>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowColorRooms + GraphiqueFunction + "' id='chkShowColorRooms' " + (localStorage.getItem("GraphicMap_ShowColorRooms") == 1 ? "checked" : "") + "> Color Rooms </input>";
		stringtable += "</td>";
	stringtable += "</tr>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowElements + GraphiqueFunction + "' id='chkShowElements' " + (localStorage.getItem("GraphicMap_ShowElements") == 1 ? "checked" : "") + "> Elements </input>";
		stringtable += "</td>";
	stringtable += "</tr>";
	stringtable += "</table>";
	return stringtable;
}

function BlockInfoResume(Info)
{
	var blockInfo = JSON2.parse(Info);	
	var TypeWallTop = (blockInfo.WallTop > 0)? "BORDER" : ((blockInfo.RoomWallTop > 0)? "ROOM" : "NONE");
	var TypeWallBottom = (blockInfo.WallBottom > 0)? "BORDER" : ((blockInfo.RoomWallBottom > 0)? "ROOM" : "NONE");
	var TypeWallLeft = (blockInfo.WallLeft > 0)? "BORDER" : ((blockInfo.RoomWallLeft > 0)? "ROOM" : "NONE");
	var TypeWallRight = (blockInfo.WallRight > 0)? "BORDER" : ((blockInfo.RoomWallRight > 0)? "ROOM" : "NONE");

	var ResumeInfo = "";
	
	ResumeInfo += "<table class=RDM_Table>";
		ResumeInfo += "<tr>";
			ResumeInfo += "<th colspan=2 style=border:none><u>Block Info</u></th>";
		ResumeInfo += "</tr>";
		ResumeInfo += "<tr style=text-align:left;>";
			ResumeInfo += "<td>" + "<b>Id:</b> " + blockInfo.Id + "</td>";
			ResumeInfo += "<td>" + "<b>Room:</b> " + blockInfo.Room + "</td>";
		ResumeInfo += "</tr>";
		ResumeInfo += "<tr style=text-align:left;>";
			ResumeInfo += "<td>" +"<b>Pos. Global:</b> " +  blockInfo.X + "," + blockInfo.Y + "</td>";
			ResumeInfo += "<td>" +"<b>Pos. Room:</b> " +  blockInfo.RoomX + "," + blockInfo.RoomY + "</td>";			
		ResumeInfo += "</tr>";
	ResumeInfo += "</table>";
	ResumeInfo += "<hr class=RDM_Table/>";
	
	ResumeInfo += "<table class=RDM_Table>";//#FFA
		ResumeInfo += "<tr>";
			ResumeInfo += "<th style=text-align:left;> Walls: </th>";
			ResumeInfo += "<th>Top</th>";
			ResumeInfo += "<th>Bottom</th>";
			ResumeInfo += "<th>Left</th>";
			ResumeInfo += "<th>Right</th>";
		ResumeInfo += "</tr>";
		ResumeInfo += "<tr>";
			ResumeInfo += "<td style=text-align:left;> Value: </td>";
			ResumeInfo += "<td>" + TypeWallTop + "</td>";
			ResumeInfo += "<td>" + TypeWallBottom + "</td>";
			ResumeInfo += "<td>" + TypeWallLeft + "</td>";
			ResumeInfo += "<td>" + TypeWallRight + "</td>";
		ResumeInfo += "</tr>";
	ResumeInfo += "</table>";
	ResumeInfo += "<hr class=RDM_Table/>";
	
	ResumeInfo += "<table class=RDM_Table>";//#AFA
		ResumeInfo += "<tr>";
			ResumeInfo += "<th style=text-align:left;> Connect: </th>";
			ResumeInfo += "<th>Top</th>";
			ResumeInfo += "<th>Bottom</th>";
			ResumeInfo += "<th>Left</th>";
			ResumeInfo += "<th>Right</th>";
		ResumeInfo += "</tr>";
		ResumeInfo += "<tr>";
			ResumeInfo += "<td style=text-align:left;>Value: </td>";
			ResumeInfo += "<td>" + (blockInfo.ConnectTop == 0? 0: blockInfo.ConnectTop.Id) + "</td>";
			ResumeInfo += "<td>" + (blockInfo.ConnectBottom == 0? 0: blockInfo.ConnectBottom.Id) + "</td>";
			ResumeInfo += "<td>" + (blockInfo.ConnectLeft == 0? 0: blockInfo.ConnectLeft.Id) + "</td>";
			ResumeInfo += "<td>" + (blockInfo.ConnectRight == 0? 0: blockInfo.ConnectRight.Id) + "</td>";
		ResumeInfo += "</tr>";
	ResumeInfo += "</table>";
	ResumeInfo += "<hr class=RDM_Table/>";
	
	ResumeInfo += "<table class=RDM_Table>";//#FAA
		ResumeInfo += "<tr>";
			ResumeInfo += "<th style=text-align:left;>Platform: </td>";
			ResumeInfo += "<th>Top</th>";
			ResumeInfo += "<th>Center</th>";
			ResumeInfo += "<th>Bottom</th>";
		ResumeInfo += "</tr>";
		ResumeInfo += "<tr>";
			ResumeInfo += "<td style=text-align:left;>Value: </td>";
			ResumeInfo += "<td>" + blockInfo.SupportPlatformTop + "</td>";
			ResumeInfo += "<td>" + blockInfo.SupportPlatformCenter + "</td>";
			ResumeInfo += "<td>" + blockInfo.SupportPlatformBottom + "</td>";
		ResumeInfo += "</tr>";
	ResumeInfo += "</table>";
	
	if(blockInfo.Elements.length > 0)
	{
		ResumeInfo += "<hr class=RDM_Table/>";
		ResumeInfo += "<b>Elements</b><br/>";
		ResumeInfo += "<table class=RDM_Table>";
		ResumeInfo += "<tr>";
			ResumeInfo += "<th>Name</td>";
			ResumeInfo += "<th>Id</th>";
			ResumeInfo += "<th>Active</th>";
		ResumeInfo += "</tr>";
			for(var x = 0; x < blockInfo.Elements.length; x++)
			{
				ResumeInfo += "<tr>";
					ResumeInfo += "<td>" + blockInfo.Elements[x].NameTag + "</td>";
					ResumeInfo += "<td>" + blockInfo.Elements[x].ElementId + "</td>";
					ResumeInfo += "<td>" + (blockInfo.Elements[x].Status == 1 ? "YES" : "NO") + "</td>";
				ResumeInfo += "</tr>";
			}
		ResumeInfo += "</table>";		
	}

	return ResumeInfo;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var JSON2 = (
	function(JSON, RegExp) {
	var specialChar = '~';
	var safeSpecialChar = '\\x' + ( '0' + specialChar.charCodeAt(0).toString(16) ).slice(-2);
	var escapedSafeSpecialChar = '\\' + safeSpecialChar;
	var specialCharRG = new RegExp(safeSpecialChar, 'g');
	var safeSpecialCharRG = new RegExp(escapedSafeSpecialChar, 'g');
	var safeStartWithSpecialCharRG = new RegExp('(?:^|([^\\\\]))' + escapedSafeSpecialChar);
	var indexOf = [].indexOf || function(v) {
									for(var i=this.length;i--&&this[i]!==v;);
									return i;
								};
	var $String = String;

	function generateReplacer(value, replacer, resolve) {
	  var inspect = !!replacer;
	  var path = [];
	  var all  = [value];
	  var seen = [value];
	  var mapp = [resolve ? specialChar : '[Circular]'];
	  var last = value;
	  var lvl  = 1; var i; var fn;
	  
	  if (inspect) {
		fn = typeof replacer === 'object' ? function (key, value) {
												return key !== '' && replacer.indexOf(key) < 0 ? void 0 : value;
											} : replacer;
	  }
	  return function(key, value) {
		if (inspect) 
			value = fn.call(this, key, value);
		if (key !== '') {
			if (last !== this) {
				i = lvl - indexOf.call(all, this) - 1;
				lvl -= i;
				all.splice(lvl, all.length);
				path.splice(lvl - 1, path.length);
				last = this;
			}
			if (typeof value === 'object' && value) {
				if (indexOf.call(all, value) < 0) 
					all.push(last = value);
				lvl = all.length;
				i = indexOf.call(seen, value);
				if (i < 0) {
					i = seen.push(value) - 1;
					if (resolve) {
						path.push(('' + key).replace(specialCharRG, safeSpecialChar));
						mapp[i] = specialChar + path.join(specialChar);
					} 
					else mapp[i] = mapp[0];
				} 
				else value = mapp[i];
			} 
			else {
				if (typeof value === 'string' && resolve) 
					value = value.replace(safeSpecialChar, escapedSafeSpecialChar).replace(specialChar, safeSpecialChar);
			}
		}
		return value;
	  };
	}

	function retrieveFromPath(current, keys) {
		for(var i = 0, length = keys.length; i < length; current = current[ keys[i++].replace(safeSpecialCharRG, specialChar) ]);
		return current;
	}

	function generateReparser(reparser) {
		return function(key, value) {
			var isString = typeof value === 'string';
			if (isString && value.charAt(0) === specialChar) 
				return new $String(value.slice(1));
			if (key === '') 
				value = regenerate(value, value, {});
			if (isString) 
				value = value.replace(safeStartWithSpecialCharRG, '$1' + specialChar).replace(escapedSafeSpecialChar, safeSpecialChar);
			return reparser ? reparser.call(this, key, value) : value;
		};
	}

	function regenerateArray(root, current, retrieve) {
		for (var i = 0, length = current.length; i < length; i++)
			current[i] = regenerate(root, current[i], retrieve);
		return current;
	}

	function regenerateObject(root, current, retrieve) {
		for (var key in current)
			if (current.hasOwnProperty(key)) 
				current[key] = regenerate(root, current[key], retrieve);
		return current;
	}

	function regenerate(root, current, retrieve) {
		return current instanceof Array ?
				regenerateArray(root, current, retrieve) :
				( current instanceof $String ? 
					  (current.length ? ( retrieve.hasOwnProperty(current) ? retrieve[current] : retrieve[current] = retrieveFromPath( root, current.split(specialChar) ) ) : root) : 
					  (current instanceof Object ? regenerateObject(root, current, retrieve) : current)
				);
	}

	function stringifyRecursion(value, replacer, space, doNotResolve) { return JSON.stringify(value, generateReplacer(value, replacer, !doNotResolve), space); }

	function parseRecursion(text, reparser) { return JSON.parse(text, generateReparser(reparser)); }

	return { stringify: stringifyRecursion, parse: parseRecursion };

}(JSON, RegExp));