import './page/style/app.css';
import './game.css';

import CameraComponent from "./components/CameraComponent";
import CameraMovement from "./components/CameraMovement";
import GameManager from "./components/GameManager";
import LightComponent from "./components/LightComponent";
import PlaneComponent from "./components/PlaneComponent";
import GameController from "./GameController";
import GObject from "./lib/CUASAR/GObject";
import Scene from "./lib/CUASAR/Scene";
import { DEBUG_INFO } from './enviroment';
import SeaComponent from './components/SeaComponent';
import UIManager from './components/UIManager';

const CANVAS_WIDTH = document.body.clientWidth;
const CANVAS_HEIGHT = document.body.clientHeight;
const ASPECT_RATIO = CANVAS_WIDTH/CANVAS_HEIGHT;

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
const GRID_DEFINITION = 20*(MAPSIZE);

const cameraI = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    depth: DEPTH,
    cameraAngle: 1/4 * Math.PI,
    cameraDistance: .75,
    isLocked: true,
    quad: {
        left: -WIDTH*ASPECT_RATIO/1.5,
        right: WIDTH*ASPECT_RATIO/1.5,
        top: WIDTH/1.5,
        bottom: -WIDTH/1.5,
    }
}

const planeI = {
    // seed: 47187,
    // seed: 37055,
    seed: DEBUG_INFO.seed,
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH,
    perlinScale1: 1*DEFINITION,
    perlinScale2: 4*DEFINITION,
    perlinPower1: 1,
    perlinPower2: 4,
    gridDefinition: GRID_DEFINITION,
    color: {r: 81/255, g: 146/255, b: 89/255},
    seaLevel: .075
};

const seaI = {
    // seed: 47187,
    // seed: 37055,
    width: WIDTH,
    height: HEIGHT,
    depth: DEPTH,
    color: {r: 95/255, g: 152/255, b: 245/255},
    opacity: .5
};

const gw: GameController = new GameController("", cameraI)
.setResolution(CANVAS_WIDTH, CANVAS_HEIGHT)
.pushScene(
    new Scene("inicio")
)
.initGame() as GameController;
setTimeout(createNewScene, 10);

gw.updateTHREE();

export function createNewScene() {
    if (gw.getScene().name === "cena") {
        gw.threeScene.clear();
    }

    planeI.seed = DEBUG_INFO.seed>0?DEBUG_INFO.seed:Math.random()*100000;

    const scene = new Scene("cena").addObject(
        new GObject("camera")
        .addComponent(new CameraComponent(cameraI))
        .addComponent(new CameraMovement())
    ).addObject(
        new GObject("luz")
        .addComponent(new LightComponent(HEIGHT))
    ).addObject(
        new GObject("UI")
        .addComponent(new UIManager(CANVAS_WIDTH, CANVAS_HEIGHT))
    ).addObject(
        new GObject("gameManager")
        .addComponent(new GameManager(DEFINITION*8, MAPSIZE, GRID_DEFINITION))
    ).addObject(
        new GObject("plano")
        .addComponent(new PlaneComponent(planeI))
    ).addObject(
        new GObject("sea")
        .addComponent(new SeaComponent(seaI))
    ).initScene(gw);

    gw.popScene();
    gw.pushScene(scene);
}