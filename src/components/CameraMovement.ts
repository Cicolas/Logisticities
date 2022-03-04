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
    private camera: THREE.Camera;

    private isMoving: boolean;
    private isRotating: boolean;
    private firstClick: THREE.Vector2 = new THREE.Vector2();
    private mousePos: THREE.Vector2 = new THREE.Vector2();

    init(gameWin: GameController) {
        this.gw = (gameWin as GameController);

        this.camera = this.gw.threeCamera;

        // camera.position.x = 0;
        // camera.position.z = Math.cos(-this.cameraAngle)*this.depth*this.cameraDistance;
        // camera.position.y = Math.sin(-this.cameraAngle)*this.depth*this.cameraDistance;
        // camera.rotation.x = this.cameraAngle;

        gameWin.canvas.addEventListener("mousedown", this.mouseDown);
        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
        gameWin.canvas.addEventListener("mouseup", this.mouseUp);
    }

    mouseMove = (e) => {
        // console.log(e);

        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;

        // console.log(this.mousePos);
    }

    mouseDown = (e) => {
        this.firstClick.x = e.clientX;
        this.firstClick.y = e.clientY;
        if (e.button === 0) {
            this.isMoving = true;
        }
        if (e.button === 0) {
            this.isRotating = true;
            e.preventDefault();
        }
    };

    mouseUp = (e) => {
        if (e.button === 0) {
            this.isMoving = false;
        }
        if (e.button === 0) {
            this.isRotating = false;
            e.preventDefault();
        }
    }

    update(obj: GObject, gameWin: GameWindow) {
        const c = obj.getComponent(CameraComponent) as CameraComponent;
        if (this.isRotating) {
            const move = -(this.mousePos.x - this.firstClick.x) / SMOOTHNESS;

            c.rotation += move;
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

    draw (context?: THREE.Scene) {
    };
}