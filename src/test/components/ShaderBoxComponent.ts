import * as THREE from 'three';
import { DEBUG_INFO } from '../../enviroment';
import GameController from '../../GameController';
import ComponentInterface from "../../lib/CUASAR/Component";
import GameWindow from "../../lib/CUASAR/GameWindow";
import GObject from "../../lib/CUASAR/GObject";
import { color, InverseLerp, position, Vertex } from '../../scripts/utils';
import util from 'util';

import vertShader from "../shaders/default.vert";
import fragShader from "../shaders/default.frag";

const SMOOTHNESS = 300;

export default class ShaderBoxComponent implements ComponentInterface {
    name: string = "ShaderBoxComponent";
    public mesh: THREE.Mesh;
    private geometry: any;
    private material: THREE.Material;
    private gw: GameController;

    private firstClick: THREE.Vector2 = new THREE.Vector2();
    private mousePos: THREE.Vector2 = new THREE.Vector2();
    private isRotating: boolean;

    public uniformsTable = {
        "time": { value: 1.0 },
        "resolution": {value: new THREE.Vector2()},
        "color": {value: new THREE.Vector3(1, .2, 1)},
        "directionalLightColor": {value: new THREE.Vector3(1, 1, 1)},
        "directionalLightDirection": {value: new THREE.Vector3(0, 1, 0)},
        "directionalLightIntensity": {value: .7},
        "ambientLightColor": {value: new THREE.Vector3(171/255, 220/255, 255/255)},
        "ambientLightIntensity": {value: .3},
        "pointLightColors": {value: []},
        "pointLightIntensity": {value: []},
        "pointLightPosition": {value: []},
        "fogColor": { value: new THREE.Vector3()},
        "fog": {value: new THREE.Vector3()},
        "fogNear": {value: 0},
        "fogFar": {value: 0},
    }

    constructor() {}

    init(gameWin: GameController) {
        this.gw = gameWin;

        this.geometry = new THREE.IcosahedronGeometry(10, 1);
        this.material = new THREE.ShaderMaterial({
            defines: {
                PI: Math.PI
            },
            uniforms: this.uniformsTable,
            fragmentShader: fragShader,
            vertexShader: vertShader
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.setFog(this.uniformsTable, gameWin.threeScene);
        this.uniformsTable["resolution"].value =
            new THREE.Vector2(gameWin.width, gameWin.height);
        this.gw.threeScene.add(this.mesh);

        // setTimeout(this.postInit.bind(this, gameWin), 100);
    }

    postInit(gameWin: GameController) {
        gameWin.canvas.addEventListener("mousedown", this.mouseDown);
        gameWin.canvas.addEventListener("mousemove", this.mouseMove);
        gameWin.canvas.addEventListener("mouseup", this.mouseUp);
    }
    mouseMove = (e) => {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
    };
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
    };

    update(obj: GObject, gameWin: GameController) {
        if (this.isRotating && this.mesh) {
            const move = {x: this.firstClick.x, y: this.firstClick.y};
            move.x = -(this.mousePos.x - this.firstClick.x) / SMOOTHNESS;
            move.y = -(this.mousePos.y - this.firstClick.y) / SMOOTHNESS;
            this.rotate(move);
            this.firstClick.copy(this.mousePos);
        }else {
            this.mesh?.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), .01);
        }

        this.uniformsTable["time"].value = gameWin.frame;
    }

    draw(context?: THREE.Scene) {}

    rotate(move: position) {
        this.mesh.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -move.x);
        this.mesh.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -move.y);
    }

    setFog(uniforms, threeScene: THREE.Scene) {
        uniforms["fogColor"].value = new THREE.Vector3(
            threeScene.fog.color.r,
            threeScene.fog.color.g,
            threeScene.fog.color.b
            // 0, 0, 0
        );
        uniforms["fog"].value = new THREE.Vector3(
            threeScene.fog.color.r,
            threeScene.fog.color.g,
            threeScene.fog.color.b
            // 0, 0, 0
        );
        //@ts-ignore
        uniforms["fogNear"].value = threeScene.fog.near;
        //@ts-ignore
        uniforms["fogFar"].value = threeScene.fog.far;
    }
}