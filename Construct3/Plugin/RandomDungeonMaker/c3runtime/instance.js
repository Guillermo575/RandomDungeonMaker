"use strict";

{

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
	GameDungeon = GameDungeon == null ? JSON2.parse(globalThis["GraphicMap_objMapGraphic"]) : GameDungeon;
	globalThis["GraphicMap_objMapGraphic"] = JSON2.stringify(GameDungeon);
	if(globalThis["GraphicMap_ShowSupportPlatforms"] == null)
	{
		globalThis["GraphicMap_ShowSupportPlatforms"] = 0;
	}
	if(globalThis["GraphicMap_ShowColorRooms"] == null)
	{
		globalThis["GraphicMap_ShowColorRooms"] = 0;
	}
	if(globalThis["GraphicMap_ShowElements"] == null)
	{
		globalThis["GraphicMap_ShowElements"] = 0;
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
							RndmColorBackground = globalThis["GraphicMap_ShowColorRooms"] == 1 ? RndmColorBackground : "#FFD700";
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
								if(globalThis["GraphicMap_ShowSupportPlatforms"] == 1)
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
								if(globalThis["GraphicMap_ShowElements"] == 1)
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
	var chkShowSupportPlatforms = "globalThis[\"GraphicMap_ShowSupportPlatforms\"] = document.getElementById(\"chkShowSupportPlatforms\").checked ? 1 : 0;";
	var chkShowColorRooms = "globalThis[\"GraphicMap_ShowColorRooms\"] = document.getElementById(\"chkShowColorRooms\").checked ? 1 : 0;";
	var chkShowElements = "globalThis[\"GraphicMap_ShowElements\"] = document.getElementById(\"chkShowElements\").checked ? 1 : 0;";
	var stringtable = "<table>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowSupportPlatforms + GraphiqueFunction + "' id='chkShowSupportPlatforms' " + (globalThis["GraphicMap_ShowSupportPlatforms"] == 1 ? "checked" : "") + "> Support Platforms </input>";
		stringtable += "</td>";
	stringtable += "</tr>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowColorRooms + GraphiqueFunction + "' id='chkShowColorRooms' " + (globalThis["GraphicMap_ShowColorRooms"] == 1 ? "checked" : "") + "> Color Rooms </input>";
		stringtable += "</td>";
	stringtable += "</tr>";
	stringtable += "<tr>";
		stringtable += "<td>";
			stringtable += "<input type='checkbox' onclick='" + chkShowElements + GraphiqueFunction + "' id='chkShowElements' " + (globalThis["GraphicMap_ShowElements"] == 1 ? "checked" : "") + "> Elements </input>";
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

  var random_dungeon_makerInstance = globalThis['random_dungeon_makerInstance'];
  C3.Plugins.random_dungeon_maker.Instance = class random_dungeon_makerInstance extends C3.SDKWorldInstanceBase
  {

    Release()
    {
      super.Release();
    }

    Draw(renderer)
    {
    }

    SaveToJson()
    {
    }

    LoadFromJson(o)
    {
    }

	GetDebuggerProperties()
	{
		const Acts = C3.Plugins.random_dungeon_maker.Acts;
		const prefix = "plugins.Plugins.random_dungeon_maker.debugger.MapProperties";
		return [{
			title:"Labyrinth",
			properties: [
				{name: "Map",
				 value: C3.Plugins.random_dungeon_maker.GameDungeon == null? "<b>NOT DUNGEON CREATED YET</b>" : GraphiqueDungeon(C3.Plugins.random_dungeon_maker.GameDungeon), 
				 html: true}
			]
		}];
	}
  };

}
