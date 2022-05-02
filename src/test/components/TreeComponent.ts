import * as THREE from 'three';
import { Color } from 'three';
import { DEBUG_INFO } from '../../enviroment';
import GameController from '../../GameController';
import ComponentInterface from "../../lib/CUASAR/Component";
import GameWindow from "../../lib/CUASAR/GameWindow";
import GObject from "../../lib/CUASAR/GObject";
import { RGBtoVEC3 } from '../../scripts/utils/shadersUtil';
import { InverseLerp, position, position3D, Vertex } from '../../scripts/utils/utils';

import DefaultMaterial from '../materials/DefaultMaterial';
import fragShader from '../shaders/default.frag';
import vertShader from '../shaders/tree/tree.vert';

const SMOOTHNESS = 300;

export default class TreeComponent implements ComponentInterface {
    name: string = "TreeComponent";
    public obj: THREE.Object3D;
    private gw: GameController;
    private leafMaterial: DefaultMaterial;
    private woodMaterial: DefaultMaterial;

    private firstClick: THREE.Vector2 = new THREE.Vector2();
    private mousePos: THREE.Vector2 = new THREE.Vector2();
    private isRotating: boolean;

    constructor(public position: position3D) {}

    init(gameWin: GameController) {
        this.gw = gameWin;
        const leafGeometry = new THREE.OctahedronGeometry(5, 2);
        this.leafMaterial = new DefaultMaterial(fragShader, vertShader, true);

        this.setLights(this.leafMaterial.uniformsTable, null, null);
        this.setFog(this.leafMaterial.uniformsTable, gameWin.threeScene);
        this.leafMaterial.uniformsTable["resolution"].value =
            new THREE.Vector2(gameWin.width, gameWin.height);
        this.leafMaterial.uniformsTable["color"].value =
            new THREE.Vector3(0, .6, 0);
        this.leafMaterial.uniformsTable["directionalLightIntensity"].value = .4;
        this.leafMaterial.uniformsTable["ambientLightIntensity"].value = .6;
        this.leafMaterial.uniformsTable["opacity"] = {value: .9};
        this.leafMaterial.uniformsTable["windForce"] = {value: .05};
        this.leafMaterial.uniformsTable["windDirection"] =
            {value: new THREE.Vector3(1, 0, 0)};

        leafGeometry.translate(0, Math.SQRT2*5, 0);
        this.leafMaterial.material.transparent = true;

        // wood material
        const woodGeometry = new THREE.CylinderGeometry(1, 1, 5);
        this.woodMaterial = new DefaultMaterial();

        this.setLights(this.woodMaterial.uniformsTable, null, null);
        this.setFog(this.woodMaterial.uniformsTable, gameWin.threeScene);
        this.woodMaterial.uniformsTable["resolution"].value =
            new THREE.Vector2(gameWin.width, gameWin.height);
        this.woodMaterial.uniformsTable["color"].value =
            RGBtoVEC3(new Color("brown"));
        this.woodMaterial.uniformsTable["ambientLightIntensity"].value = .6;

        this.obj = new THREE.Object3D();
        this.obj.add(new THREE.Mesh(leafGeometry, this.leafMaterial.material));
        this.obj.add(new THREE.Mesh(woodGeometry, this.woodMaterial.material));
        this.gw.threeScene.add(this.obj);
        this.obj.position.x = this.position.x;
        this.obj.position.y = this.position.y;
        this.obj.position.z = this.position.z;
        setTimeout(this.postInit.bind(this, gameWin), 100);
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
        if (this.isRotating && this.obj) {
            const move = {x: this.firstClick.x, y: this.firstClick.y};
            move.x = -(this.mousePos.x - this.firstClick.x) / SMOOTHNESS;
            move.y = -(this.mousePos.y - this.firstClick.y) / SMOOTHNESS;
            this.rotate(move);
            this.firstClick.copy(this.mousePos);
        }else {
            // this.obj?.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), .01);
        }

        this.leafMaterial.uniformsTable["time"].value += gameWin.dt;
    }

    draw(context?: THREE.Scene) {}

    rotate(move: position) {
        this.obj.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), -move.x);
        this.obj.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -move.y);
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

    setLights(uniforms, color: THREE.Vector3, position: THREE.Vector3) {
        uniforms["pointLightColors"].value.push(new THREE.Vector3(1, 1, 1));
        uniforms["pointLightPosition"].value.push(new THREE.Vector3(0, 0, 0));
        uniforms["pointLightIntensity"].value.push(.7);

        // uniforms["pointLightColors"].value.push(new THREE.Vector3(0, 0, 1));
        // uniforms["pointLightPosition"].value.push(new THREE.Vector3(0, 0, 50));
        // uniforms["pointLightIntensity"].value.push(.7);

        // uniforms["pointLightColors"].value.push(new THREE.Vector3(0, 1, 0));
        // uniforms["pointLightPosition"].value.push(new THREE.Vector3(0, 50, 0));
        // uniforms["pointLightIntensity"].value.push(.7);
    }
}