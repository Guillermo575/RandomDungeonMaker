function DungeonBasicConfiguration(Width,Height,Blocks,RNGSeed)
{
	if(!RNGSeed)
	{
		RNGSeed = Math.floor((Math.random() * 999999999))
	}	
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
		OpenWorld: 0,
		SupportPlatforms: 0,
		StartPointX: 0,
		StartPointY: 0,
		Status: "NOT",
		Elements:[],
		SubBlockWidth: 4,
		SubBlockHeight: 4,
		Seed: RNGSeed,		
	};
	return GameDungeon;
}
function testDungeon()
{
	for(xxx = 0; xxx < 100000; xxx++)
	{
		var t0 = performance.now();		
		var ss = makeDungeon(DungeonBasicConfiguration(100,100,10000));
		var t1 = performance.now();
		console.log(xxx + " Array took " + (t1 - t0) + " milliseconds.");
	}
	alert("Terminado");
}
function AddElement(GameDungeon, Name,Total,OcuppedTolerance,NotIndoor,
					ObligatoryBottomWall,ObligatoryTopWall,ObligatoryLeftWall,ObligatoryRightWall)
{
	var objnuevo =
	{
		NameTag: Name,
		Total: Total,
		OcuppedTolerance: OcuppedTolerance,
		NotIndoor: NotIndoor,
		ObligatoryBottomWall: ObligatoryBottomWall,
		ObligatoryTopWall: ObligatoryTopWall,
		ObligatoryLeftWall: ObligatoryLeftWall,
		ObligatoryRightWall: ObligatoryRightWall,
		Objetos: [],
		Width: 1,
		Height: 1,
		Priority: 1,
	};
	if(GameDungeon.Elements === undefined)
	{
		GameDungeon.Elements = [];
	}
	GameDungeon.Elements[GameDungeon.Elements.length] = objnuevo;
}
function download(filename, text)
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
function getFile(event)
{
	const input = event.target;
	if ('files' in input && input.files.length > 0)
	{
		placeFileContent(document.getElementById('jsondata'), input.files[0]);
	}
}
function placeFileContent(target, file)
{
	readFileContent(file).then(content => {
		target.value = content;
		GameDungeon = JSON2.parse(content);
		document.getElementById("minimap").innerHTML = GraphiqueDungeon(GameDungeon);
	}).catch(error => console.log(error));
}
function readFileContent(file)
{
	const reader = new FileReader();
	return new Promise((resolve, reject) =>
	{
		reader.onload = event => resolve(event.target.result);
		reader.onerror = error => reject(error);
		reader.readAsText(file);
	});
}
function saveConfiguration()
{
	localStorage.setItem("Config_width", document.getElementById('width').value);
	localStorage.setItem("Config_height", document.getElementById('height').value);
	localStorage.setItem("Config_blocks", document.getElementById('blocks').value);
	localStorage.setItem("Config_GameMode", document.getElementById('GameMode').value);
	localStorage.setItem("Config_PointX", document.getElementById('PointX').value);
	localStorage.setItem("Config_PointY", document.getElementById('PointY').value);
	localStorage.setItem("Config_LabyrinthInn", document.getElementById('LabyrinthInn').value);
	localStorage.setItem("Config_OpenWorld", document.getElementById('OpenWorld').value);
	localStorage.setItem("Config_SupportPlatforms", document.getElementById('SupportPlatforms').value);
	localStorage.setItem("Config_RNGSeed", document.getElementById('RNGSeed').value);
	localStorage.setItem("Config_RandomSeed", document.getElementById('RandomSeed').value);
	if (document.getElementById('chkShowSupportPlatforms') && document.getElementById('chkShowColorRooms') && document.getElementById('chkShowElements'))
	{
		localStorage.setItem("GraphicMap_ShowSupportPlatforms", document.getElementById('chkShowSupportPlatforms').checked);
		localStorage.setItem("GraphicMap_ShowColorRooms", document.getElementById('chkShowColorRooms').checked);
		localStorage.setItem("GraphicMap_ShowElements", document.getElementById('chkShowElements').checked);		
	}
}
function LoadConfiguration()
{
	document.getElementById('width').value = localStorage.getItem("Config_width") == null ? "30" : localStorage.getItem("Config_width");
	document.getElementById('height').value = localStorage.getItem("Config_height") == null ? "30" : localStorage.getItem("Config_height");
	document.getElementById('blocks').value = localStorage.getItem("Config_blocks") == null ? "400" : localStorage.getItem("Config_blocks");
	document.getElementById('GameMode').value = localStorage.getItem("Config_GameMode") == null ? "LABYRINTH" : localStorage.getItem("Config_GameMode");
	document.getElementById('PointX').value = localStorage.getItem("Config_PointX") == null ? "0" : localStorage.getItem("Config_PointX");
	document.getElementById('PointY').value = localStorage.getItem("Config_PointY") == null ? "0" : localStorage.getItem("Config_PointY");
	document.getElementById('LabyrinthInn').value = localStorage.getItem("Config_LabyrinthInn") == null ? "1" : localStorage.getItem("Config_LabyrinthInn");
	document.getElementById('OpenWorld').value = localStorage.getItem("Config_OpenWorld") == null ? "0" : localStorage.getItem("Config_OpenWorld");
	document.getElementById('SupportPlatforms').value = localStorage.getItem("Config_SupportPlatforms") == null ? "0" : localStorage.getItem("Config_SupportPlatforms");
	document.getElementById('RNGSeed').value = localStorage.getItem("Config_RNGSeed") == null ? "1000" : localStorage.getItem("Config_RNGSeed");
	document.getElementById('RandomSeed').value = localStorage.getItem("Config_RandomSeed") == null ? "1" : localStorage.getItem("Config_RandomSeed");
	if (document.getElementById('chkShowSupportPlatforms') && document.getElementById('chkShowColorRooms') && document.getElementById('chkShowElements'))
	{
		document.getElementById('chkShowSupportPlatforms').checked = localStorage.getItem("GraphicMap_ShowSupportPlatforms") == null ? false : localStorage.getItem("GraphicMap_ShowSupportPlatforms");
		document.getElementById('chkShowColorRooms').checked = localStorage.getItem("GraphicMap_ShowColorRooms") == null ? false : localStorage.getItem("GraphicMap_ShowColorRooms");
		document.getElementById('chkShowElements').checked = localStorage.getItem("GraphicMap_ShowElements") == null ? false : localStorage.getItem("GraphicMap_ShowElements");		
	}
}
function ResetConfiguration()
{
	document.getElementById('width').value = "30";
	document.getElementById('height').value = "30";
	document.getElementById('blocks').value = "400";
	document.getElementById('GameMode').value = "LABYRINTH";
	document.getElementById('PointX').value = "0";
	document.getElementById('PointY').value = "0";
	document.getElementById('LabyrinthInn').value = "1";
	document.getElementById('OpenWorld').value = "0";
	document.getElementById('SupportPlatforms').value = "1";
	document.getElementById('RNGSeed').value = "1000";
	document.getElementById('RandomSeed').value = "1";
	if (document.getElementById('chkShowSupportPlatforms') && document.getElementById('chkShowColorRooms') && document.getElementById('chkShowElements'))
	{
		document.getElementById('chkShowSupportPlatforms').checked = false;
		document.getElementById('chkShowColorRooms').checked = false;
		document.getElementById('chkShowElements').checked = false;
	}
	saveConfiguration();
	document.getElementById('minimap').innerHTML = GraphiqueDungeon();
}