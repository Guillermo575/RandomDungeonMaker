"use strict";

{
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
  C3.Plugins.random_dungeon_maker.Exps =
  {
    DungeonWidth(){ return(C3.Plugins.random_dungeon_maker.GameDungeon.DungeonWidth); },
	DungeonHeight(){ return(C3.Plugins.random_dungeon_maker.GameDungeon.DungeonHeight); },
	DungeonBlocks(){ return(C3.Plugins.random_dungeon_maker.GameDungeon.TotalBloquesDungeon); },
	DungeonDataJSON(){ return(JSON2.stringify(C3.Plugins.random_dungeon_maker.GameDungeon)); },
	AlreadyExists(){ return(C3.Plugins.random_dungeon_maker.GameDungeon == null ? 0 : 1); },
		
	BlockCurrentID() { return(C3.Plugins.random_dungeon_maker.DungeonBlockCurrent.Id); },
	BlockCurrentX() { return(C3.Plugins.random_dungeon_maker.DungeonBlockCurrent.X); },
	BlockCurrentY() { return(C3.Plugins.random_dungeon_maker.DungeonBlockCurrent.Y); },	
	BlockCurrentRoom() { return(C3.Plugins.random_dungeon_maker.DungeonBlockCurrent.Room); },	
	
	BlockID(X,Y) { return(getDungeonBlockPos(C3.Plugins.random_dungeon_maker.GameDungeon,X,Y).Id); },
	BlockX(Id) { return(getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).X); },
	BlockY(Id) { return(getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).Y); },	
	BlockRoom(Id) { return(getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).Room); },	
	BlockInfo(Id)
	{ 
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		return(Block.X + "," + Block.Y + "," + Block.Room);
	},		
	WallTop(Id)
	{ 
		var TypeWall = "NONE";
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		TypeWall = (Block.WallTop > 0)? "BORDER" : ((Block.RoomWallTop > 0)? "ROOM" : TypeWall);
		return(TypeWall);
	},
	WallLeft(Id)
	{
		var TypeWall = "NONE";
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		TypeWall = (Block.WallLeft > 0)? "BORDER" : ((Block.RoomWallLeft > 0)? "ROOM" : TypeWall);
		return(TypeWall);
	},
	WallRight(Id)
	{
		var TypeWall = "NONE";
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		TypeWall = (Block.WallRight > 0)? "BORDER" : ((Block.RoomWallRight > 0)? "ROOM" : TypeWall);
		return(TypeWall);
	},
	WallBottom(Id)
	{
		var TypeWall = "NONE";
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		TypeWall = (Block.WallBottom > 0) ? "BORDER" : ((Block.RoomWallBottom > 0) ? "ROOM" : TypeWall);
		return(TypeWall);
	},
	
	PlatformTop(Id)
	{
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		return(Block.SupportPlatformTop); 
	},
	PlatformCenter(Id)
	{
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		return(Block.SupportPlatformCenter); 
	},
	PlatformBottom(Id)
	{
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		return(Block.SupportPlatformBottom); 
	},
	
	RoomConnectTop(Id)
	{
		var retorno = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).ConnectTop;
		return(retorno == 0? 0: retorno.Id); 
	},
	RoomConnectLeft(Id)
	{
		var retorno = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).ConnectLeft;
		return(retorno == 0? 0: retorno.Id); 
	},
	RoomConnectRight(Id)
	{
		var retorno = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).ConnectRight;
		return(retorno == 0? 0: retorno.Id); 
	},
	RoomConnectBottom(Id)
	{
		var retorno = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id).ConnectBottom;
		return(retorno == 0? 0: retorno.Id); 
	},
		
	RoomCurrentID(){ return(C3.Plugins.random_dungeon_maker.CurRoom); },	
	RoomWidth(Id){ return(getDungeonRoom(C3.Plugins.random_dungeon_maker.GameDungeon,Id).Width); },	
	RoomHeight(Id){ return(getDungeonRoom(C3.Plugins.random_dungeon_maker.GameDungeon,Id).Height); },	
	RoomBlockCurrentX() { return(C3.Plugins.random_dungeon_maker.DungeonBlockCurrent.RoomX); },
	RoomBlockCurrentY() { return(C3.Plugins.random_dungeon_maker.DungeonBlockCurrent.RoomY); },
	RoomBlockID(X,Y) { return(getDungeonBlockPosRoom(C3.Plugins.random_dungeon_maker.GameDungeon,C3.Plugins.random_dungeon_maker.CurRoom,X,Y).Id); },	
	
	BlockElementsNameTag(Id) 
	{
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		var retorno = [];
		for(var x = 0; x < Block.Elements.length; x++)
		{
			if(Block.Elements[x].Status == 1)
				retorno[x] = Block.Elements[x].NameTag;
		}
		return(retorno.join());
	},
	BlockElementsEID(Id) 
	{
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		var retorno = [];
		for(var x = 0; x < Block.Elements.length; x++)
		{
			if(Block.Elements[x].Status == 1)
				retorno[x] = Block.Elements[x].ElementId;
		}
		return(retorno.join()); 
	},
	GetDungeonValueElement ( ElementId, Name)
	{
		if(!(C3.Plugins.random_dungeon_maker.ConfigElements === undefined) && !(C3.Plugins.random_dungeon_maker.GameDungeon == null))
		{
			for(var x = 0; x < C3.Plugins.random_dungeon_maker.GameDungeon.Elements.length; x++)
			{
				var itemElement = C3.Plugins.random_dungeon_maker.GameDungeon.Elements[x];
				for(var l = 0; l < itemElement.Objetos.length; l++)
				{
					if(itemElement.Objetos[l].ElementId == ElementId)
					{
						if(itemElement.Objetos[l].Data[Name] == null)
							return("");
						else
							return(itemElement.Objetos[l].Data[Name]);
					}
				}
			}
		}
	},
	
	AdjacentBlockTop(Id)
	{ 
		var adjacentBlock = emptyDungeonBlock();
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		if((Block.Y - 1) >= 0)
		{
			adjacentBlock = C3.Plugins.random_dungeon_maker.GameDungeon.DungeonBlocks[Block.Y - 1][Block.X];
		}
		return(adjacentBlock.Id);
	},
	AdjacentBlockLeft(Id)
	{ 
		var adjacentBlock = emptyDungeonBlock();
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		if((Block.X - 1) >= 0)
		{
			adjacentBlock = C3.Plugins.random_dungeon_maker.GameDungeon.DungeonBlocks[Block.Y][Block.X - 1];
		}
		return(adjacentBlock.Id);
	},
	AdjacentBlockRight(Id)
	{ 
		var adjacentBlock = emptyDungeonBlock();
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		if((Block.X + 1) < C3.Plugins.random_dungeon_maker.GameDungeon.DungeonWidth)
		{
			adjacentBlock = C3.Plugins.random_dungeon_maker.GameDungeon.DungeonBlocks[Block.Y][Block.X + 1];
		}
		return(adjacentBlock.Id);
	},
	AdjacentBlockBottom(Id)
	{ 
		var adjacentBlock = emptyDungeonBlock();
		var Block = getDungeonBlock(C3.Plugins.random_dungeon_maker.GameDungeon,Id);
		if((Block.Y + 1) < C3.Plugins.random_dungeon_maker.GameDungeon.DungeonHeight)
		{
			adjacentBlock = C3.Plugins.random_dungeon_maker.GameDungeon.DungeonBlocks[Block.Y + 1][Block.X];
		}
		return(adjacentBlock.Id);
	},	
  };
}
