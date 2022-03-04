import CameraComponent from "./components/CameraComponent";
import CameraMovement from "./components/CameraMovement";
import CityComponent from "./components/CityComponent";
import LightComponent from "./components/LightComponent";
import PlaneComponent from "./components/PlaneComponent";
import RayComponent from "./components/RayComponent";
import GameController from "./GameController";
import GObject from "./lib/CUASAR/GObject";
import Scene from "./lib/CUASAR/Scene";

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
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH,
    cameraAngle: 1/8 * Math.PI,
    cameraDistance: 1
}

const planeI = {
    seed: 3,
    // seed: Math.random()*1000,
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH,
    perlinScale1: 1*DEFINITION,
    perlinScale2: 4*DEFINITION,
    perlinPower1: 1,
    perlinPower2: 4
};

const gw = new GameController("", cameraI)
.setResolution(800, 600)
.pushScene(
    new Scene("cena").addObject(
        new GObject("camera")
        .addComponent(new CameraComponent(cameraI))
        .addComponent(new CameraMovement())
    ).addObject(
        new GObject("luz")
        .addComponent(new LightComponent(HEIGHT))
    ).addObject(
        new GObject("plano")
        .addComponent(new PlaneComponent(planeI))
    ).addObject(
        new GObject("raio")
        .addComponent(new RayComponent)
    ).addObject(
        new GObject("cidade")
        .addComponent(new CityComponent)
    )
)
.initGame();

(gw as GameController).updateTHREE();