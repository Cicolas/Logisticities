import * as THREE from 'three';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";

export default class LightComponent implements ComponentInterface {
    name: string = "LightComponent";
    private height: number;

    constructor(height: number){
        this.height = height;
    }

    init(gameWin: GameWindow) {
        // const light = new THREE.DirectionalLight(0x94add6);
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.y = this.height;
        (gameWin as GameController).threeScene.add(light);
    }

    update(obj: GObject, gameWin: GameWindow) {

    }

    draw (context?: THREE.Scene) {

    };

}