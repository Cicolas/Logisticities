import * as THREE from 'three';
import { Color } from 'three';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GObject from "../lib/CUASAR/GObject";
import CityComponent from './CityComponent';
import RoadComponent from './RoadComponent';

var ROAD_UUID = 100;
var CITY_UUID = 200;

export default class GameManager implements ComponentInterface {
    name: string = "GameManager";
    private gw: GameController;

    private cityCount: number;
    private definition: number;
    private mapsize: number;
    public cities: GObject[];

    private mousePos: THREE.Vector3;
    private cityHovering: number;
    private citySelected: number = -1;

    constructor(definition, mapsize) {
        this.definition = definition;
        this.mapsize = mapsize;
        this.cityCount = mapsize*4;

        this.mousePos = new THREE.Vector3();
        this.cities = [];

        this.cityHovering = null;
    }

    init(gameWin: GameController) {
        this.gw = gameWin;

        setTimeout(this.postInit.bind(this), 10, gameWin);

        gameWin.canvas.addEventListener("click", this.mouseClick.bind(this));
        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
        // gameWin.canvas.addEventListener("mouseup", this.mouseUp);
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
                    new RoadComponent(c1.name, c2.name, this.definition)
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

    postInit(gameWin) {
        this.generateCity(gameWin);
    }

    update(obj: GObject, gameWin: GameController) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera(this.mousePos, this.gw.threeCamera);

        const intersects = ray.intersectObjects(this.gw.threeScene.children);

        //! INCORRECT VALIDATION IF IS HOVERING A CITY OR NOT
        if (intersects.length <= 1) this.cityHovering = -1;

        for ( let i = 0; i < intersects.length; i++) {
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

    draw (context?: THREE.Scene) {};

    generateCity(gameWin: GameController) {
        for (let i = 0; i < this.cityCount; i++) {
            const x = Math.random()*1.8-.9;
            const y = Math.random()*1.8-.9;

            const go = new GObject((++CITY_UUID).toString())
                       .addComponent(
                           new CityComponent(x, y, this.definition, this.mapsize, {name: (CITY_UUID)})
                       )
                       .initObject(gameWin);

            this.cities.push(go);
            gameWin.getScene().addObject(go);
        }
    }

    getMousePosition(e) {
        const bb = this.gw.canvas.getBoundingClientRect();
        const mx = e.clientX - bb.left;
        const my = e.clientY - bb.top;

        this.mousePos.x = ( mx / this.gw.width ) * 2 - 1;
        this.mousePos.y = - ( my / this.gw.height ) * 2 + 1;
        this.mousePos.z = .5;
    }
}