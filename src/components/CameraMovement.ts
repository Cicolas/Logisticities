import * as THREE from "three";
import { Camera, Vector2 } from "three";
import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import CameraComponent from "./CameraComponent";
import PlaneComponent from "./PlaneComponent";

const SMOOTHNESS = 2000;

export default class CameraMovement implements ComponentInterface {
    name: string = "CameraMovement";
    private gw: GameController;
    private camera: CameraComponent;

    private isMoving: boolean;
    private isRotating: boolean;
    private firstClick: THREE.Vector2 = new THREE.Vector2();
    private mousePos: THREE.Vector2 = new THREE.Vector2();

    init(gameWin: GameController) {
        this.gw = gameWin;

        setTimeout(this.postInit.bind(this), 100);

        gameWin.canvas.addEventListener("mousedown", this.mouseDown);
        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
        gameWin.canvas.addEventListener("mouseup", this.mouseUp);
    }

    postInit() {
        this.camera = this.gw.getScene().getObject("camera").getComponent(CameraComponent) as CameraComponent;
    }

    mouseMove = (e) => {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    }

    mouseDown = (e) => {
        this.firstClick.x = e.clientX;
        this.firstClick.y = e.clientY;
        // if (e.button === 0) {
        //     this.isMoving = true;
        // }
        if (e.button === 0) {
            this.isRotating = true;
            e.preventDefault();
        }
    };

    mouseUp = (e) => {
        // if (e.button === 0) {
        //     this.isMoving = false;
        // }
        if (e.button === 0) {
            this.isRotating = false;
            e.preventDefault();
        }
    }

    update(obj: GObject, gameWin: GameWindow) {
        if (this.isRotating) {
            const move = -(this.mousePos.x - this.firstClick.x) / SMOOTHNESS;

            this.camera.rotation += move;
        }
        // if (this.isMoving) {
        //     const move = new THREE.Vector3();
        //     move.x = -(this.mousePos.x - this.firstClick.x) / 2;
        //     move.y = -(this.mousePos.y - this.firstClick.y) / 2;

        //     this.gw.threeCamera.position.x += move.x;
        //     this.gw.threeCamera.position.z += move.y;

        //     c.anchor.x += move.x;
        //     c.anchor.z += move.y;

        //     // this.firstClick = this.mousePos;
        // }
    }

    draw (context?: THREE.Scene) {};
}