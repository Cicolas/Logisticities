import * as THREE from 'three';
import { Color } from 'three';
import { createNewScene } from '../app';
import { DEBUG_INFO } from '../enviroment';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GObject from "../lib/CUASAR/GObject";
import { getCityName, resetCityName } from '../scripts/cityNames';
import { resetSuply } from '../scripts/suply';
import { Upgrade } from '../scripts/upgrades';
import { position } from '../scripts/utils';
import CityComponent from './CityComponent';
import PlaneComponent from './PlaneComponent';
import RoadComponent from './RoadComponent';
import BoxElement from './UI/box/BoxElement';
import SliderElement from './UI/slider/SliderElement';
import UIManager from './UIManager';
import UpgradeComponent from './UpgradeComponent';

var ROAD_UUID = 100;
var CITY_UUID = 200;
const EXP_NEXT_LEVEL_BASE = 50;

enum State {
    NONE,
    PLAYING,
    UPGRADING,
    PAUSED
}

export default class GameManager implements ComponentInterface {
    name: string = "GameManager";
    private gw: GameController;
    private UIMgr: UIManager;
    public state: State;

    private cityCount: number;
    private definition: number;
    private gridDefinition: number;
    public cities: GObject[];
    public exp: number = 0;
    public expToNextLevel: number = EXP_NEXT_LEVEL_BASE;
    private upgrades: Upgrade[]  = [];

    private mousePos: position;
    private rawMousePos: position;
    private cityHovering: number;
    private citySelected: number = -1;

    private box: BoxElement;
    private slider: SliderElement;
    private upgradeComponent: UpgradeComponent;

    constructor(definition, mapSize, gridDefinition) {
        this.definition = definition;
        this.gridDefinition = gridDefinition;
        this.cityCount = DEBUG_INFO.noCities?0:Math.ceil(mapSize*DEBUG_INFO.city.number);

        // this.mousePos = new THREE.Vector3();
        this.mousePos = {x: -1, y: -1};
        this.rawMousePos = {x: -1, y: -1};
        this.cities = [];

        this.cityHovering = null;
    }

    init(gameWin: GameController) {
        this.gw = gameWin;
        this.UIMgr = this.gw.getScene().getObject("UIManager").getComponent(UIManager) as UIManager;
        this.state = State.PLAYING;

        //!resize isn't working
        this.slider = new SliderElement(0, {isGUI: true});
        this.UIMgr.addElement(this.slider,  {
            // position: {x: 400, y: gameWin.height-25},
            size: {x: gameWin.width-800, y: 10}
        })

        this.upgradeComponent = new UpgradeComponent(this.UIMgr);
        this.upgradeComponent.init(gameWin);

        setTimeout(this.postInit.bind(this, gameWin), 10, gameWin);
    }

    postInit(gameWin: GameController) {
        this.generateCity(gameWin);

        gameWin.canvas.addEventListener("click", this.mouseClick.bind(this));
        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
        document.addEventListener("keydown", this.reset);
    }

    reset(e: KeyboardEvent) {
        if (e.key === "r") {
            console.log("newScene");
            resetCityName();
            resetSuply();
            setTimeout(createNewScene, 10);
        }
    }

    mouseClick(e: MouseEvent) {
        this.getMousePosition(e);

        if (this.cityHovering >= 0) {
            if (this.citySelected === -1) {
                this.citySelected = this.cityHovering;
                const city = this.cities[this.citySelected].getComponent(CityComponent) as CityComponent;
                city.isSelected = true;
            }
            else if(this.citySelected !== this.cityHovering) {
                const c1 = this.cities[this.citySelected];
                const c2 = this.cities[this.cityHovering];

                const go = new GObject((++ROAD_UUID).toString()).addComponent(
                    new RoadComponent(c1.name, c2.name)
                ).initObject(this.gw)
                this.gw.getScene().addObject(go);

                const city = this.cities[this.citySelected].getComponent(CityComponent) as CityComponent;
                city.isSelected = false;
                this.citySelected = -1;
                this.cityHovering = -1;
            }
            else {
                const city = this.cities[this.citySelected].getComponent(CityComponent) as CityComponent;
                city.isSelected = false;
                this.citySelected = -1;
                this.cityHovering = -1;
            }
        }
    }

    mouseMove = (e: MouseEvent) => {
        this.getMousePosition(e);
    }

    private firstUpdate = true;
    update(obj: GObject, gameWin: GameController) {
        if (this.firstUpdate) {
            obj.addComponent(this.upgradeComponent);
        }

        const ray = new THREE.Raycaster();
        ray.setFromCamera(this.mousePos, this.gw.threeCamera);

        const intersects = ray.intersectObjects(this.gw.threeScene.children);

        if (!intersects.some(value => value.object.name.toString().startsWith("2"))) {
            this.cityHovering = -1;
        }else{
            for (let i = 0; i < intersects.length; i++) {
                const obj = this.gw.getScene().getObject(intersects[i].object.name.toString())

                if (obj) {
                    if (obj.name.startsWith("2")) {
                        const comp = obj.getComponent(CityComponent) as CityComponent;
                        (comp.mesh.material as THREE.MeshStandardMaterial).color = new Color("white");
                        this.cityHovering = this.cities.findIndex(v => v.name === obj.name);
                    }
                }
            }
        }

        this.updateBoxes();
    }

    draw (context?: THREE.Scene) {};

    generateCity(gameWin: GameController) {
        for (let i = 0; i < this.cityCount; i++) {
            var x;
            var y;

            do {
                x = Math.floor(Math.random()*1000)%this.gridDefinition
                y = Math.floor(Math.random()*1000)%this.gridDefinition
            } while (!this.isValidCityPlace(x, y))

            const go = new GObject((++CITY_UUID).toString())
                        .addComponent(
                            new CityComponent(x, y, this.definition, {name: getCityName(), UUID: CITY_UUID})
                        ).initObject(gameWin);

            this.cities.push(go);
            gameWin.getScene().addObject(go);
        }
    }

    isValidCityPlace(x, y) {
        if (x === 0 ||
            y === 0 ||
            x === this.gridDefinition-1 ||
            y === this.gridDefinition-1
        ) return false;

        const plane = this.gw.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;
        if (plane.grid[x][y].apropiated === false) return false;

        return true;
    }

    getMousePosition(e) {
        const bb = this.gw.canvas.getBoundingClientRect();
        const mx = e.clientX - bb.left;
        const my = e.clientY - bb.top;

        this.rawMousePos.x = e.clientX - bb.left;
        this.rawMousePos.y = e.clientY - bb.top;

        this.mousePos.x = ( mx / this.gw.width ) * 2 - 1;
        this.mousePos.y = - ( my / this.gw.height ) * 2 + 1;
        // this.mousePos.z = .5;
    }

    updateBoxes() {
        if (this.cityHovering >= 0) {
            if (!this.box) {
                const cityComp = this.cities[this.cityHovering].getComponent(
                    CityComponent
                ) as CityComponent;

                this.box = new BoxElement(
                    cityComp.cityName,
                    "Cidade normal, nada de mais",
                    {
                        isCity: true,
                        city: cityComp,
                        cityInvetory: cityComp.inventorySuply
                    }
                );
                this.UIMgr.addElement(this.box, {
                    position: {x: this.rawMousePos.x, y: this.rawMousePos.y-125},
                    size: {x: 300, y: 150},
                })
            }else{
                this.box.position = {x: this.rawMousePos.x, y: this.rawMousePos.y-125};
            }
        }else if(this.box){
            this.box.destroy();
            this.box = null;
        }
    }

    public addExp(e: number) {
        this.exp += e;

        this.slider.progress = this.exp/this.expToNextLevel;

        if (this.exp>this.expToNextLevel)
            setTimeout(this.nextLevel.bind(this), 100);
    }

    private nextLevel() {
        this.gw.pause = true;
        this.state = State.UPGRADING;
        this.exp = 0;
        this.expToNextLevel *= 2;
        this.upgradeComponent.toggle();
    }

    public pickUpgrade(upgrade: Upgrade) {
        this.upgrades.push(upgrade);

        this.gw.pause = false;
        this.state = State.PLAYING;
        this.upgradeComponent.toggle();
    }
}