export const DEBUG_INFO = {
    seed: -1,

    //plane related show/hide
    showGrid: false,
    showWireframe: false,
    noMask: false,

    //engine related show/hide
    hideFog: false,
    hideSea: false,

    //game related show/hide
    noCities: false,
    noRoadSmooth: false,
    showRoadGuides: false,
    showRoadVertices: false,

    //non show/hide related DEBUGS
    camera: {
        topDown: false,
        emitLight: false,
        dontChangeSize: true,
    },
    map: {
        planify: false
    },
    city: {
        //! Numbers above 4 cause crashes due to name generator
        number: 4,
        dontLoadObj: false
    }
}