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
		OpenWorld: 0,
		SupportPlatforms: 0,
		ShowSupportPlatforms: 1,
		StartPointX: 0,
		StartPointY: 0,
		Status: "NOT",
		Elements:[],
		SubBlockWidth: 4,
		SubBlockHeight: 4,
	};
	return GameDungeon;
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
	};
	if(GameDungeon.Elements === undefined)
	{
		GameDungeon.Elements = [];
	}
	GameDungeon.Elements[GameDungeon.Elements.length] = objnuevo;
}