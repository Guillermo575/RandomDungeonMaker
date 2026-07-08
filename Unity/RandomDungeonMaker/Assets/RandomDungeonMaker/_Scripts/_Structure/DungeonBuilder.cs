using System;
using System.Collections.Generic;
using TMPro;
using System.Linq;
using UnityEngine;
using Unity.AI.Navigation;
using RDM.EditorWindow;
namespace RDM
{
    #region Descripcion
    /**
     * @file
     * @brief Class that receive a RDM object and build a dungeon using prefabs
     */
    #endregion
    public class DungeonBuilder : DungeonFloor
    {
        #region Editor
        /** Size of the Tile Prefab */
        public float TileSize = 10f;
        /** Scale in Y for the Wall Prefab */
        public float ScaleWallY = 1f;
        /** Scale in Z for the Wall Prefab */
        public float ScaleWallZ = 1f;
        /** Prefab that makes the tile floor */
        public GameObject Tile;
        /** Prefab that makes the walls */
        public GameObject Wall;
        /** Prefab entities list */
        public List<GameObject> lstPrefabs;
        /** true = put the camera pivot above all tiles */
        public bool CameraPosYAuto = true;
        /** Camera Position Y Pivot */
        public float CameraPosY = 0;
        public Vector3 StartingPoint = Vector3.zero;
        public DungeonConfig dungeonConfig;
        #endregion

        #region Private
        /** RandomDungeonMaker object */
        private RandomDungeonMaker RDM;
        private GameObject Main;
        #endregion

        #region enum
        public enum StretchWallType
        {
            NO, YES, ONLY_ROOM
        }
        #endregion

        #region General
        public GameObject getParent()
        {
            if (Main == null)
            {
                if (this == null)
                {
                    var allObjects = FindObjectsByType<GameObject>(FindObjectsSortMode.InstanceID);
                    var filteredObjects = allObjects.Where(obj => obj.name.StartsWith("pDungeon")).ToList();
                    Main = new GameObject();
                    Main.name = "pDungeon_" + filteredObjects.Count;
                    var pStructure = new GameObject();
                    pStructure.name = "pStructure";
                    pStructure.transform.parent = Main.transform;
                    var pCameraPivot = new GameObject();
                    pCameraPivot.name = "pCameraPivot";
                    pCameraPivot.transform.parent = Main.transform;
                }
                else
                {
                    Main = this.gameObject;
                }
            }
            return Main;
        }

        #region Descripcion
        /** 
         * Method that make the floor structure using the tile and wall prefabs
         * @param RDM: RandomDungeonMaker object
         * @param ShowTileLabel: Show Tile Label
         * @param MakeWallRecursive: make the walls using the few posible
         */
        #endregion
        public GameObject BuildDungeon(RandomDungeonMaker RDM, bool ShowTileLabel = true, StretchWallType stretchWallType = StretchWallType.NO)
        {
            if (RDM.Status != "LOADED")
            {
                RDM.makeDungeon();
            }
            this.RDM = RDM;
            var Main = getParent();
            Main.transform.position = StartingPoint;
            float ScaleTile = TileSize > 0 ? TileSize : Tile.transform.localScale.x;
            var StartPosition = new Vector3(-ScaleTile * RDM.DungeonWidth / 2, 0, ScaleTile * RDM.DungeonHeight / 2);
            for (int l = 0; l < RDM.DungeonHeight; l++)
            {
                for (int m = 0; m < RDM.DungeonWidth; m++)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0)
                    {
                        //Vector3 posicion = Main.transform.position;
                        Vector3 posicion = StartPosition;
                        posicion += new Vector3(m * ScaleTile, 0, -(l * ScaleTile));
                        var parent = Instantiate(Tile, posicion, Quaternion.identity);
                        //parent.transform.SetParent(Main.transform);
                        parent.transform.SetParent(Main.transform.Find("pStructure"));
                        parent.name = getTileName(block.Id);
                        Vector3 currentScale = parent.transform.localScale;
                        currentScale.x = ScaleTile;
                        currentScale.z = ScaleTile;
                        parent.transform.localScale = currentScale;
                        parent.transform.localPosition = posicion;
                        var txtId = parent.transform.Find("txtId").gameObject.GetComponent<TextMeshPro>();
                        if (txtId != null)
                        {
                            txtId.text = ShowTileLabel ? block.Id.ToString() : String.Empty;
                        }
                    }
                }
            }
            if (stretchWallType != StretchWallType.NO)
            {
                MakeWallsRecursive(RDM, stretchWallType == StretchWallType.ONLY_ROOM);
            }
            else
            {
                MakeWall(RDM);
            }
            MakeElements(RDM);
            GroupByRooms();
            Transform pivoteCamara = Main.transform.Find("pCameraPivot");
            pivoteCamara.Translate(new Vector3(0, CameraPosYAuto ? ((RDM.DungeonWidth > RDM.DungeonHeight ? RDM.DungeonWidth : RDM.DungeonHeight) * ScaleTile) + 10 : CameraPosY, 0), Space.World);
            NavMeshSurface navMesh = getParent().GetComponent<NavMeshSurface>();
            if (navMesh != null)
            {
                navMesh.BuildNavMesh();
            }
            return Main;
        }

        #endregion

        #region Elements

        #region Descripcion
        /** 
         * Method that make the wall structure using the tile and wall prefabs
         * @param RDM: RandomDungeonMaker object
         */
        #endregion
        public void MakeElements(RandomDungeonMaker RDM)
        {
            if (lstPrefabs == null || lstPrefabs.Count == 0) return;
            var Main = getParent();
            var MainStartPivot = Main.transform.Find("pStartPivot");
            var lstElementParents = new List<GameObject>();
            foreach (var obj in lstPrefabs)
            {
                GameObject child = new GameObject("_" + obj.name);
                child.transform.SetParent(Main.transform);
                lstElementParents.Add(child);
            }
            for (int l = 0; l < RDM.DungeonHeight; l++)
            {
                for (int m = 0; m < RDM.DungeonWidth; m++)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0)
                    {
                        var pTile = Main.transform.Find("pStructure/" + getTileName(block.Id));
                        var pTilePos = pTile.Find("pStartPivot").position;
                        foreach (var objElement in block.lstElementos)
                        {
                            if (objElement.UID == "START")
                            {
                                MainStartPivot.transform.position = pTilePos;
                            }
                            else
                            {
                                var lstObjElement = (from x in lstPrefabs where x.name == objElement.UID select x).ToList();
                                var lstParentElement = (from x in lstElementParents where x.name == "_" + objElement.UID select x).ToList();
                                if (lstObjElement.Count > 0)
                                {
                                    var objSelected = lstObjElement.First();
                                    var child = Instantiate(objSelected, pTilePos, objSelected.transform.rotation);
                                    if (lstParentElement.Count > 0)
                                    {
                                        child.transform.SetParent(lstParentElement.First().transform);
                                    }
                                    else
                                    {
                                        child.transform.SetParent(Main.transform);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        #endregion

        #region Make Wall Object

        #region Descripcion
        /** 
         * Create a wall around a tile 
         * @param parent: Tile object
         * @param PivotName: Name of the tile corner where p1 = Wall Top, p2 = Wall Right, p3 = Wall Bottom and p4 = Wall Left
         * @param ChildName: name of the recent created wall
         * @param rotation: degree value between 0-360 for the wall rotate around the tile
         */
        #endregion
        GameObject MakeWall(GameObject parent, String PivotName, String ChildName, float rotation)
        {
            Transform hijo = parent.transform.Find(PivotName);
            var child = Instantiate(Wall, hijo.position, Quaternion.identity);
            child.name = ChildName;
            Vector3 currentScale = child.transform.localScale;
            currentScale.x = parent.transform.localScale.x;
            currentScale.y = ScaleWallY;
            currentScale.z = ScaleWallZ;
            child.transform.localScale = currentScale;
            var currentRotation = child.transform.localRotation;
            Vector3 eulerRotation = currentRotation.eulerAngles;
            eulerRotation.y = rotation;
            child.transform.localRotation = Quaternion.Euler(eulerRotation);
            child.transform.SetParent(parent.transform);
            return child;
        }

        #endregion

        #region Simple Wall

        #region Descripcion
        /** 
         * Method that make the wall structure using the tile and wall prefabs
         * @param RDM: RandomDungeonMaker object
         */
        #endregion
        public void MakeWall(RandomDungeonMaker RDM)
        {
            var Main = getParent();
            for (int l = 0; l < RDM.DungeonHeight; l++)
            {
                for (int m = 0; m < RDM.DungeonWidth; m++)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0)
                    {
                        var parent = Main.transform.Find("pStructure/" + getTileName(block.Id)).gameObject;
                        if (block.hasWallTop)
                        {
                            MakeWall(parent, "p1", "WallTop", 0f);
                        }
                        if (block.hasWallRight)
                        {
                            MakeWall(parent, "p2", "WallRight", 90f);
                        }
                        if (block.hasWallBottom)
                        {
                            MakeWall(parent, "p3", "WallBottom", 180f);
                        }
                        if (block.hasWallLeft)
                        {
                            MakeWall(parent, "p4", "WallLeft", 270f);
                        }
                    }
                }
            }
        }
        #endregion

        #region Make Recursive Wall

        #region Descripcion
        /** 
         * Method that make the wall structure using the tile and wall prefabs
         * @param RDM: RandomDungeonMaker object
         */
        #endregion
        void MakeWallsRecursive(RandomDungeonMaker RDM, bool OnlyStretchInRooms = true)
        {
            var Main = getParent();
            #region WallTop
            float ExpandWallMultiply = 1;
            GameObject wall = null;
            Vector3 currentScale = Vector3.zero;
            int currentRoom = 0;
            for (int l = 0; l < RDM.DungeonHeight; l++)
            {
                for (int m = 0; m < RDM.DungeonWidth; m++)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0 && !RDM.GetBlock(m, l - 1).hasWallBottom && block.hasWallTop)
                    {
                        if (wall != null && (currentRoom == block.Room || !OnlyStretchInRooms))
                        {
                            ExpandWallMultiply++;
                            wall.transform.localScale = new Vector3(currentScale.x * ExpandWallMultiply, currentScale.y, currentScale.z);
                        }
                        else
                        {
                            ExpandWallMultiply = 1;
                            var parent = Main.transform.Find("pStructure/" + getTileName(block.Id));
                            currentRoom = block.Room;
                            wall = MakeWall(parent.gameObject, "p1", "WallTop", 0f);
                            currentScale = wall.transform.localScale;
                        }
                    }
                    else
                    {
                        ExpandWallMultiply = 1;
                        wall = null;
                    }
                }
                ExpandWallMultiply = 1;
                wall = null;
            }
            #endregion

            #region WallBottom
            ExpandWallMultiply = 1;
            wall = null;
            currentScale = Vector3.zero;
            for (int l = 0; l < RDM.DungeonHeight; l++)
            {
                for (int m = RDM.DungeonWidth - 1; m >= 0; m--)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0 && block.hasWallBottom)
                    {
                        if (wall != null && (currentRoom == block.Room || !OnlyStretchInRooms))
                        {
                            ExpandWallMultiply++;
                            wall.transform.localScale = new Vector3(currentScale.x * ExpandWallMultiply, currentScale.y, currentScale.z);
                        }
                        else
                        {
                            ExpandWallMultiply = 1;
                            var parent = Main.transform.Find("pStructure/" + getTileName(block.Id));
                            currentRoom = block.Room;
                            wall = MakeWall(parent.gameObject, "p3", "WallBottom", 180f);
                            currentScale = wall.transform.localScale;
                        }
                    }
                    else
                    {
                        ExpandWallMultiply = 1;
                        wall = null;
                    }
                }
                ExpandWallMultiply = 1;
                wall = null;
            }
            #endregion

            #region WallRight
            ExpandWallMultiply = 1;
            wall = null;
            currentScale = Vector3.zero;
            for (int m = 0; m < RDM.DungeonWidth; m++)
            {
                for (int l = 0; l < RDM.DungeonHeight; l++)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0 && block.hasWallRight)
                    {
                        if (wall != null && (currentRoom == block.Room || !OnlyStretchInRooms))
                        {
                            ExpandWallMultiply++;
                            wall.transform.localScale = new Vector3(currentScale.x * ExpandWallMultiply, currentScale.y, currentScale.z);
                        }
                        else
                        {
                            ExpandWallMultiply = 1;
                            var parent = Main.transform.Find("pStructure/" + getTileName(block.Id));
                            currentRoom = block.Room;
                            wall = MakeWall(parent.gameObject, "p2", "WallRight", 90f);
                            currentScale = wall.transform.localScale;
                        }
                    }
                    else
                    {
                        ExpandWallMultiply = 1;
                        wall = null;
                    }
                }
                ExpandWallMultiply = 1;
                wall = null;
            }
            #endregion

            #region WallLeft
            ExpandWallMultiply = 1;
            wall = null;
            currentScale = Vector3.zero;
            for (int m = 0; m < RDM.DungeonWidth; m++)
            {
                for (int l = RDM.DungeonHeight - 1; l >= 0; l--)
                {
                    var block = RDM.GetBlock(m, l);
                    if (block.Id > 0 && !RDM.GetBlock(m - 1, l).hasWallRight && block.hasWallLeft)
                    {
                        if (wall != null && (currentRoom == block.Room || !OnlyStretchInRooms))
                        {
                            ExpandWallMultiply++;
                            wall.transform.localScale = new Vector3(currentScale.x * ExpandWallMultiply, currentScale.y, currentScale.z);
                        }
                        else
                        {
                            ExpandWallMultiply = 1;
                            var parent = Main.transform.Find("pStructure/" + getTileName(block.Id));
                            currentRoom = block.Room;
                            wall = MakeWall(parent.gameObject, "p4", "WallLeft", 270f);
                            currentScale = wall.transform.localScale;
                        }
                    }
                    else
                    {
                        ExpandWallMultiply = 1;
                        wall = null;
                    }
                }
                ExpandWallMultiply = 1;
                wall = null;
            }
            #endregion
        }
        #endregion

        #region Group by Rooms
        void GroupByRooms()
        {
            for (int l = 0; l < RDM.DungeonRooms.Count; l++)
            {
                var lstBlocks = RDM.DungeonRooms[l].Blocks;
                var pRoom = new GameObject();
                pRoom.name = getRoomName(RDM.DungeonRooms[l].Id);
                pRoom.transform.parent = Main.transform.Find("pStructure");
                for (int m = 0; m < lstBlocks.Length; m++)
                {
                    for (int n = 0; n < lstBlocks[m].Length; n++)
                    {
                        var objBlock = lstBlocks[m][n].Block;
                        var pTile = Main.transform.Find("pStructure/" + getTileName(objBlock.Id));
                        if (pTile != null)
                        {
                            pTile.transform.parent = pRoom.transform;
                        }
                    }
                }
                var hijos = pRoom.transform.Cast<Transform>().OrderBy(t => t.gameObject.name).ToList();
                for (int i = 0; i < hijos.Count; i++)
                {
                    hijos[i].SetSiblingIndex(i);
                }
            }
        }
        #endregion

        #region get Names
        private String getTileName(int Id)
        {
            int decimals = RDM.TotalBloquesDungeon.ToString().Length + 1;
            return "pTile_" + Id.ToString().PadLeft(decimals, '0');
        }
        private String getRoomName(int Id)
        {
            int decimals = RDM.DungeonRooms.ToString().Length.ToString().Length + 1;
            return "pRoom_" + Id.ToString().PadLeft(decimals, '0');
        }
        #endregion
    }
}
