"use strict";

{
  C3.Plugins.random_dungeon_maker.Type = class random_dungeon_maker extends C3.SDKTypeBase
  {
    constructor(objectClass)
    {
      super(objectClass);
    }

    Release()
    {
      super.Release();
    }

    OnCreate()
    {
		C3.Plugins.random_dungeon_maker.CurX = 0;
		C3.Plugins.random_dungeon_maker.CurY = 0;
		C3.Plugins.random_dungeon_maker.CurRoom = 1;
		C3.Plugins.random_dungeon_maker.CurRoomX = 0;
		C3.Plugins.random_dungeon_maker.CurRoomY = 0;
		C3.Plugins.random_dungeon_maker.GameDungeon = null;
    }
  };
}
