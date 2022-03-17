import *  as THREE from "three";
import { Color } from "three";
import { CameraInterface } from "./components/CameraComponent";
import { DEBUG_INFO } from "./enviroment";
import GameWindow from "./lib/CUASAR/GameWindow";

export default class GameController extends GameWindow{
    public threeScene: THREE.Scene;
    public threeRenderer: THREE.WebGLRenderer;
    public threeCamera: THREE.Camera;
    public canvas: HTMLCanvasElement;
    public frame: number = 0;
    public fps: number = 0;
    public dt: number = 0;

    private lastFrameTime;
    private cameraAngle: number;
    private cameraDistance: number;
    private depth: number;

    constructor(name, cameraI: CameraInterface) {
        super(name);

        this.cameraAngle = cameraI.cameraAngle;
        this.cameraDistance = cameraI.cameraDistance;
        this.depth = cameraI.depth;
    }

    public initGame(): GameWindow {
        this.threeScene = new THREE.Scene();
        const fog = new THREE.Fog(
            new Color("black"),
            Math.cos(-this.cameraAngle)*this.cameraDistance*this.depth*1.4,
            Math.cos(-this.cameraAngle)*this.cameraDistance*this.depth*3
        );
        fog.color = new THREE.Color(0xe8e8e8);
        this.threeScene.background = new THREE.Color(0xe8e8e8);

        if (!DEBUG_INFO.hideFog) {
            this.threeScene.fog = fog;
        }

        window.addEventListener("resize", this.resize.bind(this));

        return super.initGame();
    }

    private resize() {
        if (!DEBUG_INFO.camera.dontChangeSize) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
        }
    }

    public setResolution(width: number, height: number): GameWindow {
        this.threeRenderer = new THREE.WebGLRenderer();
        this.threeRenderer.setSize(width, height);
        this.threeRenderer.setPixelRatio( window.devicePixelRatio );
        document.body.appendChild(this.threeRenderer.domElement);

        this.canvas = document.getElementsByTagName("canvas")[0];

        return super.setResolution(width, height);
    }

    public updateTHREE = (): void => {
        this.dt = (Date.now()-this.lastFrameTime)/1000;
        this.fps = 1/(this.dt);
        this.lastFrameTime = Date.now();

        this.frame++;
        this.updateGame();
        this.drawGame(this.threeScene);

        requestAnimationFrame(this.updateTHREE);
    }
}