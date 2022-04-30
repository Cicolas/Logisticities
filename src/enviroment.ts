export const DEBUG_INFO = {
    seed: -1,
    testMode: false,

    //plane related show/hide
    showGrid: false,
    showWireframe: false,
    noMask: true,
    noLight: false,

    //engine related show/hide
    hideFog: false,
    hideSea: false,

    //game related show/hide
    noCities: true,
    noRoadSmooth: false,
    showRoadGuides: false,
    showRoadVertices: false,

    //non show/hide related DEBUGS
    camera: {
        topDown: false,
        emitLight: false,
        dontChangeSize: false,
    },
    map: {
        planify: false,
        fastLoad: false,
        altitudeColor: true,
    },
    city: {
        //! Numbers above 4 cause crashes due to name generator
        number: 4,
        dontLoadObj: false
    }
};