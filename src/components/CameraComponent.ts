import * as THREE from "three";
import { Camera, Vector2 } from "three";
import { DEBUG_INFO } from "../enviroment";
import GameController from "../GameController";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { position } from "../scripts/utils";
import PlaneComponent from "./PlaneComponent";

export interface CameraInterface{
    cameraAngle: number,
    cameraDistance: number,
    width: number,
    height: number,
    depth: number,
    isLocked: boolean
}

export default class CameraComponent implements ComponentInterface {
    name: string = "CameraComponent";
    private gw: GameController;
    public camera: THREE.Camera;

    private cameraAngle: number;
    public cameraDistance: number;
    private width: number;
    private height: number;
    private depth: number;
    private isLocked: boolean;
    public rotation: number;
    public anchor: THREE.Vector3;

    constructor(cameraI: CameraInterface){
        this.cameraAngle = cameraI.cameraAngle;
        this.cameraDistance = cameraI.cameraDistance;
        this.width = cameraI.width;
        this.height = cameraI.height;
        this.depth = cameraI.depth;
        this.isLocked = cameraI.isLocked;
        this.rotation = 0;
        this.anchor = new THREE.Vector3();
    }

    init(gameWin: GameWindow) {
        this.gw = (gameWin as GameController);

        if (DEBUG_INFO.camera.ortho) {
            this.camera = new THREE.OrthographicCamera(
                DEBUG_INFO.camera.left,
                DEBUG_INFO.camera.right,
                DEBUG_INFO.camera.top,
                DEBUG_INFO.camera.bottom
            );

            this.camera.rotation.x = -Math.PI/2;
            this.camera.position.y = (DEBUG_INFO.camera.right-DEBUG_INFO.camera.left)/2;
        }else{
            this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 10000);
            this.camera.rotation.x = -this.cameraAngle;

            if (this.isLocked) {
                this.camera.lookAt(this.anchor);
            }
            this.camera.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;
            this.camera.position.z = Math.cos(this.cameraAngle)*this.depth*this.cameraDistance;
        }

        this.gw.threeCamera = this.camera;
    }

    update(obj: GObject, gameWin: GameWindow) {
        if (DEBUG_INFO.camera.ortho) {
            this.camera.position.x = 0;
            this.camera.position.z = 0;
        }

        if (this.isLocked) {
            this.gw.threeCamera.position.x = Math.sin(this.rotation)*this.depth*this.cameraDistance+this.anchor.x;
            this.gw.threeCamera.position.y = Math.sin(this.cameraAngle)*this.depth*this.cameraDistance;
            this.gw.threeCamera.position.z = Math.cos(this.rotation)*this.depth*this.cameraDistance+this.anchor.z;
            this.gw.threeCamera.lookAt(this.anchor);
        }
    }

    draw (context?: THREE.Scene) {
        this.gw.threeRenderer.render(this.gw.threeScene, this.gw.threeCamera);
    };

    move(dir: THREE.Vector2, velocity: number) {
        if (!this.isLocked) {
            var velz = new THREE.Vector2();
            velz.x = dir.y*velocity/Math.SQRT2*Math.sin(this.rotation);
            velz.y = dir.y*velocity/Math.SQRT2*Math.cos(-this.rotation);

            this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), dir.x*velocity)
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
}