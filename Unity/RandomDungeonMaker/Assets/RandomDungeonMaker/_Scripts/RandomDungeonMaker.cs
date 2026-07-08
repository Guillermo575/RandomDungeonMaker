using System;
using System.Collections.Generic;
using System.Linq;
namespace RDM
{
    [Serializable]
    public class RandomDungeonMaker
    {
        #region Editor
        public int RNGSeed = 100, RNGSeedInn = 100, RNGSeedElement = 100;
        public int DungeonWidth, DungeonHeight, TotalBloquesDungeon;
        public int DungeonRoomsWidthMin = 2, DungeonRoomsWidthMax = 4, DungeonRoomsHeightMin = 2, DungeonRoomsHeightMax = 4;
        public int DungeonPathLongMin = 1, DungeonPathLongMax = 3, DungeonPathSizeMin = 1, DungeonPathSizeMax = 1;
        public enumDungeonRoomsSizeAmbivalence DungeonRoomsSizeAmbivalence = enumDungeonRoomsSizeAmbivalence.NO;
        public enumDungeonMode DungeonMode = enumDungeonMode.LABYRINTH;
        public enumLabyrinthInn LabyrinthInn = enumLabyrinthInn.YES;
        public enumLabyrinthInn LabyrinthPathInn = enumLabyrinthInn.YES;
        public enumStartPointX StartPointX = enumStartPointX.CENTER;
        public enumStartPointY StartPointY = enumStartPointY.CENTER;
        public enumOpenWorld OpenWorld = enumOpenWorld.NO;
        public enumSupportPlatforms SupportPlatforms = enumSupportPlatforms.NO;
        public bool FillDungeonRoomGap = false;
        public decimal OpenWorldRate = 0.5m;
        #endregion

        #region Public
        public Block[][] DungeonBlocks;
        public List<Room> DungeonRooms = new List<Room>();
        public List<Entities> lstEntities = new List<Entities>();
        public String HTMLTable { get { return GraphiqueDungeon(); } }
        public String HTMLTablePage { get { return "<!DOCTYPE html> <html> <body>" + GraphiqueDungeon() + "</body></html>"; } }
        #endregion

        #region Private
        private string _DungeonMode { get { return DungeonMode.ToString(); } }
        private int _StartPointX { get { return (int)StartPointX; } }
        private int _StartPointY { get { return (int)StartPointY; } }
        private int _OpenWorld { get { return (int)OpenWorld; } }
        private int _LabyrinthInn { get { return (int)LabyrinthInn; } }
        private int _LabyrinthPathInn { get { return (int)LabyrinthPathInn; } }
        private int _SupportPlatforms { get { return (int)SupportPlatforms; } }
        private int _DungeonRoomsSizeAmbivalence { get { return (int)DungeonRoomsSizeAmbivalence; } }
        public string Status { get; private set; } = "NOT";
        private MathRNG MathRNGSeed;
        private MathRNG MathRNGSeedInn;
        private MathRNG MathRNGSeedElement;
        #endregion

        #region enum
        public enum enumDungeonMode { LABYRINTH, CASTLE, TOWER, DUNGEON }
        public enum enumStartPointX { CENTER = 0, LEFT = -1, RIGHT = 1 }
        public enum enumStartPointY { CENTER = 0, TOP = -1, BOTTOM = 1 }
        public enum enumOpenWorld { NO = 0, SEMI = 1, YES = 2 }
        public enum enumLabyrinthInn { YES = 1, NO = 0 }
        public enum enumSupportPlatforms { NO = 0, YES = 1 }
        public enum enumDungeonRoomsSizeAmbivalence { NO = 0, YES = 1 }
        private enum Direccion
        {
            IzquierdaADerechaDesdeInicio, DerechaAIzquierdaDesdeInicio, IzquierdaADerechaDesdeFin, DerechaAIzquierdaDesdeFin,
            IzquierdaADerechaDesdeMedioHorizontal, IzquierdaADerechaesdeMedioVertical, DerechaAIzquierdaDesdeMedioHorizontal, DerechaAIzquierdaDesdeMedioVertical
        }
        private enum RoomSizeMode { Full, WidthOne, HeightOne }
        private enum DirectionMove { NONE = 0, LEFT = 1, RIGHT = 2, TOP = 3, BOTTOM = 4 }
        public enum RoomType { ROOM = 0, PATH = 1 }
        #endregion

        #region General
        public RandomDungeonMaker()
        {
            this.DungeonWidth = 8;
            this.DungeonHeight = 8;
            this.TotalBloquesDungeon = 50;
            this.RNGSeed = new System.Random().Next(1, 999999999);
            this.RNGSeedInn = new System.Random().Next(1, 999999999);
            this.RNGSeedElement = new System.Random().Next(1, 999999999);
        }
        public RandomDungeonMaker(int Width, int Height, int Blocks)
        {
            this.DungeonWidth = Width;
            this.DungeonHeight = Height;
            this.TotalBloquesDungeon = Blocks;
            this.RNGSeed = new System.Random().Next(1, 999999999);
            this.RNGSeedInn = new System.Random().Next(1, 999999999);
            this.RNGSeedElement = new System.Random().Next(1, 999999999);
        }
        public RandomDungeonMaker(int Width, int Height, int Blocks, int RNGSeed)
        {
            this.DungeonWidth = Width;
            this.DungeonHeight = Height;
            this.TotalBloquesDungeon = Blocks;
            this.RNGSeed = RNGSeed == 0 ? new System.Random().Next(1, 999999999) : RNGSeed < 0 ? -RNGSeed : RNGSeed;
            this.RNGSeedInn = this.RNGSeed;
            this.RNGSeedElement = this.RNGSeed;
        }
        public Block getBlock(int Id)
        {
            for (var l = 0; l < DungeonHeight; l++)
                for (var m = 0; m < DungeonWidth; m++)
                    if (DungeonBlocks[l][m].Id == Id)
                        return DungeonBlocks[l][m];
            return new Block(0, 0);
        }
        private bool getValidBlock(int x, int y)
        {
            return x >= 0 && x < DungeonWidth && y >= 0 && y < DungeonHeight;
        }
        private void AddCuadroDisponible(List<int[]> CuadrosDisponibles, int posX, int posY, int Id = 0, int direction = 0)
        {
            if (getAVailableValidBlock(posX, posY))
            {
                var lstEncontrado = (from x in CuadrosDisponibles where x[0] == posY && x[1] == posX select x).ToList();
                if (lstEncontrado.Count == 0)
                    CuadrosDisponibles.Add(new int[] { posY, posX, Id, direction });
            }
        }
        private bool getAVailableValidBlock(int posX, int posY)
        {
            return getValidBlock(posX, posY) && DungeonBlocks[posY][posX].Id == 0;
        }
        private bool getAVailableValidBlockRoom(int posX, int posY)
        {
            return getValidBlock(posX, posY) && DungeonBlocks[posY][posX] != null && DungeonBlocks[posY][posX].Room == 0 && DungeonBlocks[posY][posX].Id > 0;
        }
        #endregion

        #region makeDungeon
        public RandomDungeonMaker makeDungeon()
        {
            DungeonBlocks = new Block[DungeonHeight][];
            DungeonRooms = new List<Room>();
            this.MathRNGSeed = new MathRNG(RNGSeed);
            this.MathRNGSeedInn = new MathRNG(RNGSeedInn);
            this.MathRNGSeedElement = new MathRNG(RNGSeedElement);
            TotalBloquesDungeon = (DungeonWidth * DungeonHeight) <= TotalBloquesDungeon ? (DungeonWidth * DungeonHeight) : TotalBloquesDungeon;
            for (var l = 0; l < DungeonHeight; l++)
            {
                DungeonBlocks[l] = new Block[DungeonWidth];
                for (var m = 0; m < DungeonWidth; m++)
                {
                    DungeonBlocks[l][m] = new Block(m, l);
                }
            }
            if (_DungeonMode == "DUNGEON")
            {
                MakeDungeonAndRoomShape();
            }
            else
            {
                MakeDungeonShape();
                MakeDungeonRoomShape();
                MakeDungeonRoomConnections();
            }
            if (_LabyrinthInn == 1 || _LabyrinthPathInn == 1)
                MakeDungeonRoomInner();
            if (_SupportPlatforms == 1)
                MakeDungeonSupportPlatform();
            if (_OpenWorld != 0)
                ConfigureOpenWorld();
            if (!(lstEntities == null))
                DistributeDungeonElements();
            Status = "LOADED";
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
            StartX = (_StartPointX < 0) ? 0 : StartX;
            StartX = (_StartPointX > 0) ? (DungeonWidth - 1) : StartX;
            StartY = (_StartPointY < 0) ? 0 : StartY;
            StartY = (_StartPointY > 0) ? (DungeonHeight - 1) : StartY;
            CuadrosDisponibles.Add(new int[] { StartY, StartX });
            int[] CuadroSeleccionado = new int[2];
            int CuadroSeleccionadoX = 0;
            int CuadroSeleccionadoY = 0;
            for (var l = 1; l <= TotalBloquesDungeon; l++)
            {
                var randomNumber = MathRNGSeed.GetRandom(CuadrosDisponibles.Count - 1);
                if (_DungeonMode == "CASTLE" || _DungeonMode == "TOWER")
                {
                    randomNumber = MathRNGSeed.GetRandom(3) != 1 ? (CuadrosDisponibles.Count - 1) : randomNumber;
                }
                CuadroSeleccionado = CuadrosDisponibles[randomNumber];
                CuadroSeleccionadoY = CuadroSeleccionado[0];
                CuadroSeleccionadoX = CuadroSeleccionado[1];
                DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX].Id = l;
                if (_DungeonMode == "TOWER")
                {
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX - 1, CuadroSeleccionadoY);
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX + 1, CuadroSeleccionadoY);
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX, CuadroSeleccionadoY - 1);
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX, CuadroSeleccionadoY + 1);
                }
                else
                {
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX, CuadroSeleccionadoY - 1);
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX, CuadroSeleccionadoY + 1);
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX - 1, CuadroSeleccionadoY);
                    AddCuadroDisponible(CuadrosDisponibles, CuadroSeleccionadoX + 1, CuadroSeleccionadoY);
                }
                CuadrosDisponibles = (from x in CuadrosDisponibles where DungeonArray[x[0]][x[1]].Id == 0 select x).ToList();
            }
            MakeDungeonWalls();
        }
        #endregion

        #region Dungeon Mode
        private class DireccionSelect
        {
            public int filaInicio { get; set; }
            public int filaFin { get; set; }
            public int filaPaso { get; set; }
            public int colInicio { get; set; }
            public int colFin { get; set; } = 1;
            public int colPaso { get; set; } = 1;
            public static DireccionSelect getDireccionSelectData(Direccion direccion, int columnas, int filas)
            {
                DireccionSelect direccionSelect = new DireccionSelect();
                switch (direccion)
                {
                    case Direccion.IzquierdaADerechaDesdeInicio:
                        direccionSelect.filaInicio = 0; direccionSelect.filaFin = filas; direccionSelect.filaPaso = 1;
                        direccionSelect.colInicio = 0; direccionSelect.colFin = columnas; direccionSelect.colPaso = 1;
                        break;
                    case Direccion.DerechaAIzquierdaDesdeInicio:
                        direccionSelect.filaInicio = 0; direccionSelect.filaFin = filas; direccionSelect.filaPaso = 1;
                        direccionSelect.colInicio = 0; direccionSelect.colFin = -columnas; direccionSelect.colPaso = -1;
                        break;
                    case Direccion.IzquierdaADerechaDesdeFin:
                        direccionSelect.filaInicio = 0; direccionSelect.filaFin = -filas; direccionSelect.filaPaso = -1;
                        direccionSelect.colInicio = 0; direccionSelect.colFin = columnas; direccionSelect.colPaso = 1;
                        break;
                    case Direccion.DerechaAIzquierdaDesdeFin:
                        direccionSelect.filaInicio = 0; direccionSelect.filaFin = -filas; direccionSelect.filaPaso = -1;
                        direccionSelect.colInicio = columnas - 1; direccionSelect.colFin = -1; direccionSelect.colPaso = -1;
                        break;
                    case Direccion.IzquierdaADerechaDesdeMedioHorizontal:
                        direccionSelect.filaInicio = 0; direccionSelect.filaFin = filas; direccionSelect.filaPaso = 1;
                        direccionSelect.colInicio = -columnas / 2; direccionSelect.colFin = direccionSelect.colInicio + columnas; direccionSelect.colPaso = 1;
                        break;
                    case Direccion.IzquierdaADerechaesdeMedioVertical:
                        direccionSelect.filaInicio = -filas / 2; direccionSelect.filaFin = direccionSelect.filaInicio + filas; direccionSelect.filaPaso = 1;
                        direccionSelect.colInicio = 0; direccionSelect.colFin = columnas; direccionSelect.colPaso = 1;
                        break;
                    case Direccion.DerechaAIzquierdaDesdeMedioHorizontal:
                        direccionSelect.filaInicio = 0; direccionSelect.filaFin = -filas; direccionSelect.filaPaso = -1;
                        direccionSelect.colInicio = -columnas / 2; direccionSelect.colFin = direccionSelect.colInicio + columnas; direccionSelect.colPaso = 1;
                        break;
                    case Direccion.DerechaAIzquierdaDesdeMedioVertical:
                        direccionSelect.filaInicio = -filas / 2; direccionSelect.filaFin = direccionSelect.filaInicio + filas; direccionSelect.filaPaso = 1;
                        direccionSelect.colInicio = 0; direccionSelect.colFin = -columnas; direccionSelect.colPaso = -1;
                        break;
                }
                return direccionSelect;
            }
        }
        private int getValidRoom(int CuadroSeleccionadoX, int CuadroSeleccionadoY,
                                 int filaInicio, int filaFin, int filaPaso,
                                 int colInicio, int colFin, int colPaso,
                                 int CuadrosOcupados)
        {
            bool breakLoop = false;
            int cuadrosCreados = 0;
            bool ConectaOrigen = false;
            for (int fila = filaInicio; fila != filaFin && !breakLoop; fila += filaPaso)
            {
                for (int col = colInicio; col != colFin && !breakLoop; col += colPaso)
                {
                    if (getValidBlock(CuadroSeleccionadoX + col, CuadroSeleccionadoY + fila))
                    {
                        var BlockCursor = DungeonBlocks[CuadroSeleccionadoY + fila][CuadroSeleccionadoX + col];
                        if (BlockCursor.Id == 0)
                        {
                            cuadrosCreados++;
                        }
                        else
                        {
                            breakLoop = true; break;
                        }
                        if (!FillDungeonRoomGap && CuadrosOcupados + cuadrosCreados >= TotalBloquesDungeon)
                        {
                            breakLoop = true; break;
                        }
                    }
                    else
                    {
                        breakLoop = true; break;
                    }
                    ConectaOrigen = fila == 0 && col == 0 ? true : ConectaOrigen;
                }
            }
            return (ConectaOrigen) ? cuadrosCreados : 0;
        }
        private List<Direccion> getListDireccion()
        {
            List<Direccion> lstDireccion = new List<Direccion>();
            lstDireccion.Add(Direccion.DerechaAIzquierdaDesdeInicio);
            lstDireccion.Add(Direccion.IzquierdaADerechaDesdeFin);
            lstDireccion.Add(Direccion.DerechaAIzquierdaDesdeFin);
            lstDireccion.Add(Direccion.IzquierdaADerechaDesdeMedioHorizontal);
            lstDireccion.Add(Direccion.IzquierdaADerechaesdeMedioVertical);
            lstDireccion.Add(Direccion.DerechaAIzquierdaDesdeMedioHorizontal);
            lstDireccion.Add(Direccion.DerechaAIzquierdaDesdeMedioVertical);
            return lstDireccion;
        }
        private void MakeDungeonAndRoomShape()
        {
            List<int[]> CuadrosDisponibles = new List<int[]>();
            List<int[]> CuadrosDisponiblesDig = new List<int[]>();
            var DungeonArray = DungeonBlocks;
            int StartX = DungeonWidth / 2; int StartY = DungeonHeight / 2;
            StartX = (_StartPointX < 0) ? 0 : StartX;
            StartX = (_StartPointX > 0) ? (DungeonWidth - 1) : StartX;
            StartY = (_StartPointY < 0) ? 0 : StartY;
            StartY = (_StartPointY > 0) ? (DungeonHeight - 1) : StartY;
            CuadrosDisponibles.Add(new int[] { StartY, StartX, 0, 0 });
            CuadrosDisponiblesDig.Add(new int[] { StartY, StartX, 0, 0 });
            int[] CuadroSeleccionado = new int[4];
            int CuadroSeleccionadoX = 0; int CuadroSeleccionadoY = 0;
            int CuadroSeleccionadoId = 0;
            int CuadroSeleccionadoDir = 0;
            bool IsDigging = false;
            var blocksLoopIndex = 1;
            int RoomId = 1;
            bool breakWhile = false;
            Block BlockCursor = null;
            int Loops = 0;
            bool TakeOtherRoute = false;
            while (blocksLoopIndex <= TotalBloquesDungeon && !breakWhile)
            {
                int CuadrosCreados = 0;
                var randomWidth = 1;
                var randomHeight = 1;
                if (IsDigging)
                {
                    randomHeight = DungeonPathSizeMin == DungeonPathSizeMax ? DungeonPathSizeMin : MathRNGSeed.GetRandom(DungeonPathSizeMin, DungeonPathSizeMax);
                    randomWidth = DungeonPathLongMin == DungeonPathLongMax ? DungeonPathLongMin : MathRNGSeed.GetRandom(DungeonPathLongMin, DungeonPathLongMax);
                }
                else
                {
                    randomWidth = MathRNGSeed.GetRandom(DungeonRoomsWidthMin, DungeonRoomsWidthMax);
                    randomHeight = MathRNGSeed.GetRandom(DungeonRoomsHeightMin, DungeonRoomsHeightMax);
                    randomHeight = _DungeonRoomsSizeAmbivalence == 1 ? randomWidth : randomHeight;
                }
                int filas = randomHeight;
                int columnas = randomWidth;
                int filaInicio = 0, filaFin = filas, filaPaso = 1;
                int colInicio = 0, colFin = columnas, colPaso = 1;
                var direccion = Direccion.IzquierdaADerechaDesdeInicio;
                var roomSizeMode = RoomSizeMode.Full;
                int CuadrosCreadosMayor = 0;
                while (CuadrosDisponiblesDig.Count > 0 && CuadrosCreadosMayor < randomWidth * randomHeight)
                {
                    var randomNumber = MathRNGSeed.GetRandom(CuadrosDisponiblesDig.Count - 1);
                    CuadroSeleccionado = CuadrosDisponiblesDig[randomNumber];
                    CuadrosDisponiblesDig.RemoveAt(randomNumber);
                    CuadrosCreadosMayor = 0;
                    CuadroSeleccionadoY = CuadroSeleccionado[0];
                    CuadroSeleccionadoX = CuadroSeleccionado[1];
                    CuadroSeleccionadoId = CuadroSeleccionado[2];
                    CuadroSeleccionadoDir = CuadroSeleccionado[3];
                    List<Direccion> lstDireccion = getListDireccion();
                    while (lstDireccion.Count > 0 && CuadrosCreadosMayor < randomWidth * randomHeight)
                    {
                        int CuadrosPosibles = 0;
                        var index = MathRNGSeed.GetRandom(lstDireccion.Count - 1);
                        var direccionLoop = lstDireccion[index];
                        var roomSizeModeLoop = RoomSizeMode.Full;
                        if (IsDigging)
                        {
                            var horizontalBlocks = (getAVailableValidBlock(CuadroSeleccionadoX - 1, CuadroSeleccionadoY) ? 1 : 0) + (getAVailableValidBlock(CuadroSeleccionadoX + 1, CuadroSeleccionadoY) ? 1 : 0);
                            var verticalBlocks = (getAVailableValidBlock(CuadroSeleccionadoX, CuadroSeleccionadoY - 1) ? 1 : 0) + (getAVailableValidBlock(CuadroSeleccionadoX, CuadroSeleccionadoY + 1) ? 1 : 0);
                            var DireccionSelectDataDigHor = DireccionSelect.getDireccionSelectData(direccionLoop, randomWidth, randomHeight);
                            var DireccionSelectDataDigVer = DireccionSelect.getDireccionSelectData(direccionLoop, randomHeight, randomWidth);
                            var lstDireccionSelect = new List<DireccionSelect>();
                            if (horizontalBlocks > verticalBlocks || (horizontalBlocks == verticalBlocks && MathRNGSeed.GetRandom(0, 1) == 0))
                            {
                                lstDireccionSelect.Add(DireccionSelectDataDigVer);
                                lstDireccionSelect.Add(DireccionSelectDataDigHor);
                                roomSizeModeLoop = RoomSizeMode.WidthOne;
                            }
                            else
                            {
                                lstDireccionSelect.Add(DireccionSelectDataDigHor);
                                lstDireccionSelect.Add(DireccionSelectDataDigVer);
                                roomSizeModeLoop = RoomSizeMode.HeightOne;
                            }
                            var DireccionSelectDataDig = lstDireccionSelect.First();
                            CuadrosPosibles = getValidRoom(CuadroSeleccionadoX, CuadroSeleccionadoY,
                                                           DireccionSelectDataDig.filaInicio, DireccionSelectDataDig.filaFin, DireccionSelectDataDig.filaPaso,
                                                           DireccionSelectDataDig.colInicio, DireccionSelectDataDig.colFin, DireccionSelectDataDig.colPaso, blocksLoopIndex - 1);
                            if (CuadrosPosibles < CuadrosCreadosMayor)
                            {
                                DireccionSelectDataDig = lstDireccionSelect.Last();
                                CuadrosPosibles = getValidRoom(CuadroSeleccionadoX, CuadroSeleccionadoY,
                                                              DireccionSelectDataDig.filaInicio, DireccionSelectDataDig.filaFin, DireccionSelectDataDig.filaPaso,
                                                              DireccionSelectDataDig.colInicio, DireccionSelectDataDig.colFin, DireccionSelectDataDig.colPaso, blocksLoopIndex - 1);
                                roomSizeModeLoop = roomSizeModeLoop == RoomSizeMode.WidthOne ? RoomSizeMode.HeightOne : RoomSizeMode.WidthOne;
                            }
                        }
                        else
                        {
                            var DireccionSelectData = DireccionSelect.getDireccionSelectData(direccionLoop, randomWidth, randomHeight);
                            CuadrosPosibles = getValidRoom(CuadroSeleccionadoX, CuadroSeleccionadoY,
                                                           DireccionSelectData.filaInicio, DireccionSelectData.filaFin, DireccionSelectData.filaPaso,
                                                           DireccionSelectData.colInicio, DireccionSelectData.colFin, DireccionSelectData.colPaso, blocksLoopIndex - 1);
                        }
                        if (CuadrosPosibles > CuadrosCreadosMayor)
                        {
                            CuadrosCreadosMayor = CuadrosPosibles;
                            direccion = direccionLoop;
                            roomSizeMode = roomSizeModeLoop;
                        }
                        lstDireccion.RemoveAt(index);
                    }
                }
                DireccionSelect direccionSelect = new DireccionSelect();
                switch (roomSizeMode)
                {
                    case RoomSizeMode.Full: direccionSelect = DireccionSelect.getDireccionSelectData(direccion, randomWidth, randomHeight); break;
                    case RoomSizeMode.WidthOne: direccionSelect = DireccionSelect.getDireccionSelectData(direccion, randomHeight, randomWidth); break;
                    case RoomSizeMode.HeightOne: direccionSelect = DireccionSelect.getDireccionSelectData(direccion, randomWidth, randomHeight); break;
                }
                filaInicio = direccionSelect.filaInicio; filaFin = direccionSelect.filaFin; filaPaso = direccionSelect.filaPaso;
                colInicio = direccionSelect.colInicio; colFin = direccionSelect.colFin; colPaso = direccionSelect.colPaso;
                BlockCursor = null;
                var breakLoop = false;
                List<Block> lstBlocks = new List<Block>();
                for (int fila = filaInicio; fila != filaFin && !breakLoop; fila += filaPaso)
                {
                    for (int col = colInicio; col != colFin && !breakLoop; col += colPaso)
                    {
                        if (getValidBlock(CuadroSeleccionadoX + col, CuadroSeleccionadoY + fila))
                        {
                            BlockCursor = DungeonArray[CuadroSeleccionadoY + fila][CuadroSeleccionadoX + col];
                            if (BlockCursor.Id == 0)
                            {
                                BlockCursor.Id = blocksLoopIndex;
                                BlockCursor.Room = RoomId;
                                blocksLoopIndex++;
                                CuadrosCreados++;
                                if (!FillDungeonRoomGap && blocksLoopIndex > TotalBloquesDungeon)
                                {
                                    breakLoop = true;
                                }
                                lstBlocks.Add(BlockCursor);
                            }
                            else
                            {
                                breakLoop = true;
                            }
                        }
                        else
                        {
                            breakLoop = true;
                        }
                    }
                }
                var lstBloquesRoom = (from x in lstBlocks where x.Room == RoomId select x).ToList();
                if (lstBloquesRoom.Count > 0)
                {
                    var lstMinX = lstBloquesRoom.Min(x => x.X);
                    var lstMaxX = lstBloquesRoom.Max(x => x.X);
                    var lstMinY = lstBloquesRoom.Min(x => x.Y);
                    var lstMaxY = lstBloquesRoom.Max(x => x.Y);
                    var newRoom = new Room(DungeonRooms.Count, IsDigging ? RoomType.PATH : RoomType.ROOM);
                    newRoom.Blocks = new RoomBlock[lstMaxY - lstMinY + 1][];
                    for (var l = 0; l + lstMinY <= lstMaxY; l++)
                    {
                        newRoom.Blocks[l] = new RoomBlock[lstMaxX - lstMinX + 1];
                        for (var m = 0; m + lstMinX <= lstMaxX; m++)
                        {
                            BlockCursor = DungeonArray[l + lstMinY][m + lstMinX];
                            if (BlockCursor.Id > 0)
                            {
                                var lstEncontrado = (from x in lstBloquesRoom where x.Id == BlockCursor.Id select x).ToList();
                                if (lstEncontrado.Count > 0)
                                {
                                    BlockCursor.RoomY = l;
                                    BlockCursor.RoomX = m;
                                    newRoom.Blocks[l][m] = new RoomBlock(lstEncontrado.First(), m, l);
                                }
                                else
                                {
                                    newRoom.Blocks[l][m] = new RoomBlock(new Block(m, l), m, l);
                                }
                            }
                            else
                            {
                                newRoom.Blocks[l][m] = new RoomBlock(new Block(m, l), m, l);
                            }
                        }
                    }
                    DungeonRooms.Add(newRoom);
                }
                for (int fila = filaInicio; fila != filaFin; fila += filaPaso)
                {
                    for (int col = colInicio; col != colFin; col += colPaso)
                    {
                        if (getValidBlock(CuadroSeleccionadoX + col, CuadroSeleccionadoY + fila))
                        {
                            BlockCursor = DungeonArray[CuadroSeleccionadoY + fila][CuadroSeleccionadoX + col];
                            if (BlockCursor.Id > 0 && BlockCursor.Room == RoomId)
                            {
                                int posX = CuadroSeleccionadoX + col;
                                int posY = CuadroSeleccionadoY + fila;
                                AddCuadroDisponible(CuadrosDisponibles, posX, posY - 1, BlockCursor.Id, 4);
                                AddCuadroDisponible(CuadrosDisponibles, posX, posY + 1, BlockCursor.Id, 3);
                                AddCuadroDisponible(CuadrosDisponibles, posX - 1, posY, BlockCursor.Id, 2);
                                AddCuadroDisponible(CuadrosDisponibles, posX + 1, posY, BlockCursor.Id, 1);
                                CuadrosDisponiblesDig = new List<int[]>();
                                AddCuadroDisponible(CuadrosDisponiblesDig, posX, posY - 1, BlockCursor.Id, 4);
                                AddCuadroDisponible(CuadrosDisponiblesDig, posX, posY + 1, BlockCursor.Id, 3);
                                AddCuadroDisponible(CuadrosDisponiblesDig, posX - 1, posY, BlockCursor.Id, 2);
                                AddCuadroDisponible(CuadrosDisponiblesDig, posX + 1, posY, BlockCursor.Id, 1);
                            }
                        }
                    }
                }
                BlockCursor = DungeonArray[CuadroSeleccionadoY][CuadroSeleccionadoX];
                if (BlockCursor.Id > 0 && CuadroSeleccionadoId > 0)
                {
                    var BlockJoin = getBlock(CuadroSeleccionadoId);
                    switch ((DirectionMove)CuadroSeleccionadoDir)
                    {
                        case DirectionMove.LEFT:
                            clearWallConnectRoom(BlockCursor, BlockJoin, DirectionMove.LEFT);
                            clearWallConnectRoom(BlockJoin, BlockCursor, DirectionMove.RIGHT);
                            break;
                        case DirectionMove.RIGHT:
                            clearWallConnectRoom(BlockCursor, BlockJoin, DirectionMove.RIGHT);
                            clearWallConnectRoom(BlockJoin, BlockCursor, DirectionMove.LEFT);
                            break;
                        case DirectionMove.TOP:
                            clearWallConnectRoom(BlockCursor, BlockJoin, DirectionMove.TOP);
                            clearWallConnectRoom(BlockJoin, BlockCursor, DirectionMove.BOTTOM);
                            break;
                        case DirectionMove.BOTTOM:
                            clearWallConnectRoom(BlockCursor, BlockJoin, DirectionMove.BOTTOM);
                            clearWallConnectRoom(BlockJoin, BlockCursor, DirectionMove.TOP);
                            break;
                    }
                }
                breakWhile = CuadrosDisponibles.Count == 0;
                CuadrosDisponibles = (from x in CuadrosDisponibles where DungeonArray[x[0]][x[1]].Id == 0 select x).ToList();
                Loops++;
                RoomId += CuadrosCreados > 0 ? 1 : 0;
                IsDigging = CuadrosCreados > 0 && CuadrosDisponiblesDig.Count > 0 ? !IsDigging : false;
                TakeOtherRoute = CuadrosCreados > 0 && CuadrosDisponiblesDig.Count > 0 ? false : true;
                if (IsDigging || TakeOtherRoute)
                {
                    CuadrosDisponiblesDig = new List<int[]>();
                    foreach (var obj in CuadrosDisponibles)
                    {
                        CuadrosDisponiblesDig.Add(new int[] { obj[0], obj[1], obj[2], obj[3] });
                    }
                }
            }
            MakeDungeonWalls();
            MakeDungeonRoomWalls();
        }
        #endregion

        #region DungeonWalls
        public void MakeDungeonWalls()
        {
            for (var l = 0; l < DungeonHeight; l++)
            {
                for (var m = 0; m < DungeonWidth; m++)
                {
                    if (DungeonBlocks[l][m].Id > 0)
                    {
                        DungeonBlocks[l][m].WallTop = ((l - 1) < 0) ? 1 : (DungeonBlocks[l - 1][m].Id == 0) ? 1 : 0;
                        DungeonBlocks[l][m].WallBottom = ((l + 1) >= DungeonHeight) ? 1 : (DungeonBlocks[l + 1][m].Id == 0) ? 1 : 0;
                        DungeonBlocks[l][m].WallLeft = ((m - 1) < 0) ? 1 : (DungeonBlocks[l][m - 1].Id == 0) ? 1 : 0;
                        DungeonBlocks[l][m].WallRight = ((m + 1) >= DungeonWidth) ? 1 : (DungeonBlocks[l][m + 1].Id == 0) ? 1 : 0;
                    }
                    else
                    {
                        DungeonBlocks[l][m].Status = "VOID";
                    }
                }
            }
        }
        public void MakeDungeonRoomWalls()
        {
            for (var r = 0; r < DungeonRooms.Count; r++)
            {
                for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
                {
                    for (var a = 0; a < DungeonRooms[r].Blocks[b].Length; a++)
                    {
                        var DungeonRoomsBlocks = DungeonRooms[r].Blocks;
                        var DungeonSelectedBlock = DungeonRoomsBlocks[b][a].Block;
                        DungeonSelectedBlock.WallTop = DungeonSelectedBlock.ConnectTop != null ? 0 : ((b - 1) < 0 || DungeonRoomsBlocks[b - 1][a].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallTop;
                        DungeonSelectedBlock.WallLeft = DungeonSelectedBlock.ConnectLeft != null ? 0 : ((a - 1) < 0 || DungeonRoomsBlocks[b][a - 1].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallLeft;
                        DungeonSelectedBlock.WallRight = DungeonSelectedBlock.ConnectRight != null ? 0 : ((a + 1) >= DungeonRooms[r].Blocks[b].Length || DungeonRoomsBlocks[b][a + 1].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallRight;
                        DungeonSelectedBlock.WallBottom = DungeonSelectedBlock.ConnectBottom != null ? 0 : ((b + 1) >= DungeonRooms[r].Blocks.Length || DungeonRoomsBlocks[b + 1][a].Block.Id == 0) ? 1 : DungeonSelectedBlock.WallBottom;
                    }
                }
            }
        }
        #endregion

        #region MakeDungeonRoomShape
        private void MakeDungeonRoomShape()
        {
            var DungeonArray = this.DungeonBlocks;
            for (var y = 0; y < DungeonHeight; y++)
            {
                for (var x = 0; x < DungeonWidth; x++)
                {
                    if (DungeonArray[y][x].Id > 0 && DungeonArray[y][x].Room == 0)
                    {
                        var randomWidth = MathRNGSeed.GetRandom(DungeonRoomsWidthMin, DungeonRoomsWidthMax);
                        var randomHeight = MathRNGSeed.GetRandom(DungeonRoomsHeightMin, DungeonRoomsHeightMax);
                        randomHeight = _DungeonRoomsSizeAmbivalence == 1 ? randomWidth : randomHeight;
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
                        BlockCursor.Room = newRoom.Id;
                        BlockCursor.RoomY = l;
                        BlockCursor.RoomX = m;
                        BloquesLiberados.Add(BlockCursor);
                        newRoom.Blocks[l][m] = new RoomBlock(BlockCursor, m, l);
                        while (EspacioDisponible)
                        {
                            List<Block> BloquesDisponibles = new List<Block>();
                            List<string> DireccionesDisponibles = new List<string>();
                            if ((m - 1) >= 0 && getAVailableValidBlockRoom(encontradoX + m - 1, encontradoY + l))
                            {
                                BloquesDisponibles.Add(DungeonArray[(encontradoY + l)][(encontradoX + m) - 1]);
                                DireccionesDisponibles.Add("LEFT");
                            }
                            if ((m + 1) < randomWidth && getAVailableValidBlockRoom(encontradoX + m + 1, encontradoY + l))
                            {
                                BloquesDisponibles.Add(DungeonArray[(encontradoY + l)][(encontradoX + m) + 1]);
                                DireccionesDisponibles.Add("RIGHT");
                            }
                            if ((l - 1) >= 0 && getAVailableValidBlockRoom(encontradoX + m, encontradoY + l - 1))
                            {
                                BloquesDisponibles.Add(DungeonArray[(encontradoY + l) - 1][(encontradoX + m)]);
                                DireccionesDisponibles.Add("TOP");
                            }
                            if ((l + 1) < randomHeight && getAVailableValidBlockRoom(encontradoX + m, encontradoY + l + 1))
                            {
                                BloquesDisponibles.Add(DungeonArray[(encontradoY + l) + 1][(encontradoX + m)]);
                                DireccionesDisponibles.Add("BOTTOM");
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
            MakeDungeonRoomWalls();
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
                var cuartoCumplido = 0;
                var DungeonRoomSelected = DungeonRooms[r];
                List<RoomBlock> DungeonRoomBlocksLotery = new List<RoomBlock>();
                for (var b = 0; b < DungeonRoomSelected.Blocks.Length; b++)
                    for (var a = 0; a < DungeonRoomSelected.Blocks[b].Length; a++)
                        if (DungeonRoomSelected.Blocks[b][a].Block.Id > 0)
                            DungeonRoomBlocksLotery.Add(DungeonRoomSelected.Blocks[b][a]);
                while (DungeonRoomBlocksLotery.Count > 0 && cuartoCumplido == 0)
                {
                    Block DungeonSelectedJoin = null;
                    int randomNumber = MathRNGSeedInn.GetRandom(DungeonRoomBlocksLotery.Count - 1);
                    int randomConnection = MathRNGSeedInn.GetRandom(2);
                    randomNumber = randomConnection == 1 ? 0 : randomNumber;
                    randomNumber = randomConnection == 2 ? DungeonRoomBlocksLotery.Count - 1 : randomNumber;
                    var DungeonSelected = DungeonRoomBlocksLotery[randomNumber];
                    DungeonRoomBlocksLotery.RemoveAt(randomNumber);
                    var DungeonBlockSelected = DungeonSelected.Block;
                    if (DungeonBlockSelected.X > 0 && cuartoCumplido == 0)
                    {
                        DungeonSelectedJoin = DungeonArray[DungeonBlockSelected.Y][DungeonBlockSelected.X - 1];
                        if (DungeonSelectedJoin.Id > 0 && DungeonSelectedJoin.Room != DungeonRoomSelected.Id && !BuscarPuertaColocada(RoomVisited, DungeonSelectedJoin.Room))
                        {
                            clearWallConnectRoom(DungeonBlockSelected, DungeonSelectedJoin, DirectionMove.LEFT);
                            clearWallConnectRoom(DungeonSelectedJoin, DungeonBlockSelected, DirectionMove.RIGHT);
                            cuartoCumplido = 1;
                        }
                    }
                    if (DungeonBlockSelected.X < (DungeonWidth - 1) && cuartoCumplido == 0)
                    {
                        DungeonSelectedJoin = DungeonArray[DungeonBlockSelected.Y][DungeonBlockSelected.X + 1];
                        if (DungeonSelectedJoin.Id > 0 && DungeonSelectedJoin.Room != DungeonRoomSelected.Id && !BuscarPuertaColocada(RoomVisited, DungeonSelectedJoin.Room))
                        {
                            clearWallConnectRoom(DungeonBlockSelected, DungeonSelectedJoin, DirectionMove.RIGHT);
                            clearWallConnectRoom(DungeonSelectedJoin, DungeonBlockSelected, DirectionMove.LEFT);
                            cuartoCumplido = 1;
                        }
                    }
                    if (DungeonBlockSelected.Y > 0 && cuartoCumplido == 0)
                    {
                        DungeonSelectedJoin = DungeonArray[DungeonBlockSelected.Y - 1][DungeonBlockSelected.X];
                        if (DungeonSelectedJoin.Id > 0 && DungeonSelectedJoin.Room != DungeonRoomSelected.Id && !BuscarPuertaColocada(RoomVisited, DungeonSelectedJoin.Room))
                        {
                            clearWallConnectRoom(DungeonBlockSelected, DungeonSelectedJoin, DirectionMove.TOP);
                            clearWallConnectRoom(DungeonSelectedJoin, DungeonBlockSelected, DirectionMove.BOTTOM);
                            cuartoCumplido = 1;
                        }
                    }
                    if (DungeonBlockSelected.Y < (DungeonHeight - 1) && cuartoCumplido == 0)
                    {
                        DungeonSelectedJoin = DungeonArray[DungeonBlockSelected.Y + 1][DungeonBlockSelected.X];
                        if (DungeonSelectedJoin.Id > 0 && DungeonSelectedJoin.Room != DungeonRoomSelected.Id && !BuscarPuertaColocada(RoomVisited, DungeonSelectedJoin.Room))
                        {
                            clearWallConnectRoom(DungeonBlockSelected, DungeonSelectedJoin, DirectionMove.BOTTOM);
                            clearWallConnectRoom(DungeonSelectedJoin, DungeonBlockSelected, DirectionMove.TOP);
                            cuartoCumplido = 1;
                        }
                    }
                    if (cuartoCumplido > 0)
                    {
                        RoomVisited.Add(new RoomVisited(DungeonRooms[DungeonSelectedJoin.Room - 1], RoomVisitedActual));
                        DungeonRoomSelected.Connections.Add(DungeonSelectedJoin.Room.ToString());
                        DungeonRooms[DungeonSelectedJoin.Room - 1].Connections.Add(DungeonRoomSelected.Id.ToString());
                    }
                }
                RoomVisitedActual = (cuartoCumplido != 0) ? RoomVisited[RoomVisited.Count - 1] : RoomVisitedActual.RoomAnterior;
            }
        }
        private bool BuscarPuertaColocada(List<RoomVisited> RoomVisited, int puertaColocada)
        {
            for (var l = 0; l < RoomVisited.Count; l++)
            {
                if (RoomVisited[l].Room.Id == puertaColocada)
                {
                    return true;
                }
            }
            return false;
        }
        private void clearWallConnectRoom(Block block, Block blockJoin, DirectionMove direction)
        {
            switch (direction)
            {
                case DirectionMove.LEFT:
                    block.ConnectLeft = blockJoin;
                    block.WallLeft = 0;
                    break;
                case DirectionMove.RIGHT:
                    block.ConnectRight = blockJoin;
                    block.WallRight = 0;
                    break;
                case DirectionMove.TOP:
                    block.ConnectTop = blockJoin;
                    block.WallTop = 0;
                    break;
                case DirectionMove.BOTTOM:
                    block.ConnectBottom = blockJoin;
                    block.WallBottom = 0;
                    break;
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
                if (DungeonRooms[r].Blocks.Length == 1 || DungeonRooms[r].Blocks[0].Length == 1 ||
                   (DungeonRooms[r].roomType == RoomType.ROOM && LabyrinthInn == enumLabyrinthInn.NO) ||
                   (DungeonRooms[r].roomType == RoomType.PATH && LabyrinthPathInn == enumLabyrinthInn.NO))
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
                                    var numseleccionado = MathRNGSeedInn.GetRandom(BloquesDisponibles.Count - 1);
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
                                    BloqueSeleccionado.SupportPlatformBottom = "RIGHT";
                                if (BloqueSeleccionado.ConnectLeft != null)
                                    BloqueSeleccionado.SupportPlatformBottom = "LEFT";
                                if (BloqueSeleccionado.ConnectBottom != null)
                                    BloqueSeleccionado.SupportPlatformBottom = "CENTER";
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
                                    BloqueSeleccionado.SupportPlatformTop = "RIGHT";
                                if (BloqueSeleccionado.ConnectLeft != null)
                                    BloqueSeleccionado.SupportPlatformTop = "LEFT";
                                if (BloqueSeleccionado.ConnectTop != null)
                                    BloqueSeleccionado.SupportPlatformTop = "CENTER";
                            }
                        }
                    }
                }
            }
        }
        #endregion

        #region OpenWorld OLD
        //private void ConfigureOpenWorld()
        //{
        //    var DungeonArray = DungeonBlocks;
        //    for (var l = 0; l < DungeonHeight; l++)
        //    {
        //        for (var m = 0; m < DungeonWidth; m++)
        //        {
        //            var DungeonSelectedBlock = DungeonArray[l][m];
        //            if (DungeonSelectedBlock.Id > 0)
        //            {
        //                DungeonSelectedBlock.ConnectTop = null;
        //                DungeonSelectedBlock.ConnectRight = null;
        //                DungeonSelectedBlock.ConnectBottom = null;
        //                DungeonSelectedBlock.ConnectLeft = null;
        //                var randNum = _OpenWorld == 2 ? MathRNGSeed.GetRandom(2) : MathRNGSeed.GetRandom(1);
        //                if (randNum != 0)
        //                {
        //                    if ((l - 1) >= 0 && DungeonArray[l - 1][m].Id > 0)
        //                    {
        //                        if (_OpenWorld == 2 || DungeonSelectedBlock.WallTop == 0)
        //                        {
        //                            DungeonSelectedBlock.WallTop = 0;
        //                            DungeonSelectedBlock.RoomWallTop = 0;
        //                            DungeonArray[l - 1][m].WallBottom = 0;
        //                            DungeonArray[l - 1][m].RoomWallBottom = 0;
        //                        }
        //                    }
        //                    if ((l + 1) < DungeonHeight && DungeonArray[l + 1][m].Id > 0)
        //                    {
        //                        if (_OpenWorld == 2 || DungeonSelectedBlock.WallBottom == 0)
        //                        {
        //                            DungeonSelectedBlock.WallBottom = 0;
        //                            DungeonSelectedBlock.RoomWallBottom = 0;
        //                            DungeonArray[l + 1][m].WallTop = 0;
        //                            DungeonArray[l + 1][m].RoomWallTop = 0;
        //                        }
        //                    }
        //                    if ((m - 1) >= 0 && DungeonArray[l][m - 1].Id > 0)
        //                    {
        //                        if (_OpenWorld == 2 || DungeonSelectedBlock.WallLeft == 0)
        //                        {
        //                            DungeonSelectedBlock.WallLeft = 0;
        //                            DungeonSelectedBlock.RoomWallLeft = 0;
        //                            DungeonArray[l][m - 1].WallRight = 0;
        //                            DungeonArray[l][m - 1].RoomWallRight = 0;
        //                        }
        //                    }
        //                    if ((m + 1) < DungeonWidth && DungeonArray[l][m + 1].Id > 0)
        //                    {
        //                        if (_OpenWorld == 2 || DungeonSelectedBlock.WallRight == 0)
        //                        {
        //                            DungeonSelectedBlock.WallRight = 0;
        //                            DungeonSelectedBlock.RoomWallRight = 0;
        //                            DungeonArray[l][m + 1].WallLeft = 0;
        //                            DungeonArray[l][m + 1].RoomWallLeft = 0;
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
        #endregion

        #region OpenWorld
        private void ConfigureOpenWorld()
        {
            var DungeonArray = DungeonBlocks;
            for (var r = 0; r < DungeonRooms.Count; r++)
            {
                if (OpenWorld == enumOpenWorld.SEMI)
                {
                    var randNumRoom = MathRNGSeedInn.GetRandom(1);
                    if (randNumRoom != 0) continue;
                }
                for (var a = 0; a < DungeonRooms[r].Blocks[0].Length; a++)
                {
                    for (var b = 0; b < DungeonRooms[r].Blocks.Length; b++)
                    {
                        var DungeonSelectedBlock = DungeonRooms[r].Blocks[b][a].Block;
                        int l = DungeonSelectedBlock.Y;
                        int m = DungeonSelectedBlock.X;
                        if (DungeonSelectedBlock.Id > 0)
                        {
                            if (OpenWorldRate != 1 && (OpenWorldRate == 0 || MathRNGSeedInn.GetRandom() > OpenWorldRate)) continue;
                            DungeonSelectedBlock.ConnectTop = null;
                            DungeonSelectedBlock.ConnectRight = null;
                            DungeonSelectedBlock.ConnectBottom = null;
                            DungeonSelectedBlock.ConnectLeft = null;
                            if ((l - 1) >= 0 && DungeonArray[l - 1][m].Id > 0)
                            {
                                if (DungeonSelectedBlock.hasWallTop)
                                {
                                    DungeonSelectedBlock.WallTop = 0;
                                    DungeonSelectedBlock.RoomWallTop = 0;
                                    DungeonArray[l - 1][m].WallBottom = 0;
                                    DungeonArray[l - 1][m].RoomWallBottom = 0;
                                }
                            }
                            if ((l + 1) < DungeonHeight && DungeonArray[l + 1][m].Id > 0)
                            {
                                if (DungeonSelectedBlock.hasWallBottom)
                                {
                                    DungeonSelectedBlock.WallBottom = 0;
                                    DungeonSelectedBlock.RoomWallBottom = 0;
                                    DungeonArray[l + 1][m].WallTop = 0;
                                    DungeonArray[l + 1][m].RoomWallTop = 0;
                                }
                            }
                            if ((m - 1) >= 0 && DungeonArray[l][m - 1].Id > 0)
                            {
                                if (DungeonSelectedBlock.hasWallLeft)
                                {
                                    DungeonSelectedBlock.WallLeft = 0;
                                    DungeonSelectedBlock.RoomWallLeft = 0;
                                    DungeonArray[l][m - 1].WallRight = 0;
                                    DungeonArray[l][m - 1].RoomWallRight = 0;
                                }
                            }
                            if ((m + 1) < DungeonWidth && DungeonArray[l][m + 1].Id > 0)
                            {
                                if (DungeonSelectedBlock.hasWallRight)
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
        public Block GetBlock(int x, int y)
        {
            return x >= 0 && y >= 0 && x < DungeonWidth && y < DungeonHeight ? DungeonBlocks[y][x] : new Block(x, y);
        }
        private bool CheckWallElementConsideration(Entities.enumWallElementConsideration Conditional, int Wall, int RoomWall, bool valido)
        {
            if (Conditional == Entities.enumWallElementConsideration.YES && Wall == 0 && RoomWall == 0) return false;
            if (Conditional == Entities.enumWallElementConsideration.BORDER && Wall == 0) return false;
            if (Conditional == Entities.enumWallElementConsideration.ROOM && (Wall == 1 || RoomWall == 0)) return false;
            if (Conditional == Entities.enumWallElementConsideration.NONE && (Wall == 1 || RoomWall == 1)) return false;
            return valido;
        }
        private void DistributeDungeonElements()
        {
            var ElementIdC = 1;
            for (var x = 0; x < lstEntities.Count; x++)
            {
                var itemElement = lstEntities[x];
                List<Block> BloquesDisponibles = new List<Block>();
                List<Block> BloquesValidos = new List<Block>();
                for (var l = 0; l < DungeonHeight; l++)
                {
                    for (var m = 0; m < DungeonWidth; m++)
                    {
                        var Block = DungeonBlocks[l][m];
                        if (Block.Id > 0)
                        {
                            var valido = true;
                            if (itemElement.IsImportant)
                            {
                                BloquesValidos.Add(Block);
                            }
                            if (itemElement.NotIndoor == Entities.enumIndoorConsideration.NOT_INDOOR && (Block.ConnectTop != null || Block.ConnectRight != null || Block.ConnectBottom != null || Block.ConnectLeft != null))
                            {
                                valido = false;
                            }
                            else
                            {
                                if (itemElement.NotIndoor == Entities.enumIndoorConsideration.ONLY_INDOOR && (Block.ConnectTop == null && Block.ConnectRight == null && Block.ConnectBottom == null && Block.ConnectLeft == null))
                                    valido = false;
                            }
                            if (Block.lstElementos.Count >= itemElement.OcuppedTolerance)
                                valido = false;
                            if (itemElement.ObligatoryBottomWall != Entities.enumWallElementConsideration.NOT_IMPORTANT)
                                valido = CheckWallElementConsideration(itemElement.ObligatoryBottomWall, Block.WallBottom, Block.RoomWallBottom, valido);
                            if (itemElement.ObligatoryTopWall != Entities.enumWallElementConsideration.NOT_IMPORTANT)
                                valido = CheckWallElementConsideration(itemElement.ObligatoryTopWall, Block.WallTop, Block.RoomWallTop, valido);
                            if (itemElement.ObligatoryLeftWall != Entities.enumWallElementConsideration.NOT_IMPORTANT)
                                valido = CheckWallElementConsideration(itemElement.ObligatoryLeftWall, Block.WallLeft, Block.RoomWallLeft, valido);
                            if (itemElement.ObligatoryRightWall != Entities.enumWallElementConsideration.NOT_IMPORTANT)
                                valido = CheckWallElementConsideration(itemElement.ObligatoryRightWall, Block.WallRight, Block.RoomWallRight, valido);
                            if (valido)
                                BloquesDisponibles.Add(Block);
                        }
                    }
                }
                for (var l = 0; l < itemElement.Total && (BloquesDisponibles.Count > 0 || BloquesValidos.Count > 0); l++)
                {
                    if (BloquesDisponibles.Count > 0)
                    {
                        var numseleccionado = MathRNGSeedElement.GetRandom(BloquesDisponibles.Count - 1);
                        var BlockSeleccionado = BloquesDisponibles[numseleccionado];
                        var NewElement = new Element(itemElement.NameTag, itemElement.UID, BlockSeleccionado.Id, ElementIdC);
                        if (itemElement.Objetos == null)
                            itemElement.Objetos = new List<Element>();
                        itemElement.Objetos.Add(NewElement);
                        BlockSeleccionado.lstElementos.Add(NewElement);
                        ElementIdC++;
                        BloquesDisponibles.RemoveAt(numseleccionado);
                    }
                    else
                    {
                        if (BloquesValidos.Count > 0)
                        {
                            var numseleccionado = MathRNGSeedElement.GetRandom(BloquesValidos.Count - 1);
                            var BlockSeleccionado = BloquesValidos[numseleccionado];
                            var NewElement = new Element(itemElement.NameTag, itemElement.UID, BlockSeleccionado.Id, ElementIdC);
                            if (itemElement.Objetos == null)
                                itemElement.Objetos = new List<Element>();
                            itemElement.Objetos.Add(NewElement);
                            BlockSeleccionado.lstElementos.Add(NewElement);
                            ElementIdC++;
                            BloquesValidos.RemoveAt(numseleccionado);
                        }
                    }
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
                RandomDungeonMaker obj = new RandomDungeonMaker(10, 10, 1000, xxx);
                obj.makeDungeon();
            }
            Console.WriteLine("TERMINADO");
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
                        border += BloqueSeleccionado.WallTop > 0 || BloqueSeleccionado.RoomWallTop > 0 ? "border-top: solid " + ((l - 1) >= 0 && DungeonArray[l - 1][m].Id == 0 ? "2" : "1") + "px;" : String.Empty;
                        border += BloqueSeleccionado.WallRight > 0 || BloqueSeleccionado.RoomWallRight > 0 ? "border-right: solid " + ((m + 1 < DungeonWidth) && DungeonArray[l][m + 1].Id == 0 ? "2" : "1") + "px;" : String.Empty;
                        border += BloqueSeleccionado.WallBottom > 0 || BloqueSeleccionado.RoomWallBottom > 0 ? "border-bottom: solid " + ((l + 1 < DungeonHeight) && DungeonArray[l + 1][m].Id == 0 ? "2" : "1") + "px;" : String.Empty;
                        border += BloqueSeleccionado.WallLeft > 0 || BloqueSeleccionado.RoomWallLeft > 0 ? "border-left: solid " + ((m - 1) >= 0 && DungeonArray[l][m - 1].Id == 0 ? "2" : "1") + "px;" : String.Empty;
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
                            minimap += BloqueSeleccionado.SupportPlatformCenter == "LEFT" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 0%; position: relative;'></div>" : String.Empty;
                            minimap += BloqueSeleccionado.SupportPlatformCenter == "CENTER" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 30%; position: relative;'></div>" : String.Empty;
                            minimap += BloqueSeleccionado.SupportPlatformCenter == "RIGHT" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 0%; left: 60%; position: relative;'></div>" : String.Empty;
                        }
                        else
                        {
                            minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 0%; left: 30%; position: relative;'></div>";
                        }
                        if (BloqueSeleccionado.SupportPlatformCenter != "NONE")
                        {
                            minimap += BloqueSeleccionado.SupportPlatformCenter == "LEFT" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 0%; position: relative;'></div>" : String.Empty;
                            minimap += BloqueSeleccionado.SupportPlatformCenter == "CENTER" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 30%; position: relative;'></div>" : String.Empty;
                            minimap += BloqueSeleccionado.SupportPlatformCenter == "RIGHT" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 35%; left: 60%; position: relative;'></div>" : String.Empty;
                        }
                        else
                        {
                            minimap += "<div style='rgba(0,0,0,0); width: 40%; height: 10%; top: 35%; left: 30%; position: relative;'></div>";
                        }
                        if (BloqueSeleccionado.SupportPlatformBottom != "NONE")
                        {
                            minimap += BloqueSeleccionado.SupportPlatformBottom == "LEFT" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 0%; position: relative;'></div>" : String.Empty;
                            minimap += BloqueSeleccionado.SupportPlatformBottom == "CENTER" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 30%; position: relative;'></div>" : String.Empty;
                            minimap += BloqueSeleccionado.SupportPlatformBottom == "RIGHT" ? "<div style='background-color: #000; width: 40%; height: 10%; top: 75%; left: 60%; position: relative;'></div>" : String.Empty;
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
        /**
         * @class 
         * @brief Maps are composed by rooms, this class contains room data
         */
        public class Block
        {
            public int Id, X, Y, RoomX, RoomY, Room,
                        WallTop, WallRight, WallBottom, WallLeft,
                        RoomWallTop, RoomWallRight, RoomWallBottom, RoomWallLeft;
            public Block ConnectTop, ConnectRight, ConnectBottom, ConnectLeft;
            public String Status = "OK", SupportPlatformTop = "NONE", SupportPlatformCenter = "NONE", SupportPlatformBottom = "NONE";
            public bool hasWallTop { get { return WallTop > 0 || RoomWallTop > 0; } }
            public bool hasWallBottom { get { return WallBottom > 0 || RoomWallBottom > 0; } }
            public bool hasWallRight { get { return WallRight > 0 || RoomWallRight > 0; } }
            public bool hasWallLeft { get { return WallLeft > 0 || RoomWallLeft > 0; } }
            public List<Element> lstElementos = new List<Element>();
            public Block(int X, int Y)
            {
                this.X = X;
                this.Y = Y;
            }
        }
        /**
         * @class 
         * @brief Maps are composed by rooms, this class contains room data
         */
        public class Room
        {
            public int Id, index;
            public RoomBlock[][] Blocks;
            public List<string> Connections = new List<string>();
            public RoomType roomType;
            public Room(int DungeonRoomsLength, RoomType roomType = RoomType.ROOM)
            {
                Id = DungeonRoomsLength + 1;
                index = DungeonRoomsLength;
                this.roomType = roomType;
            }
        }
        /**
         * @class 
         * @brief Contains Block data of each room
         */
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
        /**
         * @class 
         * @brief Tags that can be placed inside the rooms of a dungeon and symbolize objects such as keys, coins, enemies, etc.
         */
        [Serializable]
        public class Entities
        {
            public String NameTag, UID;
            public int Total = 0;
            public bool IsImportant = false;
            public int OcuppedTolerance = 1;
            public enumIndoorConsideration NotIndoor = enumIndoorConsideration.NOT_IMPORTANT;
            public enumWallElementConsideration ObligatoryBottomWall = enumWallElementConsideration.NOT_IMPORTANT;
            public enumWallElementConsideration ObligatoryTopWall = enumWallElementConsideration.NOT_IMPORTANT;
            public enumWallElementConsideration ObligatoryLeftWall = enumWallElementConsideration.NOT_IMPORTANT;
            public enumWallElementConsideration ObligatoryRightWall = enumWallElementConsideration.NOT_IMPORTANT;
            public List<Element> Objetos = new List<Element>();
            public enum enumWallElementConsideration
            {
                NOT_IMPORTANT,
                YES,
                BORDER,
                ROOM,
                NONE
            }
            public enum enumIndoorConsideration
            {
                NOT_IMPORTANT = 0,
                NOT_INDOOR = 1,
                ONLY_INDOOR = 2
            }
            public Entities(String NameTag, String UID, int Total, bool IsImportant = true)
            {
                this.NameTag = NameTag;
                this.UID = UID;
                this.Total = Total;
                this.IsImportant = IsImportant;
            }
        }
        /**
         * @class 
         * @brief Objects that represent each entity individually and make them able to be activated/deactivated once they have been touched/destroyed
         */
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
}