import * as THREE from 'three';
import { Color } from 'three';
import { DEBUG_INFO } from '../enviroment';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";

export default class AmbientLightComponent implements ComponentInterface {
    name: string = "AmbientLightComponent";
    public light: THREE.AmbientLightProbe;
    public ambientLight: THREE.AmbientLight;

    private camera: THREE.Camera;

    constructor(){
    }

    init(gameWin: GameController) {
        this.camera = gameWin.threeCamera;
        this.light = new THREE.AmbientLightProbe(0xe8e8e8, .4);

        // if (!DEBUG_INFO.noLight)
            (gameWin as GameController).threeScene.add(this.light);
    }

    update(obj: GObject, gameWin: GameController) {
        // if (DEBUG_INFO.camera.emitLight) {
            this.light.position.x = this.camera.position.x;
            this.light.position.y = this.camera.position.y;
            this.light.position.z = this.camera.position.z;
        // }
    }

    draw (context?: THREE.Scene) {

    };

}