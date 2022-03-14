import * as THREE from 'three';
import { Color } from 'three';
import { DEBUG_INFO } from '../enviroment';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";

export default class LightComponent implements ComponentInterface {
    name: string = "LightComponent";
    public light: THREE.DirectionalLight;

    private height: number;
    private camera: THREE.Camera;

    constructor(height: number){
        this.height = height;
    }

    init(gameWin: GameController) {
        this.camera = gameWin.threeCamera;

        // this.light = new THREE.DirectionalLight(0x94add6);
        this.light = new THREE.DirectionalLight(0xffffff, 1);
        // this.light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
        this.light.position.y = this.height;

        (gameWin as GameController).threeScene.add(this.light);
    }

    update(obj: GObject, gameWin: GameController) {
        if (DEBUG_INFO.camera.emitLight) {
            this.camera = gameWin.threeCamera;
            this.light.position.x = this.camera.position.x;
            // this.light.position.y = this.camera.position.y;
            this.light.position.z = this.camera.position.z;
        }
    }

    draw (context?: THREE.Scene) {

    };

}