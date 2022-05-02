export const DEBUG_INFO = {
    seed: 3,
    testMode: false,

    //plane related show/hide
    showGrid: false,
    showWireframe: false,
    noMask: true,

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
        dontChangeSize: false,
    },
    map: {
        planify: false,
        fastLoad: false,
    },
    city: {
        //! Numbers above 4 cause crashes due to name generator
        number: 4,
        dontLoadObj: false
    }
};