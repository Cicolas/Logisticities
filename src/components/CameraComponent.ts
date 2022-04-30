import * as THREE from "three";
import { Camera, Vector2 } from "three";
import { DEBUG_INFO } from "../enviroment";
import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { cameraQuad, position } from "../scripts/utils/utils";
import PlaneComponent from "./PlaneComponent";

export interface CameraInterface{
    cameraAngle: number,
    cameraDistance: number,
    width: number,
    height: number,
    depth: number,
    isLocked: boolean,
    quad: cameraQuad,
    rotation?: number,
}

export default class CameraComponent implements ComponentInterface {
    name: string = "CameraComponent";
    private gw: GameController;
    public camera: THREE.Camera;
    private perspectiveCam: THREE.PerspectiveCamera;
    private orthoCam: THREE.OrthographicCamera;

    private cameraAngle: number;
    public cameraDistance: number;
    private width: number;
    private height: number;
    private aspectRatio: number;
    private depth: number;
    public isLocked: boolean;
    public rotation: number;
    public anchor: THREE.Vector3;
    private quad: cameraQuad;

    constructor(cameraI: CameraInterface){
        this.cameraAngle = cameraI.cameraAngle;
        this.cameraDistance = cameraI.cameraDistance;
        this.width = cameraI.width;
        this.height = cameraI.height;
        this.aspectRatio = cameraI.width/cameraI.height;
        this.depth = cameraI.depth;
        this.quad = cameraI.quad;
        this.isLocked = cameraI.isLocked;
        this.rotation = cameraI.rotation??-Math.PI/4;
        this.anchor = new THREE.Vector3();
    }

    init(gameWin: GameWindow) {
        this.gw = (gameWin as GameController);

        this.orthoCam = new THREE.OrthographicCamera(
            this.quad.left*this.aspectRatio,
            this.quad.right*this.aspectRatio,
            this.quad.top,
            this.quad.bottom,
            -100,
        );
        if (!DEBUG_INFO.camera.dontChangeSize) {
            this.resize();
        }
        this.resetOrthoCam();
        this.perspectiveCam = new THREE.PerspectiveCamera(75, this.aspectRatio, 0.1, 10000);
        this.resetPerspectiveCam();

        this.camera = this.isLocked?this.orthoCam:this.perspectiveCam;
        this.gw.threeCamera = this.camera;

        window.addEventListener("resize", this.resize.bind(this));
    }

    resetOrthoCam() {
        this.cameraDistance = .5;
        this.orthoCam.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;
        this.orthoCam.position.x = Math.sin(this.rotation)*this.depth*this.cameraDistance;
        this.orthoCam.position.z = Math.cos(this.rotation)*this.depth*this.cameraDistance;
    }

    resetPerspectiveCam() {
        this.cameraDistance = .75;

        this.perspectiveCam.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), this.rotation);
        this.perspectiveCam.rotateOnAxis(new THREE.Vector3(1, 0, 0), -this.cameraAngle);

        this.perspectiveCam.position.x = Math.sin(this.rotation)*this.depth*this.cameraDistance+this.anchor.x;
        this.perspectiveCam.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;
        this.perspectiveCam.position.z = Math.cos(this.rotation)*this.depth*this.cameraDistance+this.anchor.z;
    }

    update(obj: GObject, gameWin: GameWindow) {
        if (DEBUG_INFO.camera.topDown) {
            if (this.camera !== this.orthoCam) {
                this.camera = this.orthoCam;
            }
            this.camera.position.x = 0;
            this.camera.position.z = 0;
            this.camera.lookAt(this.anchor);
        }else if(this.isLocked) {
            this.camera.position.x = Math.sin(this.rotation)*this.depth*this.cameraDistance+this.anchor.x;
            this.camera.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;
            this.camera.position.z = Math.cos(this.rotation)*this.depth*this.cameraDistance+this.anchor.z;
            this.camera.lookAt(this.anchor);
        }
    }

    draw (context?: THREE.Scene) {
        this.gw.threeRenderer.render(this.gw.threeScene, this.gw.threeCamera);
    };

    move(dir: THREE.Vector2, velocity: number) {
        if (!this.isLocked) {
            var velz = new THREE.Vector2();
            velz.x = dir.y*velocity/Math.SQRT2*Math.sin(this.rotation);
            velz.y = dir.y*velocity/Math.SQRT2*Math.cos(this.rotation);

            this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), dir.x*velocity);
            this.camera.position.x += velz.x;
            this.camera.position.z += velz.y;
        }
    }

    rotate(rotation: position) {
        if (!this.isLocked) {
            // const q = this.camera.getWorldQuaternion(new THREE.Quaternion());
            // const e = new THREE.Euler().setFromQuaternion(q);

            // if (ang > -Math.PI/2 && rotation.y < 0 || ang < Math.PI/2 && rotation.y > 0 ) {
                // }

            this.camera.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), rotation.x);
            this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y);

        }
    }

    zoom(dir: number) {
        if (!this.isLocked) {
            // this.camera.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;
            if (this.camera.position.y > Math.sin(this.cameraAngle)*this.depth*.25 && dir < 0) {
                this.camera.translateZ(dir*this.depth*this.cameraDistance);
            }
            if (this.camera.position.y < Math.sin(this.cameraAngle)*this.depth*.75 && dir > 0) {
                this.camera.translateZ(dir*this.depth*this.cameraDistance);
            }
        }
    }

    toggleLock() {
        this.isLocked = !this.isLocked;
        if (!this.isLocked) {
            this.resetPerspectiveCam();
            this.camera = this.perspectiveCam;
        }else {
            this.resetOrthoCam();
            this.camera = this.orthoCam;
            this.gw.threeCamera = this.orthoCam;
        }
        this.gw.threeCamera = this.camera;
    }

    resize() {
        if (!DEBUG_INFO.camera.dontChangeSize) {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspectRatio = this.width/this.height;

            this.gw.threeRenderer.setSize(this.width, this.height);

            this.orthoCam.left = this.quad.left*this.aspectRatio-1;
            this.orthoCam.right = this.quad.right*this.aspectRatio-1;
            this.orthoCam.top = this.quad.top+1;
            this.orthoCam.bottom = this.quad.bottom+1;
            this.orthoCam.updateProjectionMatrix();
        }
    }
}