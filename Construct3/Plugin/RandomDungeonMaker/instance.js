"use strict";
{
	const PLUGIN_CLASS = SDK.Plugins.random_dungeon_maker;
	
	PLUGIN_CLASS.Instance = class random_dungeon_maker extends SDK.IInstanceBase
	{
		constructor(sdkType, inst)
		{
			super(sdkType, inst);
		}
		
		Release()
		{
		}
		
		OnCreate()
		{
		}
		
		OnPropertyChanged(id, value)
		{
		}
		
		LoadC2Property(name, valueString)
		{
			return false;
		}
	};
}