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
											};
		}
	}	
	GameDungeon = MakeDungeonShape(GameDungeon);    
	GameDungeon = MakeDungeonRoomShape(GameDungeon);
	GameDungeon = MakeDungeonRoomConnections(GameDungeon);  
	GameDungeon = (GameDungeon.LabyrinthInn == 1) ? MakeDungeonRoomInner(GameDungeon) : GameDungeon;
	GameDungeon = (GameDungeon.SupportPlatforms == 1) ? MakeDungeonSupportPlatform(GameDungeon) : GameDungeon; 
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
		if(GameDungeon.DungeonMode == "TOWER")
		{
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
		}else
		{
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
	/*Dungeon Rooms, WALLS*/
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
	RoomVisited[RoomVisited.length] = 
									{
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
							BloqueSeleccionado.SupportPlatformTop = "CENTER";
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
				if(Block.Id == 0)
				{
					valido = false;
				}
				if(itemElement.NotIndoor == 1 && (Block.ConnectTop != 0 || Block.ConnectRight != 0 || Block.ConnectBottom != 0 || Block.ConnectLeft != 0))
				{
					valido = false;
				}
				if(Block.Elements.length > itemElement.OcuppedTolerance)
				{
					valido = false;
				}
				if(itemElement.ObligatoryBottomWall != "NO")
				{
					valido = CheckWallElementConsideration(itemElement.ObligatoryBottomWall, Block.WallBottom, Block.RoomWallBottom, valido);
				}
				if(itemElement.ObligatoryTopWall != "NO")
				{
					valido = CheckWallElementConsideration(itemElement.ObligatoryTopWall, Block.WallTop, Block.RoomWallTop, valido);
				}
				if(itemElement.ObligatoryLeftWall != "NO")
				{
					valido = CheckWallElementConsideration(itemElement.ObligatoryLeftWall, Block.WallLeft, Block.RoomWallLeft, valido);
				}
				if(itemElement.ObligatoryRightWall != "NO")
				{
					valido = CheckWallElementConsideration(itemElement.ObligatoryRightWall, Block.WallRight, Block.RoomWallRight, valido);
				}
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