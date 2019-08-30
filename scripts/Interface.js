function DungeonBasicConfiguration(Width,Height,Blocks)
{
	var GameDungeon = 	
	{
		DungeonBlocks: [],
		DungeonRooms: [],
		DungeonWidth: Width,			
		DungeonHeight: Height,
		TotalBloquesDungeon: Blocks,
		DungeonRoomsWidthMin: 3,
		DungeonRoomsWidthMax: 6,
		DungeonRoomsHeightMin: 3,
		DungeonRoomsHeightMax: 6,
		DungeonRoomsSizeAmbivalence: 0,
		DungeonMode: "ZELDA",
		LabyrinthInn: 1,		
		SupportPlatforms: 0,
		StartPointX: 0,
		StartPointY: 0,
		Status: "NOT",
		Elements:[],
	};
	return GameDungeon;
}

function GraphiqueDungeon(GameDungeon)
{
	var DungeonArray = GameDungeon.DungeonBlocks;
	var DungeonRooms = GameDungeon.DungeonRooms;
	
	var ArrayRndmColorBgn = [];
	for(r = 0; r < DungeonRooms.length; r++)
	{
		var rndColor = ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
		var redColor = Math.floor(Math.random()*(170)+40).toString(16);
		var GreenColor = Math.floor(Math.random()*(170)+40).toString(16);
		var BlueColor = Math.floor(Math.random()*(170)+40).toString(16);
		rndColor = redColor + "" + GreenColor + "" + BlueColor;
		ArrayRndmColorBgn[ArrayRndmColorBgn.length] = '#' + rndColor;
		//console.log(DungeonRooms[r].Connections);
	}		
	
	var perSize = "15px";
	
	var minimap = "";
	minimap += "<table style = 'text-align: center;border-spacing:0px;' >\n";
	for(l = 0; l < GameDungeon.DungeonHeight; l++)
	{
		minimap += "<tr>\n";
		for(m = 0; m < GameDungeon.DungeonWidth; m++)
		{
			var BloqueSeleccionado = DungeonArray[l][m];
			var border = "border-style:solid;border-width:0px;";
			if(BloqueSeleccionado.Id > 0)
			{
				var RndmColorBackground = ArrayRndmColorBgn[BloqueSeleccionado.Room - 1];
				RndmColorBackground = "#FFD700";			
				var backgroundcolor = "background-color:" + ((BloqueSeleccionado.Status =="OK") ? RndmColorBackground : "#000") + ";";
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
				minimap += "<td style='width:" + perSize + ";height:" + perSize + ";font-size: 10px;padding: 0px;"+ backgroundcolor + border+"'>";
			}else
			{
				border = "border-style:solid;border-width:1px;border-color:#EEE";
				minimap += "<td style='width:" + perSize + "; height:" + perSize + "; font-size:10px; background-color:#FFF; " + border+"'>";
			}
			if(BloqueSeleccionado.Id > 0)
			{
				minimap += "<div Style='width:100%; height:100%'>";
				for(y = 0; y < BloqueSeleccionado.Elements.length; y++)
				{
					minimap += BloqueSeleccionado.Elements[y].NameTag;
				}
				if(BloqueSeleccionado.SupportPlatformTop != "NONE")
				{
					if(BloqueSeleccionado.SupportPlatformCenter == "LEFT")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 0%; position: relative;'></div>";
					}
					if(BloqueSeleccionado.SupportPlatformCenter == "CENTER")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 30%; position: relative;'></div>";
					}
					if(BloqueSeleccionado.SupportPlatformCenter == "RIGHT")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 60%; position: relative;'></div>";
					}					
				}else
				{
					minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 0%; left: 30%; position: relative;'></div>";
				}
				if(BloqueSeleccionado.SupportPlatformCenter != "NONE")
				{
					if(BloqueSeleccionado.SupportPlatformCenter == "LEFT")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 0%; position: relative;'></div>";
					}
					if(BloqueSeleccionado.SupportPlatformCenter == "CENTER")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 30%; position: relative;'></div>";
					}
					if(BloqueSeleccionado.SupportPlatformCenter == "RIGHT")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 60%; position: relative;'></div>";
					}					
				}else
				{
					minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 35%; left: 30%; position: relative;'></div>";
				}
				//BloqueSeleccionado.SupportPlatformBottom = "NONE";
				if(BloqueSeleccionado.SupportPlatformBottom != "NONE")
				{
					if(BloqueSeleccionado.SupportPlatformBottom == "LEFT")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 0%; position: relative;'></div>";
					}
					if(BloqueSeleccionado.SupportPlatformBottom == "CENTER")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 30%; position: relative;'></div>";
					}
					if(BloqueSeleccionado.SupportPlatformBottom == "RIGHT")
					{
						minimap += "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 60%; position: relative;'></div>";
					}					
				}else
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
    document.getElementById("minimap").innerHTML = minimap;
	document.getElementById("jsondata").innerHTML += JSON2.stringify(GameDungeon);
}

function testAlgorithm(ciclos)
{
	for(xxx = 0; xxx < ciclos; xxx++)
	{
		var t0 = performance.now();		
		var ss = makeDungeon(DungeonBasicConfiguration(100,100,10000));
		var t1 = performance.now();
		console.log(xxx + " Array took " + (t1 - t0) + " milliseconds.");
	}
	return 0;
}