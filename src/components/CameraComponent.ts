import * as THREE from "three";
import { Vector2 } from "three";
import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import PlaneComponent from "./PlaneComponent";

export interface CameraInterface{
    cameraAngle: number,
    cameraDistance: number,
    width: number,
    height: number,
    depth: number
}

export default class CameraComponent implements ComponentInterface {
    name: string = "CameraComponent";
    private gw: GameController;

    private cameraAngle: number;
    private cameraDistance: number;
    private width: number;
    private height: number;
    private depth: number;

    public anchor: THREE.Vector3;
    public rotation = 0;

    constructor(cameraI: CameraInterface){
        this.cameraAngle = cameraI.cameraAngle;
        this.cameraDistance = cameraI.cameraDistance;
        this.width = cameraI.width;
        this.height = cameraI.height;
        this.depth = cameraI.depth;

        this.anchor = new THREE.Vector3();
    }

    init(gameWin: GameWindow) {
        this.gw = (gameWin as GameController);

        const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 10000);

        camera.position.x = 0;
        camera.position.z = Math.cos(this.cameraAngle)*this.depth*this.cameraDistance;
        camera.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;

        camera.lookAt(this.anchor);

        this.gw.threeCamera = camera;
    }

    update(obj: GObject, gameWin: GameWindow) {

        // this.rotation += Math.PI*2*.001;

        this.gw.threeCamera.position.x = Math.sin(this.rotation)*this.depth*this.cameraDistance+this.anchor.x;
        this.gw.threeCamera.position.z = Math.cos(this.rotation)*this.depth*this.cameraDistance+this.anchor.z;
        this.gw.threeCamera.lookAt(this.anchor);
    }

    draw (context?: THREE.Scene) {
        this.gw.threeRenderer.render(this.gw.threeScene, this.gw.threeCamera);
    };
}