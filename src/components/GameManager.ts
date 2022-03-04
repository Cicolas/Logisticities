import { randomUUID } from 'crypto';
import * as THREE from 'three';
import { Color } from 'three';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import CityComponent from './CityComponent';
import PlaneComponent from './PlaneComponent';

var UUID = 1000;

export default class GameManager implements ComponentInterface {
    name: string = "GameManager";
    private gw: GameController

    private cityCount: number = 6;
    private definition: number;
    private mapsize: number;

    private mousePos: THREE.Vector3;

    constructor(definition, mapsize) {
        this.definition = definition;
        this.mapsize = mapsize;
        this.cityCount = mapsize*3;
        this.mousePos = new THREE.Vector3();
    }

    init(gameWin: GameController) {
        this.gw = gameWin;

        setTimeout(this.postInit.bind(this), 100, gameWin);

        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
    }

    mouseMove = (e) => {
        this.mousePos.x = ( e.clientX / this.gw.width ) * 2 - 1.02;
        this.mousePos.y = - ( e.clientY / this.gw.height ) * 2 + 1.02;
        this.mousePos.z = .5;
    }

    postInit(gameWin) {
        this.generateCity(gameWin);
    }

    update(obj: GObject, gameWin: GameController) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera(this.mousePos, gameWin.threeCamera);

        const intersects = ray.intersectObjects(gameWin.threeScene.children);

        for ( let i = 0; i < intersects.length; i++) {
            const obj = gameWin.getScene().getObject(intersects[i].object.name.toString())

            if (obj) {
                if (obj.name !== "plano") {
                    const comp = obj.getComponent(CityComponent) as CityComponent;
                    if (comp) {
                        (comp.mesh.material as THREE.MeshStandardMaterial).color = new Color("white");
                    }
                }
            }
        }
    }

    draw (context?: THREE.Scene) {
    };

    generateCity(gameWin: GameController) {
        for (let i = 0; i < this.cityCount; i++) {
            const x = Math.random()*1.8-.9;
            const y = Math.random()*1.8-.9;

            gameWin.getScene().addObject(
                new GObject((++UUID).toString())
                .addComponent(
                    new CityComponent(x, y, this.definition, this.mapsize, {name: (UUID)})
                )
                .initObject(gameWin)
            );
        }
    }
}