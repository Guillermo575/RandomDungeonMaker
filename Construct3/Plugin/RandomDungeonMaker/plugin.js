"use strict";
{
    const PLUGIN_ID = "random_dungeon_maker";

    const PLUGIN_VERSION = "1.1";
    const PLUGIN_CATEGORY = "other";

    let app = null;

    const PLUGIN_CLASS = SDK.Plugins.random_dungeon_maker = class random_dungeon_maker extends SDK.IPluginBase {
        constructor() {
            super(PLUGIN_ID);

            SDK.Lang.PushContext("plugins.random_dungeon_maker");

            this._info.SetName(lang(".name"));
            this._info.SetDescription(lang(".description"));
            this._info.SetVersion(PLUGIN_VERSION);
            this._info.SetCategory(PLUGIN_CATEGORY);
            this._info.SetAuthor("El_Guille");
            this._info.SetHelpUrl(lang(".help-url"));
            this._info.SetIsSingleGlobal(true);

            SDK.Lang.PushContext(".properties");

            this._info.SetProperties([ ]);

            SDK.Lang.PopContext(); // .properties

            SDK.Lang.PopContext();
        }
    };
    PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
