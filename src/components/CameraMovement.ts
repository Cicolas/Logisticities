import * as THREE from "three";
import { Camera, Vector2 } from "three";
import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import CameraComponent from "./CameraComponent";
import PlaneComponent from "./PlaneComponent";

const SMOOTHNESS = 200;

export default class CameraMovement implements ComponentInterface {
    name: string = "CameraMovement";
    private gw: GameController;
    private camera: CameraComponent;

    private isMoving: boolean;
    private isRotating: boolean;
    private firstClick: THREE.Vector2 = new THREE.Vector2();
    private mousePos: THREE.Vector2 = new THREE.Vector2();
    private keysPressed: string[] = [];
    private velocity: number = 1/2;

    init(gameWin: GameController) {
        this.gw = gameWin;

        setTimeout(this.postInit.bind(this), 100);

        gameWin.canvas.addEventListener("mousedown", this.mouseDown);
        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
        gameWin.canvas.addEventListener("mouseup", this.mouseUp);
        gameWin.canvas.addEventListener("wheel", this.mouseZoom);
        document.addEventListener("keydown", this.keyEnter.bind(this));
        document.addEventListener("keyup", this.keyExit.bind(this));
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
        if (e.button === 0) {
            this.isRotating = true;
        }
    };
    mouseUp = (e) => {
        if (e.button === 0) {
            this.isRotating = false;
        }
    }
    mouseZoom = (e: WheelEvent) => {
        const nextZoom = Math.sign(e.deltaY)*.25+this.camera.cameraDistance;

        if (nextZoom >= .25 && nextZoom <= .75) {
            this.camera.cameraDistance = nextZoom;
        }

        this.camera.zoom(Math.sign(e.deltaY)*.25);
        e.preventDefault();
    }

    keyEnter(e: KeyboardEvent) {
        if (e) {
            this.isMoving = true;
        }
        this.keysPressed.push(e.key);
    }
    keyExit(e: KeyboardEvent) {
        this.keysPressed = this.keysPressed.filter(v => v !== e.key);
    }

    update(obj: GObject, gameWin: GameWindow) {
        if (this.isRotating) {
            const move = {x: 0, y: 0};
            move.x = -(this.mousePos.x - this.firstClick.x) / SMOOTHNESS;
            move.y = -(this.mousePos.y - this.firstClick.y) / SMOOTHNESS;
            this.camera.rotation += move.x;
            this.camera.rotate(move);
            this.firstClick.copy(this.mousePos);
        }
        if (this.isMoving) {
            this.move();
        }
    }

    draw (context?: THREE.Scene) {};

    move() {
        const dir = new THREE.Vector2();

        if (this.keysPressed.includes("w")) dir.y -= 1;
        if (this.keysPressed.includes("s")) dir.y += 1;
        if (this.keysPressed.includes("d")) dir.x += 1;
        if (this.keysPressed.includes("a")) dir.x -= 1;

        this.camera.move(dir.normalize(), this.velocity);
    }
}