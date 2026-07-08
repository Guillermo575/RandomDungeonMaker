using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
/**
 * @file
 * @brief Pseudo RNG Generator
 */
public class MathRNG
{
    #region Variables
    /** Minimun value */
    private decimal MinValue { get; set; }
    /** Maximun value */
    private decimal MaxValue { get; set; }
    /** Current Seed */
    public int Seed { get; set; }
    /** Incrementable counter */
    private int Next { get; set; }
    #endregion

    #region Constructors
    /**
     * Set Main Values
     * @param MinValue
     * @param MaxValue
     * @param Seed
     */
    public MathRNG(decimal MinValue, decimal MaxValue, int Seed = 1)
    {
        this.MinValue = MinValue;
        this.MaxValue = MaxValue;
        this.Seed = Seed;
        Next = 1;
    }
    /**
     * Set Main Values
     * @param Seed
     */
    public MathRNG(int Seed = 1)
    {
        this.Seed = Seed;
        Next = 1;
    }
    #endregion

    #region NextValues
    /**
     * Get a random value
     * @return decimal value between 0 and 1
     */
    public decimal GetRandom()
    {
        return GetCatalystSeed();
    }
    /**
     * Get a random value
     * @param MinValue
     * @param MaxValue
     * @return int value between Min and Max Value
     */
    public int GetRandom(int MinValue, int MaxValue)
    {
        return (int)Math.Round(NextValue((decimal) MinValue, (decimal) MaxValue));
    }
    /**
     * Get a random value
     * @param MaxValue
     * @return int value between 0 and Max Value
     */
    public int GetRandom(int MaxValue)
    {
        return (int)Math.Round(NextValue(0, (decimal)MaxValue));
    }
    /**
     * Get a random value (for test)
     * @return decimal value between MinValue and Max Value
     */
    public decimal NextValue()
    {
        return NextValue(MinValue, MaxValue);
    }
    /**
     * Get a random value
     * @param MinValue
     * @param MaxValue
     * @return decimal value between MinValue and Max Value
     */
    public decimal NextValue(decimal MinValue, decimal MaxValue)
    {
        decimal initialValue = GetCatalystSeed();
        decimal PseudoRandom = (initialValue * (MaxValue - MinValue)) + MinValue;
        return PseudoRandom;
    }
    /**
     * Formula used for calculate a pseudorandom number
     * @return decimal value between 0 and 1
     */
    public decimal GetCatalystSeed()
    {
        decimal SeedModify = Seed;
        SeedModify = Next % 3 == 0 ? (decimal)(Seed * 0.0001) : SeedModify;
        SeedModify = Next % 3 == 1 ? (decimal)(Seed * 0.0000001) : SeedModify;
        SeedModify = Next % 3 == 2 ? (decimal)(Seed * 0.000000001) : SeedModify;
        decimal Catalist = Next % 2 == 0 ? (decimal)Mathf.Sin((float)(Next + SeedModify)) : (decimal)Mathf.Sin((float)(Next + SeedModify));
        decimal initialValue = (decimal)((Catalist + 1) / 2);
        try
        {
            Next++;
        }
        catch (OverflowException ex)
        {
            Next = 1;
        }
        return initialValue;
    }
    #endregion

    #region NextValues (Other Numeric Values)
    /**
     * Get a random value
     * @return float between a Min and Max value
     */
    public float NextValueFloat()
    {
        return (float)NextValue(MinValue, MaxValue);
    }
    /**
     * Get a random value
     * @param MinValue
     * @param MaxValue
     * @return float between a Min and Max value
     */
    public float NextValueFloat(float MinValue, float MaxValue)
    {
        return (float)NextValue((decimal)MinValue, (decimal)MaxValue);
    }
    /**
     * Get a random value
     * @return double between a Min and Max value
     */
    public double NextValueDouble()
    {
        return (double)NextValue(MinValue, MaxValue);
    }
    /**
     * Get a random value
     * @param MinValue
     * @param MaxValue
     * @return double between a Min and Max value
     */
    public double NextValueDouble(double MinValue, double MaxValue)
    {
        return (double)NextValue((decimal)MinValue, (decimal)MaxValue);
    }
    /**
     * Get a random value
     * @return int between a Min and Max value
     */
    public Int32 NextValueInt()
    {
        return (Int32)Decimal.Round(NextValue(MinValue, MaxValue));
    }
    /**
     * Get a random value
     * @param MinValue
     * @param MaxValue
     * @return int between a Min and Max value
     */
    public Int32 NextValueInt(double MinValue, double MaxValue)
    {
        return (Int32)Decimal.Round(NextValue((decimal)MinValue, (decimal)MaxValue));
    }
    #endregion

    #region Test Area
    /**
     * Test method
     * @return float between a Min and Max value
     */
    public static void Testing()
    {
        int ciclos = 100;
        int SumatoriaProm = 0;
        int Maximo = 0;
        int Minimo = 0;
        for (int m = 0; m < ciclos; m++)
        {
            MathRNG obj = new MathRNG(1, 100, UnityEngine.Random.Range(1, 999999999));
            var lst = new List<String>();
            for (int l = 0; l < 300; l++)
            {
                lst.Add(((Int32)obj.NextValue()).ToString());
            }
            var lstgr = lst.Distinct();
            SumatoriaProm += lstgr.Count();
            Maximo = lstgr.Count() > Maximo ? lstgr.Count() : Maximo;
            Minimo = lstgr.Count() < Minimo || Minimo == 0 ? lstgr.Count() : Minimo;
            //Debug.Log("Seed " + obj.Seed + ": " + lstgr.Count());
            //Debug.Log(String.Join(", ", lst));
            //Debug.Log(String.Join(", ", lstgr));
        }
        SumatoriaProm = SumatoriaProm / ciclos;
        Debug.Log("Maximo: " + Maximo);
        Debug.Log("Promedio: " + SumatoriaProm);
        Debug.Log("Minimo: " + Minimo);
    }
    #endregion

    #region Tools
    /**
     * Get a random Vector2
     * @param MinValue
     * @param MaxValue
     * @return Vector2 between a Min and Max value
     */
    public Vector2 getRandomVector2(Vector2 minValues, Vector2 maxValues)
    {
        var RanX = NextValueInt(0, 3);
        Vector2 vecSpawn = new Vector2();
        switch (RanX)
        {
            case 0: vecSpawn = new Vector2(NextValueFloat(minValues.x, maxValues.x), maxValues.y); break;
            case 1: vecSpawn = new Vector2(NextValueFloat(minValues.x, maxValues.x), minValues.y); break;
            case 2: vecSpawn = new Vector2(maxValues.x, NextValueFloat(minValues.y, maxValues.y)); break;
            case 3: vecSpawn = new Vector2(minValues.x, NextValueFloat(minValues.y, maxValues.y)); break;
            default: vecSpawn = new Vector2(NextValueFloat(minValues.x, maxValues.x), maxValues.y); break;
        }
        return vecSpawn;
    }
    #endregion
}