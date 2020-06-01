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
				OtherData: "",
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
	GameDungeon = GameDungeon == null ? JSON2.parse(localStorage.getItem("objMapGraphic")) : GameDungeon;
	localStorage.setItem("objMapGraphic", JSON2.stringify(GameDungeon));
	if(localStorage.getItem("ShowSupportPlatforms") == null)
	{
		localStorage.setItem("ShowSupportPlatforms", 0);
	}
	if(localStorage.getItem("ShowColorRooms") == null)
	{
		localStorage.setItem("ShowColorRooms", 0);
	}
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	var ArrayRndmColorBgn = [];
	for(r = 0; r < DungeonRooms.length; r++)
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
				for(m = 0; m < GameDungeon.DungeonWidth; m++)
				{
					minimap += "<td>" + m + "</td>";
				}
				minimap += "</tr>";
				for(l = 0; l < GameDungeon.DungeonHeight; l++)
				{
					minimap += "<tr>";
					for(m = 0; m < GameDungeon.DungeonWidth; m++)
					{
						minimap += m == 0 ? "<td>" + l + "</td>" : "";
						var BloqueSeleccionado = DungeonArray[l][m];
						var border = "border-style:solid;border-width:0px;";
						if(BloqueSeleccionado.Id > 0)
						{
							var RndmColorBackground = ArrayRndmColorBgn[BloqueSeleccionado.Room - 1];
							RndmColorBackground = localStorage.getItem("ShowColorRooms") == 1 ? RndmColorBackground : "#FFD700";
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
								if(localStorage.getItem("ShowSupportPlatforms") == 1)
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
	var chkShowSupportPlatforms = "localStorage.setItem(\"ShowSupportPlatforms\", document.getElementById(\"chkShowSupportPlatforms\").checked ? 1 : 0);";
	var chkShowColorRooms = "localStorage.setItem(\"ShowColorRooms\", document.getElementById(\"chkShowColorRooms\").checked ? 1 : 0);";
	var stringtable = "<table>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowSupportPlatforms + GraphiqueFunction + "' id='chkShowSupportPlatforms' " + (localStorage.getItem("ShowSupportPlatforms") == 1 ? "checked" : "") + "> Support Platforms </input>";
		stringtable += "</td>";
	stringtable += "</tr>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowColorRooms + GraphiqueFunction + "' id='chkShowColorRooms' " + (localStorage.getItem("ShowColorRooms") == 1 ? "checked" : "") + "> Color Rooms </input>";
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

