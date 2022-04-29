import './page/style/app.css';

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
import UI from './lib/TELESCOPE/UI';
import loading from './page/loading.html';
import SliderElement from './components/UI/slider/SliderElement';
import UpgradeBar from './components/UI/UpgradeBar/UpgradeBarElement';
import UpgradeBarElement from './components/UI/UpgradeBar/UpgradeBarElement';
import FloatingElement from './components/UI/floatingIcon/FloatingElement';
// import AmbientLightComponent from './components/AmbientLightComponent';

if (!DEBUG_INFO.camera.dontChangeSize) {
    document.body.classList.add("resizable");
}
const CANVAS_WIDTH = DEBUG_INFO.camera.dontChangeSize?document.body.clientWidth:window.innerWidth;
const CANVAS_HEIGHT = DEBUG_INFO.camera.dontChangeSize?document.body.clientHeight:window.innerHeight;
// const CANVAS_WIDTH = 800;
// const CANVAS_HEIGHT = 600;
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
    cameraAngle: DEBUG_INFO.testMode?0:1/4 * Math.PI,
    cameraDistance: .9,
    isLocked: true,
    quad: {
        left: -WIDTH/2,
        right: WIDTH/2,
        top: HEIGHT/(2-((MAPSIZE-1)*.5)),
        bottom: -HEIGHT/(2-((MAPSIZE-1)*.5))
    },
    rotation: DEBUG_INFO.testMode?0:1/4 * Math.PI
};

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
    color: {
        sand: {r: 240/255, g: 187/255, b: 98/255},
        grass: {r: 81/255, g: 146/255, b: 89/255},
        rock: {r: 100/255, g: 102/255, b: 107/255},
        snow: {r: 1, g: 1, b: 1, a: 0},
    },
    seaLevel: 0
};

const seaI = {
    // seed: 47187,
    // seed: 37055,
    width: WIDTH*10,
    height: HEIGHT,
    depth: DEPTH*10,
    color: {r: 95/255, g: 152/255, b: 245/255},
    opacity: 1
};

var _UI: UIManager;
const gw: GameController = new GameController("", cameraI)
.setResolution(CANVAS_WIDTH, CANVAS_HEIGHT)
.pushScene(
    new Scene("inicio")
).call((gameWin: GameController) => {
    _UI = new UIManager(
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        new UI(gameWin.canvas, CANVAS_WIDTH, CANVAS_HEIGHT, gameWin)
    ).addElement(
        { name: "loading", html: loading, init: () => {} },
        {
            position: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 },
            time: 100,
        }
    );

    gameWin.getScene().addObject(
        new GObject("UIManager")
        .addComponent(_UI)
    );
}).initGame() as GameController;
setTimeout(DEBUG_INFO.testMode?createNewTestScene:createNewScene, 10);

gw.updateTHREE();

export function createNewScene() {
    gw.threeScene?.clear();

    planeI.seed = DEBUG_INFO.seed>0?DEBUG_INFO.seed:Math.random()*100000;

    const scene = new Scene("cena").addObject(
        new GObject("camera")
        .addComponent(new CameraComponent(cameraI))
        .addComponent(new CameraMovement())
    ).addObject(
        new GObject("luz")
        .addComponent(new LightComponent(HEIGHT))
        .addComponent(new AmbientLightComponent())
    ).addObject(
        new GObject("gameManager")
        .addComponent(new GameManager(DEFINITION*8, MAPSIZE, GRID_DEFINITION))
    ).addObject(
        new GObject("plano")
        .addComponent(new PlaneComponent(planeI))
    ).addObject(
        new GObject("sea")
        .addComponent(new SeaComponent(seaI))
    ).initScene(gw).addObject(
        new GObject("UIManager")
        .addComponent(_UI
            // .addElement(new FloatingElement("&#x1F307"))
            // .addElement(
            //     new SliderElement(0, {}), {
            //         position: {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2},
            //         size: {x: 300, y: 20}
            //     }
            // )
            // .addElement(
            // new BoxElement("Rosario", "Uma cidade normal, nada de especial", {
            //     isCity: true,
            //     city: {
            //         UUID: "100",
            //         cityName: "Rosario",
            //         trains: [],
            //         productionSuply: [
            //             {
            //                 id: 0,
            //                 productionRate: 1,
            //                 name: "Power",
            //                 emoji: emojiMap.power,
            //                 need: false
            //             },
            //             {
            //                 id: 1,
            //                 productionRate: 1,
            //                 name: "Industry",
            //                 emoji: emojiMap.industry,
            //                 need: true
            //             }
            //         ]
            //     },
            //     cityInvetory: [
            //         {
            //             id: 0,
            //             quantity: 1
            //         },
            //     ]
            // }),
            // {
            //     position: {x: CANVAS_WIDTH/2, y: CANVAS_HEIGHT/2},
            //     size: {x: 300, y: 150}
            // })
        )
    );

    gw.popScene();
    gw.pushScene(scene);
}

function createNewTestScene() {
    gw.threeScene?.clear();

    const scene = new Scene("teste")
        .addObject(
            new GObject("camera")
                .addComponent(new CameraComponent(cameraI))
                .addComponent(new CameraMovement())
        )
        .addObject(new GObject("luz").addComponent(new LightComponent(HEIGHT)))
        // .addObject(new GObject("test").addComponent(new ShaderBoxComponent()))
        .initScene(gw)
        .addObject(
            new GObject("UIManager").addComponent(
                _UI
            )
        );

    gw.popScene();
    gw.pushScene(scene);
}