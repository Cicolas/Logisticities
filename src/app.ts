import './page/style/app.css';

import CameraComponent from "./components/CameraComponent";
import CameraMovement from "./components/CameraMovement";
import GameManager from "./components/GameManager";
import LightComponent from "./components/LightComponent";
import PlaneComponent from "./components/PlaneComponent";
import GameController from "./GameController";
import GObject from "./lib/CUASAR/GObject";
import Scene from "./lib/CUASAR/Scene";
import CityComponent from './components/CityComponent';
import RoadComponent from './components/RoadComponent';

const CANVAS_WIDTH = 40*20;
const CANVAS_HEIGHT = 30*20;

enum mapSizeEnum {
    SMALL = 1,
    BIG = 2,
    HUGE = 4
}

const MAPSIZE = mapSizeEnum.SMALL;

const DEFINITION = 10;
const WIDTH = 8*DEFINITION*MAPSIZE;
const DEPTH = 8*DEFINITION*MAPSIZE;
const HEIGHT = 8*DEFINITION;

const cameraI = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    depth: DEPTH,
    cameraAngle: 1/4 * Math.PI,
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
    // .addObject(
    //     new GObject("1010")
    //     .addComponent(new CityComponent(0, 0, DEFINITION*8, MAPSIZE, {name: "1010"}))
    // ).addObject(
    //     new GObject("1011")
    //     .addComponent(new CityComponent(-.5, -.5, DEFINITION*8, MAPSIZE, {name: "1011"}))
    // ).addObject(
    //     new GObject("road")
    //     .addComponent(new RoadComponent("1010", "1011", DEFINITION*8))
    // )
)
.initGame() as GameController;

console.log(gw.getScene());

gw.updateTHREE();