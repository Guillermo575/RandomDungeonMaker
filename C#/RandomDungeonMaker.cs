using System;
using System.Collections.Generic;
using UnityEngine;
public class RandomDungeonMaker
{
    #region Variables
    public Block[][] DungeonBlocks;
	public List<Room> DungeonRooms = new List<Room>();
	public int DungeonWidth, DungeonHeight, TotalBloquesDungeon;
	public int DungeonRoomsWidthMin = 3, DungeonRoomsWidthMax = 8, DungeonRoomsHeightMin = 3, DungeonRoomsHeightMax = 8, DungeonRoomsSizeAmbivalence = 0;
	public String DungeonMode = "ZELDA", Status = "NOT";
	public int LabyrinthInn = 1, SupportPlatforms = 0, OpenWorld = 0, StartPointX = 0, StartPointY = 0;
	public int RNGSeed = 100;
	MathRNG MathRNGSeed;
	public List<Entities> lstEntities = new List<Entities>();
	public String HTMLTable { get; internal set; }
	public String HTMLTablePage { get; internal set; }
	#endregion

	#region General
	public RandomDungeonMaker(int Width, int Height, int Blocks)
	{
		this.DungeonWidth = Width;
		this.DungeonHeight = Height;
		this.TotalBloquesDungeon = Blocks;
		this.RNGSeed = new System.Random().Next(999999999);
	}
	public RandomDungeonMaker(int Width, int Height, int Blocks, int RNGSeed)
	{
		this.DungeonWidth = Width;
		this.DungeonHeight = Height;
		this.TotalBloquesDungeon = Blocks;
		this.RNGSeed = RNGSeed;
	}
    #endregion

    #region makeDungeon
    public RandomDungeonMaker makeDungeon()
	{
		//lstEntities.Add(new Entities("Key","1", 10));
		//lstEntities.Add(new Entities("Coin", "2", 200));
		DungeonBlocks = new Block[DungeonHeight][];
		DungeonRooms = new List<Room>();
		lstEntities = new List<Entities>();
		this.MathRNGSeed = new MathRNG(RNGSeed);
		TotalBloquesDungeon = (DungeonWidth * DungeonHeight)<= TotalBloquesDungeon ? (DungeonWidth * DungeonHeight) : TotalBloquesDungeon;
		for(var l = 0; l < DungeonHeight; l++)
		{
			DungeonBlocks[l] = new Block[DungeonWidth];
			for(var m = 0; m < DungeonWidth; m++)
			{
				DungeonBlocks[l][m] = new Block(m, l);
			}
		}	
		MakeDungeonShape();
		MakeDungeonRoomShape();
		MakeDungeonRoomConnections();
		if (LabyrinthInn == 1) 
		{ 
			MakeDungeonRoomInner(); 
		}
		if (SupportPlatforms == 1) 
		{
			MakeDungeonSupportPlatform();
		}
		if (OpenWorld != 0)
		{ 
			ConfigureOpenWorld(); 
		}
		if (!(lstEntities == null)) 
		{ 
			DistributeDungeonElements(); 
		}
		Status = "LOADED";
		//HTMLTable = GraphiqueDungeon();
		//HTMLTablePage = "<!DOCTYPE html> <html> <head> </head> <body>" + HTMLTable + "</body> </html>";
		return this;
	}
    #endregion

    #region MakeDungeonShape
    private void MakeDungeonShape()
	{
		List<int[]> CuadrosDisponibles = new List<int[]>();
		var DungeonArray = DungeonBlocks;
		int StartX = DungeonWidth / 2;
		int StartY = DungeonHeight / 2;
		StartX = (StartPointX < 0) ? 0 : StartX;
		StartX = (StartPointX > 0) ? (DungeonWidth - 1) : StartX;
		StartY = (StartPointY < 0) ? 0 : StartY;
		StartY = (StartPointY > 0) ? (DungeonHeight - 1) : StartY;
		CuadrosDisponibles.Add(new int[] { StartY, StartX });
		int[] CuadroSeleccionado = new int[2];
		int CuadroSeleccionadoX = 0;
		int CuadroSeleccionadoY = 0;
		for (var l = 1; l <= TotalBloquesDungeon; l++)
		{
			var comprobado = 0;
			while (comprobado == 0)
			{
				var randomNumber = MathRNGSeed.GetRandom(CuadrosDisponibles.Count - 1);
				if (DungeonMode == "CASTLE" || DungeonMode == "TOWER")
				{
					randomNumber = MathRNGSeed.GetRandom(3) != 1 ? (CuadrosDisponibles.Count - 1) : randomNumber;
				}
				CuadroSeleccionado = CuadrosDisponibles[randomNumber];
				CuadroSeleccionadoY = CuadroSeleccionado[0];
				CuadroSeleccionadoX = CuadroSeleccionado[1];
				if (DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX].Id == 0)
				{
					DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX].Id = l;
					comprobado = 1;
				}
				CuadrosDisponibles.RemoveAt(randomNumber);
			}
			if (DungeonMode == "TOWER")
			{
				if ((CuadroSeleccionadoX - 1) >= 0 && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX - 1].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY, CuadroSeleccionadoX - 1 });
				}
				if ((CuadroSeleccionadoX + 1) < DungeonWidth && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX + 1].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY, CuadroSeleccionadoX + 1 });
				}
				if ((CuadroSeleccionadoY - 1) >= 0 && DungeonArray[CuadroSeleccionadoY - 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY - 1, CuadroSeleccionadoX });
				}
				if ((CuadroSeleccionadoY + 1) < DungeonHeight && DungeonArray[CuadroSeleccionadoY + 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY + 1, CuadroSeleccionadoX });
				}
			}
			else
			{
				if ((CuadroSeleccionadoY - 1) >= 0 && DungeonArray[CuadroSeleccionadoY - 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY - 1, CuadroSeleccionadoX });
				}
				if ((CuadroSeleccionadoY + 1) < DungeonHeight && DungeonArray[CuadroSeleccionadoY + 1][CuadroSeleccionadoX].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY + 1, CuadroSeleccionadoX });
				}
				if ((CuadroSeleccionadoX - 1) >= 0 && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX - 1].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY, CuadroSeleccionadoX - 1 });
				}
				if ((CuadroSeleccionadoX + 1) < DungeonWidth && DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX + 1].Id == 0)
				{
					CuadrosDisponibles.Add(new int[] { CuadroSeleccionadoY, CuadroSeleccionadoX + 1 });
				}
			}
		}
		for (var l = 0; l < DungeonHeight; l++)
		{
			for (var m = 0; m < DungeonWidth; m++)
			{
				if (DungeonArray[l][m].Id > 0)
				{
					DungeonArray[l][m].WallTop = ((l - 1) < 0) ? 1 : (DungeonArray[l - 1][m].Id == 0) ? 1 : 0;
					DungeonArray[l][m].WallBottom = ((l + 1) >= DungeonHeight) ? 1 : (DungeonArray[l + 1][m].Id == 0) ? 1 : 0;
					DungeonArray[l][m].WallLeft = ((m - 1) < 0) ? 1 : (DungeonArray[l][m - 1].Id == 0) ? 1 : 0;
					DungeonArray[l][m].WallRight = ((m + 1) >= DungeonWidth) ? 1 : (DungeonArray[l][m + 1].Id == 0) ? 1 : 0;
				}
				else
				{
					DungeonArray[l][m].Status = "VOID";
				}
			}
		}
	}
    #endregion

    #region MakeDungeonRoomShape
    private void MakeDungeonRoomShape()
	{
		var DungeonArray = this.DungeonBlocks;
		for (var l = 0; l < DungeonHeight; l++)
		{
			for (var m = 0; m < DungeonWidth; m++)
			{
				if (DungeonArray[l][m].Id > 0)
				{
					DungeonArray[l][m].Status = "NOT";
				}
			}
		}
		for (var y = 0; y < DungeonHeight; y++)
		{
			for (var x = 0; x < DungeonWidth; x++)
			{
				if (DungeonArray[y][x].Status == "NOT")
				{
					var randomWidth = MathRNGSeed.GetRandom(DungeonRoomsWidthMin, DungeonRoomsWidthMax);
					var randomHeight = MathRNGSeed.GetRandom(DungeonRoomsHeightMin, DungeonRoomsHeightMax);
					randomHeight = DungeonRoomsSizeAmbivalence == 1 ? randomWidth : randomHeight;
					var encontradoX = x;
					var encontradoY = y;
					var l = 0;
					var m = 0;
					var EspacioDisponible = true;
					var retroceso = 0;
					var newRoom = new Room(DungeonRooms.Count);
					newRoom.Blocks = new RoomBlock[randomHeight][];
					for (var yl = 0; yl < randomHeight; yl++)
					{
						newRoom.Blocks[yl] = new RoomBlock[randomWidth];
						for (var xm = 0; xm < randomWidth; xm++)
						{
							newRoom.Blocks[yl][xm] = new RoomBlock(new Block(xm, yl), xm, yl);
						}
					}
					List<Block> BloquesLiberados = new List<Block>();
					var BlockCursor = DungeonArray[encontradoY][encontradoX];
					BlockCursor.Status = "OK";
					BlockCursor.Room = newRoom.Id;
					BlockCursor.RoomY = l;
					BlockCursor.RoomX = m;
					BloquesLiberados.Add(BlockCursor);
					newRoom.Blocks[l][m] = new RoomBlock(BlockCursor, m, l);
					while (EspacioDisponible)
					{
						List<Block> BloquesDisponibles = new List<Block>();
						List<string> DireccionesDisponibles = new List<string>();
                        try
                        {
							if ((m - 1) >= 0 && 
								DungeonArray[(encontradoY + l)][(encontradoX + m) - 1] != null &&
								DungeonArray[(encontradoY + l)][(encontradoX + m) - 1].Status != "OK" &&
								DungeonArray[(encontradoY + l)][(encontradoX + m) - 1].Id > 0)
							{
								BloquesDisponibles.Add(DungeonArray[(encontradoY + l)][(encontradoX + m) - 1]);
								DireccionesDisponibles.Add("LEFT");
							}
							if ((m + 1) < randomWidth &&
								DungeonArray[(encontradoY + l)][(encontradoX + m) + 1] != null &&
								DungeonArray[(encontradoY + l)][(encontradoX + m) + 1].Status != "OK" &&
								DungeonArray[(encontradoY + l)][(encontradoX + m) + 1].Id > 0)
							{
								BloquesDisponibles.Add(DungeonArray[(encontradoY + l)][(encontradoX + m) + 1]);
								DireccionesDisponibles.Add("RIGHT");
							}
							if ((l - 1) >= 0 &&
								DungeonArray[(encontradoY + l) - 1] != null && DungeonArray[(encontradoY + l) - 1][(encontradoX + m)] != null &&
								DungeonArray[(encontradoY + l) - 1][(encontradoX + m)].Status != "OK" &&
								DungeonArray[(encontradoY + l) - 1][(encontradoX + m)].Id > 0 && (l - 1) >= 0)
							{
								BloquesDisponibles.Add(DungeonArray[(encontradoY + l) - 1][(encontradoX + m)]);
								DireccionesDisponibles.Add("TOP");
							}
							if ((l + 1) < randomHeight &&
								DungeonArray[(encontradoY + l) + 1] != null && DungeonArray[(encontradoY + l) + 1][(encontradoX + m)] != null &&
								DungeonArray[(encontradoY + l) + 1][(encontradoX + m)].Status != "OK" &&
								DungeonArray[(encontradoY + l) + 1][(encontradoX + m)].Id > 0)
							{
								BloquesDisponibles.Add(DungeonArray[(encontradoY + l) + 1][(encontradoX + m)]);
								DireccionesDisponibles.Add("BOTTOM");
							}
                        }catch(Exception ex)
                        {

                        }
						if (BloquesDisponibles.Count > 0)
						{
							var numseleccionado = MathRNGSeed.GetRandom(BloquesDisponibles.Count - 1);
							var nuevoBloque = BloquesDisponibles[numseleccionado];
							switch (DireccionesDisponibles[numseleccionado])
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
							BloquesLiberados.Add(BlockCursor);
							newRoom.Blocks[l][m] = new RoomBlock(BlockCursor, m, l);
							retroceso = 0;
						}
						else
						{
							retroceso++;
							if (BloquesLiberados.Count - retroceso < 0)
							{
								EspacioDisponible = false;
							}
							else
							{
								BlockCursor = BloquesLiberados[BloquesLiberados.Count - retroceso];
								l = BlockCursor.RoomY;
								m = BlockCursor.RoomX;
							}
						}
					}
					DungeonRooms.Add(newRoom);
				}
			}
		}
		/*Dungeon Rooms, WALLS*/
		for (var r = 0; r < DungeonRooms.Count; r++)
		{
			for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
			{
				for (var a = 0; a < DungeonRooms[r].Blocks[b].Length; a++)
				{
					var DungeonRoomsBlocks = DungeonRooms[r].Blocks;
					var DungeonSelectedBlock = DungeonRoomsBlocks[b][a].Block;
					DungeonSelectedBlock.WallTop = ((b - 1) < 0 || DungeonRoomsBlocks[b - 1][a].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallTop;
					DungeonSelectedBlock.WallLeft = ((a - 1) < 0 || DungeonRoomsBlocks[b][a - 1].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallLeft;
					DungeonSelectedBlock.WallRight = ((a + 1) >= DungeonRooms[r].Blocks[b].Length || DungeonRoomsBlocks[b][a + 1].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallRight;
					DungeonSelectedBlock.WallBottom = ((b + 1) >= DungeonRooms[r].Blocks.Length || DungeonRoomsBlocks[b + 1][a].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallBottom;
				}
			}
		}
	}
	#endregion

	#region MakeDungeonRoomConnections
	private void MakeDungeonRoomConnections()
	{
		var DungeonArray = DungeonBlocks;
		List<RoomVisited> RoomVisited = new List<RoomVisited>();
		RoomVisited.Add(new RoomVisited(DungeonRooms[0], null));
		var RoomVisitedActual = RoomVisited[0];
		while (RoomVisited.Count < DungeonRooms.Count)
		{
			var r = RoomVisitedActual.Room.index;
			var puertaColocada = 0;
			var cuartoCumplido = 0;
			var DungeonRoomSelected = DungeonRooms[r];
			List<RoomBlock> DungeonRoomBlocksLotery = new List<RoomBlock>();
			for (var b = 0; b < DungeonRoomSelected.Blocks.Length; b++)
			{
				for (var a = 0; a < DungeonRoomSelected.Blocks[b].Length; a++)
				{
					if (DungeonRoomSelected.Blocks[b][a].Block.Id > 0)
					{
						DungeonRoomBlocksLotery.Add(DungeonRoomSelected.Blocks[b][a]);
					}
				}
			}
			while (DungeonRoomBlocksLotery.Count > 0 && puertaColocada == 0)
			{
				int randomNumber = MathRNGSeed.GetRandom(DungeonRoomBlocksLotery.Count - 1);
				int randomConnection = MathRNGSeed.GetRandom(2);
				randomNumber = randomConnection == 1 ? 0 : randomNumber;
				randomNumber = randomConnection == 2 ? DungeonRoomBlocksLotery.Count - 1 : randomNumber;
				var DungeonSelected = DungeonRoomBlocksLotery[randomNumber];
				DungeonRoomBlocksLotery.RemoveAt(randomNumber);
				var DungeonBlockSelected = DungeonSelected.Block;
				if (DungeonBlockSelected.X > 0 && puertaColocada == 0)
				{
					var DungeonSelectedLeft = DungeonArray[DungeonBlockSelected.Y][DungeonBlockSelected.X - 1];
					if (DungeonSelectedLeft.Id > 0 && DungeonSelectedLeft.Room != DungeonRoomSelected.Id)
					{
						puertaColocada = DungeonSelectedLeft.Room;
						var encontrado = 0;
						for (var l = 0; l < RoomVisited.Count; l++)
						{
							if (RoomVisited[l].Room.Id == (puertaColocada))
							{
								encontrado = 1;
								puertaColocada = 0;
							}
						}
						if (encontrado == 0)
						{
							cuartoCumplido = 1;
							DungeonBlockSelected.ConnectLeft = DungeonSelectedLeft;
							DungeonBlockSelected.WallLeft = 0;
							DungeonSelectedLeft.ConnectRight = DungeonBlockSelected;
							DungeonSelectedLeft.WallRight = 0;
							RoomVisited.Add(new RoomVisited(DungeonRooms[puertaColocada - 1], RoomVisitedActual));
							DungeonRoomSelected.Connections.Add(DungeonSelectedLeft.Room.ToString());
							DungeonRooms[puertaColocada - 1].Connections.Add(DungeonRoomSelected.Id.ToString());
						}
					}
				}
				if (DungeonBlockSelected.X < (DungeonWidth - 1) && puertaColocada == 0)
				{
					var DungeonSelectedRight = DungeonArray[DungeonBlockSelected.Y][DungeonBlockSelected.X + 1];
					if (DungeonSelectedRight.Id > 0 && DungeonSelectedRight.Room != DungeonRoomSelected.Id)
					{
						puertaColocada = DungeonSelectedRight.Room;
						var encontrado = 0;
						for (var l = 0; l < RoomVisited.Count; l++)
						{
							if (RoomVisited[l].Room.Id == (puertaColocada))
							{
								encontrado = 1;
								puertaColocada = 0;
							}
						}
						if (encontrado == 0)
						{
							cuartoCumplido = 1;
							DungeonBlockSelected.ConnectRight = DungeonSelectedRight;
							DungeonBlockSelected.WallRight = 0;
							DungeonSelectedRight.ConnectLeft = DungeonBlockSelected;
							DungeonSelectedRight.WallLeft = 0;
							RoomVisited.Add(new RoomVisited(DungeonRooms[puertaColocada - 1], RoomVisitedActual));
							DungeonRoomSelected.Connections.Add(DungeonSelectedRight.Room.ToString());
							DungeonRooms[puertaColocada - 1].Connections.Add(DungeonRoomSelected.Id.ToString());
						}
					}
				}
				if (DungeonBlockSelected.Y > 0 && puertaColocada == 0)
				{
					var DungeonSelectedTop = DungeonArray[DungeonBlockSelected.Y - 1][DungeonBlockSelected.X];
					if (DungeonSelectedTop.Id > 0 && DungeonSelectedTop.Room != DungeonRoomSelected.Id)
					{
						puertaColocada = DungeonSelectedTop.Room;
						var encontrado = 0;
						for (var l = 0; l < RoomVisited.Count; l++)
						{
							if (RoomVisited[l].Room.Id == (puertaColocada))
							{
								encontrado = 1;
								puertaColocada = 0;
							}
						}
						if (encontrado == 0)
						{
							cuartoCumplido = 1;
							DungeonBlockSelected.ConnectTop = DungeonSelectedTop;
							DungeonBlockSelected.WallTop = 0;
							DungeonSelectedTop.ConnectBottom = DungeonBlockSelected;
							DungeonSelectedTop.WallBottom = 0;
							RoomVisited.Add(new RoomVisited(DungeonRooms[puertaColocada - 1], RoomVisitedActual));
							DungeonRoomSelected.Connections.Add(DungeonSelectedTop.Room.ToString());
							DungeonRooms[puertaColocada - 1].Connections.Add(DungeonRoomSelected.Id.ToString());
						}
					}
				}
				if (DungeonBlockSelected.Y < (DungeonHeight - 1) && puertaColocada == 0)
				{
					var DungeonSelectedBottom = DungeonArray[DungeonBlockSelected.Y + 1][DungeonBlockSelected.X];
					if (DungeonSelectedBottom.Id > 0 && DungeonSelectedBottom.Room != DungeonRoomSelected.Id)
					{
						puertaColocada = DungeonSelectedBottom.Room;
						var encontrado = 0;
						for (var l = 0; l < RoomVisited.Count; l++)
						{
							if (RoomVisited[l].Room.Id == (puertaColocada))
							{
								encontrado = 1;
								puertaColocada = 0;
							}
						}
						if (encontrado == 0)
						{
							cuartoCumplido = 1;
							DungeonBlockSelected.ConnectBottom = DungeonSelectedBottom;
							DungeonBlockSelected.WallBottom = 0;
							DungeonSelectedBottom.ConnectTop = DungeonBlockSelected;
							DungeonSelectedBottom.WallTop = 0;
							RoomVisited.Add(new RoomVisited(DungeonRooms[puertaColocada - 1], RoomVisitedActual));
							DungeonRoomSelected.Connections.Add(DungeonSelectedBottom.Room.ToString());
							DungeonRooms[puertaColocada - 1].Connections.Add(DungeonRoomSelected.Id.ToString());
						}
					}
				}
			}
			RoomVisitedActual = (cuartoCumplido != 0) ? RoomVisited[RoomVisited.Count - 1] : RoomVisitedActual.RoomAnterior;
		}
	}
	#endregion

	#region MakeDungeonRoomInner
	private void MakeDungeonRoomInner()
	{
		var DungeonArray = DungeonBlocks;
		for (var l = 0; l < DungeonHeight; l++)
		{
			for (var m = 0; m < DungeonWidth; m++)
			{
				if (DungeonArray[l][m].Id > 0)
				{
					DungeonArray[l][m].RoomWallLeft = DungeonArray[l][m].ConnectLeft == null ? 1 : DungeonArray[l][m].WallLeft;
					DungeonArray[l][m].RoomWallRight = DungeonArray[l][m].ConnectRight == null ? 1 : DungeonArray[l][m].WallRight;
					DungeonArray[l][m].RoomWallBottom = DungeonArray[l][m].ConnectBottom == null ? 1 : DungeonArray[l][m].WallBottom;
					DungeonArray[l][m].RoomWallTop = DungeonArray[l][m].ConnectTop == null ? 1 : DungeonArray[l][m].WallTop;
					DungeonArray[l][m].Status = "NOT";
				}
			}
		}
		for (var r = 0; r < DungeonRooms.Count; r++)
		{
			List<Block> RoomsWithConnect = new List<Block>();
			var cont = 0;
			if (DungeonRooms[r].Blocks.Length == 1 || DungeonRooms[r].Blocks[0].Length == 1)
			{
				for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
				{
					for (var a = 0; a < DungeonRooms[r].Blocks[b].Length; a++)
					{
						var bloqueact = DungeonRooms[r].Blocks[b][a].Block;
						if (bloqueact.Id > 0)
						{
							bloqueact.Status = "OK";
							bloqueact.RoomWallLeft = bloqueact.ConnectLeft == null ? 0 : bloqueact.WallLeft;
							bloqueact.RoomWallRight = bloqueact.ConnectRight == null ? 0 : bloqueact.WallRight;
							bloqueact.RoomWallBottom = bloqueact.ConnectBottom == null ? 0 : bloqueact.WallBottom;
							bloqueact.RoomWallTop = bloqueact.ConnectTop == null ? 0 : bloqueact.WallTop;
						}
					}
				}
			}
			else
			{
				for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
				{
					for (var a = 0; a < DungeonRooms[r].Blocks[b].Length; a++)
					{
						if (DungeonRooms[r].Blocks[b][a].Block.Id > 0)
						{
							RoomsWithConnect.Add(DungeonRooms[r].Blocks[b][a].Block);
							cont++;
						}
					}
				}
				if (RoomsWithConnect.Count > 1)
				{
					List<Block> BloquesLiberados = new List<Block>();
					var bloquesCompletados = 0;
					var BlockCursor = RoomsWithConnect[0];
					BlockCursor.Status = "OK";
					BloquesLiberados.Add(BlockCursor);
					while (bloquesCompletados < RoomsWithConnect.Count)
					{
						bloquesCompletados = 0;
						var bloqueColocado = 0;
						var retroceso = 0;
						while (bloqueColocado == 0)
						{
							List<Block> BloquesDisponibles = new List<Block>();
							List<String> DireccionesDisponibles = new List<String>();
							if (BlockCursor.RoomX - 1 >= 0 &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1].Block.Status != "OK" &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1].Block.Id > 0)
							{
								BloquesDisponibles.Add(DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX - 1].Block);
								DireccionesDisponibles.Add("LEFT");
							}
							if ((BlockCursor.RoomX + 1 < DungeonRooms[r].Blocks[BlockCursor.RoomY].Length) &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1].Block.Status != "OK" &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1].Block.Id > 0)
							{
								BloquesDisponibles.Add(DungeonRooms[r].Blocks[BlockCursor.RoomY][BlockCursor.RoomX + 1].Block);
								DireccionesDisponibles.Add("RIGHT");
							}
							if (BlockCursor.RoomY - 1 >= 0 &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX].Block.Status != "OK" &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX].Block.Id > 0)
							{
								BloquesDisponibles.Add(DungeonRooms[r].Blocks[BlockCursor.RoomY - 1][BlockCursor.RoomX].Block);
								DireccionesDisponibles.Add("TOP");
							}
							if ((BlockCursor.RoomY + 1 < DungeonRooms[r].Blocks.Length) &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX].Block.Status != "OK" &&
								DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX].Block.Id > 0)
							{
								BloquesDisponibles.Add(DungeonRooms[r].Blocks[BlockCursor.RoomY + 1][BlockCursor.RoomX].Block);
								DireccionesDisponibles.Add("BOTTOM");
							}
							if (BloquesDisponibles.Count > 0)
							{
								var numseleccionado = MathRNGSeed.GetRandom(BloquesDisponibles.Count - 1);
								var nuevoBloque = BloquesDisponibles[numseleccionado];
								switch (DireccionesDisponibles[numseleccionado])
								{
									case "LEFT": BlockCursor.RoomWallLeft = 0; nuevoBloque.RoomWallRight = 0; break;
									case "RIGHT": BlockCursor.RoomWallRight = 0; nuevoBloque.RoomWallLeft = 0; break;
									case "TOP": BlockCursor.RoomWallTop = 0; nuevoBloque.RoomWallBottom = 0; break;
									case "BOTTOM": BlockCursor.RoomWallBottom = 0; nuevoBloque.RoomWallTop = 0; break;
								}
								BlockCursor = nuevoBloque;
								BlockCursor.Status = "OK";
								BloquesLiberados.Add(BlockCursor);
								bloqueColocado = 1;
							}
							else
							{
								retroceso++;
								BlockCursor = BloquesLiberados[BloquesLiberados.Count - retroceso];
							}
						}
						for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
						{
							for (var a = 0; a < DungeonRooms[r].Blocks[b].Length; a++)
							{
								if (DungeonRooms[r].Blocks[b][a].Block.Status == "OK")
								{
									for (var c = 0; c < RoomsWithConnect.Count; c++)
									{
										if (DungeonRooms[r].Blocks[b][a].Block.Id == RoomsWithConnect[c].Id)
										{
											bloquesCompletados++;
										}
									}
								}
							}
						}
					}
				}
				else
				{
					var BlockCursor = RoomsWithConnect[0];
					BlockCursor.Status = "OK";
					if (DungeonRooms[r].Blocks.Length > 1 || DungeonRooms[r].Blocks[0].Length > 1)
					{
						for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
						{
							for (var a = 0; a < DungeonRooms[r].Blocks[b].Length; a++)
							{
								var bloqueact = DungeonRooms[r].Blocks[b][a].Block;
								if (bloqueact.Id > 0)
								{
									bloqueact.Status = "OK";
									bloqueact.RoomWallLeft = bloqueact.ConnectLeft == null ? 0 : bloqueact.WallLeft;
									bloqueact.RoomWallRight = bloqueact.ConnectRight == null ? 0 : bloqueact.WallRight;
									bloqueact.RoomWallBottom = bloqueact.ConnectBottom == null ? 0 : bloqueact.WallBottom;
									bloqueact.RoomWallTop = bloqueact.ConnectTop == null ? 0 : bloqueact.WallTop;
								}
							}
						}
					}
				}
			}
		}
	}
    #endregion

    #region Platforms
    private void MakeDungeonSupportPlatform()
	{
		var ZigZagPlatform = "RIGHT";
		var ZigZagPlatform2 = "RIGHT";
		for (var r = 0; r < DungeonRooms.Count; r++)
		{
			for (var a = 0; a < DungeonRooms[r].Blocks[0].Length; a++)
			{
				for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
				{
					var BloqueSeleccionado = DungeonRooms[r].Blocks[b][a].Block;
					if (BloqueSeleccionado.Id > 0)
					{
						if (BloqueSeleccionado.WallTop == 0 && BloqueSeleccionado.RoomWallTop == 0)
						{
							BloqueSeleccionado.SupportPlatformCenter = "CENTER";
							if (BloqueSeleccionado.WallLeft == 0 && BloqueSeleccionado.RoomWallLeft == 0 && (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0))
							{
								BloqueSeleccionado.SupportPlatformCenter = "RIGHT";
								BloqueSeleccionado.SupportPlatformCenter = (ZigZagPlatform == "RIGHT") ? "RIGHT" : "CENTER";
								ZigZagPlatform = (ZigZagPlatform == "LEFT") ? "RIGHT" : "LEFT";
							}
							if (BloqueSeleccionado.WallRight == 0 && BloqueSeleccionado.RoomWallRight == 0 && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
							{
								BloqueSeleccionado.SupportPlatformCenter = "LEFT";
								BloqueSeleccionado.SupportPlatformCenter = (ZigZagPlatform == "LEFT") ? "LEFT" : "CENTER";
								ZigZagPlatform = (ZigZagPlatform == "LEFT") ? "RIGHT" : "LEFT";
							}
							if ((BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0) && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
							{
								BloqueSeleccionado.SupportPlatformCenter = ZigZagPlatform;
								ZigZagPlatform = (ZigZagPlatform == "LEFT") ? "RIGHT" : "LEFT";
							}
						}
						if (BloqueSeleccionado.WallBottom == 0 && BloqueSeleccionado.RoomWallBottom == 0)
						{
							BloqueSeleccionado.SupportPlatformBottom = "CENTER";
							if (BloqueSeleccionado.WallLeft == 0 && BloqueSeleccionado.RoomWallLeft == 0 && (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0))
							{
								BloqueSeleccionado.SupportPlatformBottom = "RIGHT";
								BloqueSeleccionado.SupportPlatformBottom = (ZigZagPlatform == "RIGHT") ? "RIGHT" : "CENTER";
								ZigZagPlatform = (ZigZagPlatform == "LEFT") ? "RIGHT" : "LEFT";
							}
							if (BloqueSeleccionado.WallRight == 0 && BloqueSeleccionado.RoomWallRight == 0 && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
							{
								BloqueSeleccionado.SupportPlatformBottom = "LEFT";
								BloqueSeleccionado.SupportPlatformBottom = (ZigZagPlatform == "LEFT") ? "LEFT" : "CENTER";
								ZigZagPlatform = (ZigZagPlatform == "LEFT") ? "RIGHT" : "LEFT";
							}
							if ((BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0) && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
							{
								BloqueSeleccionado.SupportPlatformBottom = ZigZagPlatform;
								ZigZagPlatform = (ZigZagPlatform == "LEFT") ? "RIGHT" : "LEFT";
							}
							if (BloqueSeleccionado.ConnectRight != null)
							{
								BloqueSeleccionado.SupportPlatformBottom = "RIGHT";
							}
							if (BloqueSeleccionado.ConnectLeft != null)
							{
								BloqueSeleccionado.SupportPlatformBottom = "LEFT";
							}
							if (BloqueSeleccionado.ConnectBottom != null)
							{
								BloqueSeleccionado.SupportPlatformBottom = "CENTER";
							}
						}
						if (BloqueSeleccionado.WallTop == 0 && BloqueSeleccionado.RoomWallTop == 0)
						{
							BloqueSeleccionado.SupportPlatformTop = "CENTER";
							if (BloqueSeleccionado.WallLeft == 0 && BloqueSeleccionado.RoomWallLeft == 0 && (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0))
							{
								BloqueSeleccionado.SupportPlatformTop = "RIGHT";
								BloqueSeleccionado.SupportPlatformTop = (ZigZagPlatform2 == "RIGHT") ? "RIGHT" : "CENTER";
								ZigZagPlatform2 = (ZigZagPlatform2 == "LEFT") ? "RIGHT" : "LEFT";
							}
							if (BloqueSeleccionado.WallRight == 0 && BloqueSeleccionado.RoomWallRight == 0 && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
							{
								BloqueSeleccionado.SupportPlatformTop = "LEFT";
								BloqueSeleccionado.SupportPlatformTop = (ZigZagPlatform2 == "LEFT") ? "LEFT" : "CENTER";
								ZigZagPlatform2 = (ZigZagPlatform2 == "LEFT") ? "RIGHT" : "LEFT";
							}
							if ((BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0) && (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0))
							{
								BloqueSeleccionado.SupportPlatformTop = ZigZagPlatform2;
								ZigZagPlatform2 = (ZigZagPlatform2 == "LEFT") ? "RIGHT" : "LEFT";
							}
							if (BloqueSeleccionado.ConnectRight != null)
							{
								BloqueSeleccionado.SupportPlatformTop = "RIGHT";
							}
							if (BloqueSeleccionado.ConnectLeft != null)
							{
								BloqueSeleccionado.SupportPlatformTop = "LEFT";
							}
							if (BloqueSeleccionado.ConnectTop != null)
							{
								BloqueSeleccionado.SupportPlatformTop = "CENTER";
							}
						}
					}
				}
			}
		}
	}
	#endregion

	#region OpenWorld
	private void ConfigureOpenWorld()
	{
		var DungeonArray = DungeonBlocks;
		for (var l = 0; l < DungeonHeight; l++)
		{
			for (var m = 0; m < DungeonWidth; m++)
			{
				var DungeonSelectedBlock = DungeonArray[l][m];
				if (DungeonSelectedBlock.Id > 0)
				{
					DungeonSelectedBlock.ConnectTop = null;
					DungeonSelectedBlock.ConnectRight = null;
					DungeonSelectedBlock.ConnectBottom = null;
					DungeonSelectedBlock.ConnectLeft = null;
					var randNum = OpenWorld == 2 ? MathRNGSeed.GetRandom(2) : MathRNGSeed.GetRandom(1);
					//randNum = 1;
					if (randNum != 0)
					{
						if ((l - 1) >= 0 && DungeonArray[l - 1][m].Id > 0)
						{
							if (OpenWorld == 2 || DungeonSelectedBlock.WallTop == 0)
							{
								DungeonSelectedBlock.WallTop = 0;
								DungeonSelectedBlock.RoomWallTop = 0;
								DungeonArray[l - 1][m].WallBottom = 0;
								DungeonArray[l - 1][m].RoomWallBottom = 0;
							}
						}
						if ((l + 1) < DungeonHeight && DungeonArray[l + 1][m].Id > 0)
						{
							if (OpenWorld == 2 || DungeonSelectedBlock.WallBottom == 0)
							{
								DungeonSelectedBlock.WallBottom = 0;
								DungeonSelectedBlock.RoomWallBottom = 0;
								DungeonArray[l + 1][m].WallTop = 0;
								DungeonArray[l + 1][m].RoomWallTop = 0;
							}
						}
						if ((m - 1) >= 0 && DungeonArray[l][m - 1].Id > 0)
						{
							if (OpenWorld == 2 || DungeonSelectedBlock.WallLeft == 0)
							{
								DungeonSelectedBlock.WallLeft = 0;
								DungeonSelectedBlock.RoomWallLeft = 0;
								DungeonArray[l][m - 1].WallRight = 0;
								DungeonArray[l][m - 1].RoomWallRight = 0;
							}
						}
						if ((m + 1) < DungeonWidth && DungeonArray[l][m + 1].Id > 0)
						{
							if (OpenWorld == 2 || DungeonSelectedBlock.WallRight == 0)
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
		}
	}
	#endregion

	#region Elements & Entities
	private bool CheckWallElementConsideration(String Conditional, int Wall, int RoomWall, bool valido)
	{
		if (Conditional == "YES" && Wall == 0 && RoomWall == 0) return false;
		if (Conditional == "BORDER" && Wall == 0) return false;
		if (Conditional == "ROOM" && (Wall == 1 || RoomWall == 0)) return false;
		if (Conditional == "NONE" && (Wall == 1 || RoomWall == 1)) return false;
		return valido;
	}
	private void DistributeDungeonElements()
	{
		var ElementIdC = 1;
		for (var x = 0; x < lstEntities.Count; x++)
		{
			var itemElement = lstEntities[x];
			List<Block> BloquesDisponibles = new List<Block>();
			for (var l = 0; l < DungeonHeight; l++)
			{
				for (var m = 0; m < DungeonWidth; m++)
				{
					var Block = DungeonBlocks[l][m];
					var valido = true;
					if (Block.Id == 0)
					{
						valido = false;
					}
					if (itemElement.NotIndoor == 1 && (Block.ConnectTop != null || Block.ConnectRight != null || Block.ConnectBottom != null || Block.ConnectLeft != null))
					{
						valido = false;
					}
					if (Block.lstElementos.Count > itemElement.OcuppedTolerance)
					{
						valido = false;
					}
					if (itemElement.ObligatoryBottomWall != "NO")
					{
						valido = CheckWallElementConsideration(itemElement.ObligatoryBottomWall, Block.WallBottom, Block.RoomWallBottom, valido);
					}
					if (itemElement.ObligatoryTopWall != "NO")
					{
						valido = CheckWallElementConsideration(itemElement.ObligatoryTopWall, Block.WallTop, Block.RoomWallTop, valido);
					}
					if (itemElement.ObligatoryLeftWall != "NO")
					{
						valido = CheckWallElementConsideration(itemElement.ObligatoryLeftWall, Block.WallLeft, Block.RoomWallLeft, valido);
					}
					if (itemElement.ObligatoryRightWall != "NO")
					{
						valido = CheckWallElementConsideration(itemElement.ObligatoryRightWall, Block.WallRight, Block.RoomWallRight, valido);
					}
					if (valido)
					{
						BloquesDisponibles.Add(Block);
					}
				}
			}
			for (var l = 0; l < itemElement.Total && BloquesDisponibles.Count > 0; l++)
			{
				var numseleccionado = MathRNGSeed.GetRandom(BloquesDisponibles.Count - 1);
				var BlockSeleccionado = BloquesDisponibles[numseleccionado];
				var NewElement = new Element(itemElement.NameTag, itemElement.UID, BlockSeleccionado.Id, ElementIdC);
				itemElement.Objetos.Add(NewElement);
				BlockSeleccionado.lstElementos.Add(NewElement);
				ElementIdC++;
				BloquesDisponibles.RemoveAt(numseleccionado);
			}
			itemElement.Total = itemElement.Objetos.Count;
		}
	}
	#endregion

	#region HTML
	public static void testAlgorithm(int ciclos)
	{
		for (int xxx = 0; xxx < ciclos; xxx++)
		{
			RandomDungeonMaker obj = new RandomDungeonMaker(100, 100, 10000);
			obj.makeDungeon();
		}
		Debug.Log("TERMINADO");
	}
	public String GraphiqueDungeon()
	{
		var DungeonArray = DungeonBlocks;
		MathRNG RNGSeed = new MathRNG(100);
		List<string> ArrayRndmColorBgn = new List<string>();
		for (int r = 0; r < DungeonRooms.Count; r++)
		{
			var rndColor = "#FFD700";
			var redColor = RNGSeed.GetRandom(40, 170).ToString("X");
			var GreenColor = RNGSeed.GetRandom(40, 170).ToString("X");
			var BlueColor = RNGSeed.GetRandom(40, 170).ToString("X");
			rndColor = redColor + "" + GreenColor + "" + BlueColor;
			ArrayRndmColorBgn.Add('#' + rndColor);
		}
		var perSize = "15px";
		var minimap = "";
		minimap += "<table style = 'text-align: center;border-spacing:0px;' >\n";
		for (int l = 0; l < DungeonHeight; l++)
		{
			minimap += "<tr>\n";
			for (int m = 0; m < DungeonWidth; m++)
			{
				var BloqueSeleccionado = DungeonArray[l][m];
				var border = "border-style:solid;border-width:0px;";
				if (BloqueSeleccionado.Id > 0)
				{
					//var RndmColorBackground = ArrayRndmColorBgn[BloqueSeleccionado.Room - 1];
					var RndmColorBackground = "#FFD700";
					var backgroundcolor = "background-color:" + ((BloqueSeleccionado.Status == "OK") ? RndmColorBackground : "#000") + ";";
					if (BloqueSeleccionado.WallTop > 0 || BloqueSeleccionado.RoomWallTop > 0)
					{
						border += "border-top: solid " + ((l - 1) >= 0 && DungeonArray[l - 1][m].Id == 0 ? "2" : "1") + "px;";
					}
					if (BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0)
					{
						border += "border-right: solid " + ((m + 1 < DungeonWidth) && DungeonArray[l][m + 1].Id == 0 ? "2" : "1") + "px;";
					}
					if (BloqueSeleccionado.WallBottom > 0 || BloqueSeleccionado.RoomWallBottom > 0)
					{
						border += "border-bottom: solid " + ((l + 1 < DungeonHeight) && DungeonArray[l + 1][m].Id == 0 ? "2" : "1") + "px;";
					}
					if (BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0)
					{
						border += "border-left: solid " + ((m - 1) >= 0 && DungeonArray[l][m - 1].Id == 0 ? "2" : "1") + "px;";
					}
					border += (BloqueSeleccionado.ConnectTop != null) ? "border-top: dotted 1px #FFF;" : "";
					border += (BloqueSeleccionado.ConnectRight != null) ? "border-right: dotted 1px #FFF;" : "";
					border += (BloqueSeleccionado.ConnectBottom != null) ? "border-bottom: dotted 1px #FFF;" : "";
					border += (BloqueSeleccionado.ConnectLeft != null) ? "border-left: dotted 1px #FFF;" : "";
					minimap += "<td style='width:" + perSize + ";height:" + perSize + ";font-size: 10px;padding: 0px;" + backgroundcolor + border + "'>";
				}
				else
				{
					border = "border-style:solid;border-width:1px;border-color:#EEE";
					minimap += "<td style='width:" + perSize + "; height:" + perSize + "; font-size:10px; background-color:#FFF; " + border + "'>";
				}
				if (BloqueSeleccionado.Id > 0)
				{
					minimap += "<div Style='width:100%; height:100%'>";
					for (int y = 0; y < BloqueSeleccionado.lstElementos.Count; y++)
					{
						minimap += BloqueSeleccionado.lstElementos[y].NameTag;
					}
					if (BloqueSeleccionado.SupportPlatformTop != "NONE")
					{
						if (BloqueSeleccionado.SupportPlatformCenter == "LEFT")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 0%; position: relative;'></div>";
						}
						if (BloqueSeleccionado.SupportPlatformCenter == "CENTER")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 30%; position: relative;'></div>";
						}
						if (BloqueSeleccionado.SupportPlatformCenter == "RIGHT")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 60%; position: relative;'></div>";
						}
					}
					else
					{
						minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 0%; left: 30%; position: relative;'></div>";
					}
					if (BloqueSeleccionado.SupportPlatformCenter != "NONE")
					{
						if (BloqueSeleccionado.SupportPlatformCenter == "LEFT")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 0%; position: relative;'></div>";
						}
						if (BloqueSeleccionado.SupportPlatformCenter == "CENTER")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 30%; position: relative;'></div>";
						}
						if (BloqueSeleccionado.SupportPlatformCenter == "RIGHT")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 60%; position: relative;'></div>";
						}
					}
					else
					{
						minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 35%; left: 30%; position: relative;'></div>";
					}
					//BloqueSeleccionado.SupportPlatformBottom = "NONE";
					if (BloqueSeleccionado.SupportPlatformBottom != "NONE")
					{
						if (BloqueSeleccionado.SupportPlatformBottom == "LEFT")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 0%; position: relative;'></div>";
						}
						if (BloqueSeleccionado.SupportPlatformBottom == "CENTER")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 30%; position: relative;'></div>";
						}
						if (BloqueSeleccionado.SupportPlatformBottom == "RIGHT")
						{
							minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 60%; position: relative;'></div>";
						}
					}
					else
					{
						minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 75%; left: 30%; position: relative;'/></div>";
					}
					minimap += "</div>";
				}
				else
				{
					minimap += "<div style=''> &nbsp </div>";
				}
				minimap += "</td>\n";
			}
			minimap += "</tr>\n";
		}
		minimap += "</table>";
		return minimap;
	}
	#endregion

	#region Public_Classes
	public class Block
	{
		public int Id, X, Y, RoomX, RoomY, Room,
					WallTop, WallRight, WallBottom, WallLeft,
					RoomWallTop, RoomWallRight, RoomWallBottom, RoomWallLeft;
		public Block ConnectTop, ConnectRight, ConnectBottom, ConnectLeft;
		public String Status = "OK", SupportPlatformTop = "NONE", SupportPlatformCenter = "NONE",  SupportPlatformBottom = "NONE";
		public List<Element> lstElementos = new List<Element>();
		public Block(int X, int Y)
		{
			this.X = X;
			this.Y = Y;
		}
	}
	public class Room
	{
		public int Id, index;
		public RoomBlock[][] Blocks;
		public List<string> Connections = new List<string>();
		public Room(int DungeonRoomsLength) 
		{
			Id = DungeonRoomsLength + 1;
			index = DungeonRoomsLength;		
		}
	}
	public class RoomBlock
	{
		public int RoomX, RoomY;
		public Block Block;
		public RoomBlock(Block Block, int RoomX, int RoomY)
		{
			this.Block = Block;
			this.RoomX = RoomX;
			this.RoomY = RoomY;
		}
	}
	public class Entities
	{
		public String NameTag, UID;
		public int NotIndoor = 1, OcuppedTolerance = 1;
		public String ObligatoryBottomWall = "NO", ObligatoryTopWall = "NO", ObligatoryLeftWall = "NO", ObligatoryRightWall = "NO";
		public int Total = 0;
		public List<Element> Objetos = new List<Element>();
		public Entities(String NameTag, String UID, int Total)
        {
			this.NameTag = NameTag;
			this.UID = UID;
			this.Total = Total;
		}
	}
	public class Element
	{
		public String NameTag;
		public String UID;
		public int BlockId;
		public int ElementId;
		public int Status = 1;
		public String OtherData;
		public Element(String NameTag, String UID, int BlockId, int ElementId)
		{
			this.NameTag = NameTag;
			this.UID = UID;
			this.BlockId = BlockId;
			this.ElementId = ElementId;
		}
	}
	#endregion

	#region Private_Classes
	private class RoomVisited
	{
		public Room Room;
		public RoomVisited RoomAnterior;
		public RoomVisited(Room Room, RoomVisited RoomAnterior)
        {
			this.Room = Room;
			this.RoomAnterior = RoomAnterior;
		}
	}
	#endregion
}