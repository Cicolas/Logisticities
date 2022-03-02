import CameraComponent from "./components/CameraComponent";
import LightComponent from "./components/LightComponent";
import PlaneComponent from "./components/PlaneComponent";
import RayComponent from "./components/RayComponent";
import GameController from "./GameController";
import GObject from "./lib/CUASAR/GObject";
import Scene from "./lib/CUASAR/Scene";

const DEFINITION = 10;
const WIDTH = 8*DEFINITION;
const HEIGHT = 8*DEFINITION;
const DEPTH = 8*DEFINITION;

const cameraI = {
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH,
    cameraAngle: (-32.5 / 180) * Math.PI,
    cameraDistance: 1.25
}

const planeI = {
    seed: 3,
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
    ).addObject(
        new GObject("luz")
        .addComponent(new LightComponent(HEIGHT))
    ).addObject(
        new GObject("plano")
        .addComponent(new PlaneComponent(planeI))
    ).addObject(
        new GObject("raio")
        .addComponent(new RayComponent)
    )
)
.initGame();

(gw as GameController).updateTHREE();