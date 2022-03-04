import CameraComponent from "./components/CameraComponent";
import CameraMovement from "./components/CameraMovement";
import GameManager from "./components/GameManager";
import LightComponent from "./components/LightComponent";
import PlaneComponent from "./components/PlaneComponent";
import RayComponent from "./components/RayComponent";
import GameController from "./GameController";
import GObject from "./lib/CUASAR/GObject";
import Scene from "./lib/CUASAR/Scene";

const CANVAS_WIDTH = 160*8;
const CANVAS_HEIGHT = 90*8;

enum mapSizeEnum {
    SMALL = 1,
    BIG = 2,
    HUGE = 4
}

const MAPSIZE = mapSizeEnum.SMALL;

const DEFINITION = 5;
const WIDTH = 8*DEFINITION*MAPSIZE;
const DEPTH = 8*DEFINITION*MAPSIZE;
const HEIGHT = 8*DEFINITION;

const cameraI = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    depth: DEPTH,
    cameraAngle: 1/2 * Math.PI,
    cameraDistance: .75
}

const planeI = {
    // seed: 3,
    seed: Math.random()*100000,
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH,
    perlinScale1: 1*DEFINITION,
    perlinScale2: 4*DEFINITION,
    perlinPower1: 1,
    perlinPower2: 4
};

const gw: GameController = new GameController("", cameraI)
.setResolution(CANVAS_WIDTH, CANVAS_HEIGHT)
.pushScene(
    new Scene("cena").addObject(
        new GObject("camera")
        .addComponent(new CameraComponent(cameraI))
        .addComponent(new CameraMovement())
    ).addObject(
        new GObject("luz")
        .addComponent(new LightComponent(HEIGHT))
    ).addObject(
        new GObject("gameManager")
        .addComponent(new GameManager(DEFINITION*8, MAPSIZE))
    ).addObject(
        new GObject("plano")
        .addComponent(new PlaneComponent(planeI))
    )
)
.initGame() as GameController;

gw.updateTHREE();