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
		}

		var StartXCombo = "CENTER";
		switch (StartX) {
			case 0: StartXCombo = "CENTER"; break;
			case 1: StartXCombo = "LEFT"; break;
			case 2: StartXCombo = "RIGHT"; break;
		}		
		var PointX = 0;
		PointX = StartXCombo == "LEFT" ? -1: PointX;
		PointX = StartXCombo == "RIGHT" ? 1: PointX;

		var StartYCombo = "CENTER";
		switch (StartY) {
			case 0: StartYCombo = "CENTER"; break;
			case 1: StartYCombo = "TOP"; break;
			case 2: StartYCombo = "BOTTOM"; break;
		}				
		var PointY = 0;
		PointY = StartYCombo == "TOP" ? -1: PointY;
		PointY = StartYCombo == "BOTTOM" ? 1: PointY;
		
		var LabyrinthInnCombo = "YES";
		switch (LabyrinthInn) {
			case 0: LabyrinthInnCombo = "YES"; break;
			case 1: LabyrinthInnCombo = "NO"; break;
		}
		var LabInn = LabyrinthInnCombo == "NO" ? 0 : 1;

		var OpenWorldCombo = "NO";
		switch (OpenWorld) {
			case 0: OpenWorldCombo = "NO"; break;
			case 1: OpenWorldCombo = "YES"; break;
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
	
	Acts.prototype.NewDungeonElement = function (Name,Total,OcuppedTolerance,NotIndoor,
												 ObligatoryBottomWall,ObligatoryTopWall,ObligatoryLeftWall,ObligatoryRightWall)
	{
		var NotIndoorCombo = "NO";
		switch (NotIndoor) {
			case 0: StartYCombo = "NO"; break;
			case 1: StartYCombo = "YES"; break;
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