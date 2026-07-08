using UnityEngine;
namespace RDM
{
    #region Descripcion
    /**
     * @file
     * @brief Class that represents floor common data
     */
    #endregion
    public class DungeonFloor : MonoBehaviour
    {
        #region Editor
        /** Floor default name used during gameplay */
        public string name = "Floor";
        public AudioClip Clip;
        #endregion

        #region Awake & Start & Update
        internal virtual void Start()
        {
        }
        /** Update virtual method */
        internal virtual void Update()
        {
        }
        #endregion
    }
}