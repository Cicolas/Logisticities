import * as THREE from 'three';
import { DEBUG_INFO } from '../enviroment';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { color } from '../scripts/utils';

import fragShader from '../shaders/water/water.frag';
import vertShader from '../shaders/water/water.vert';

export interface SeaInterface {
    width: number;
    height: number;
    depth: number;
    color: color;
    opacity: number;
}

export default class SeaComponent implements ComponentInterface {
    name: string = "SeaComponent";
    public mesh: THREE.Mesh;
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;

    public width: number;
    public depth: number;
    private color: THREE.Color;
    private opacity: number;

    public uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
        color: { value: new THREE.Vector3() },
        fogColor: { value: new THREE.Vector3() },
        fog: { value: new THREE.Vector3() },
        fogNear: { value: 0 },
        fogFar: { value: 0 },
        // "fogColor":    {value: scene.fog.color },
        // "fogNear":     {value: scene.fog.near },
        // "fogFar":      {value: scene.fog.far }
    };

    constructor(seaI: SeaInterface) {
        this.width = seaI.width;
        this.depth = seaI.depth;
        this.opacity = seaI.opacity;
        this.color = new THREE.Color();
        this.color.r = seaI.color.r;
        this.color.g = seaI.color.g;
        this.color.b = seaI.color.b;
    }

    init(gameWin: GameController) {
        this.geometry = new THREE.PlaneGeometry(this.width - 1, this.depth - 1);
        this.uniforms["resolution"].value = new THREE.Vector2(
            gameWin.width,
            gameWin.height
        );
        this.uniforms["color"].value = new THREE.Vector3(
            this.color.r,
            this.color.g,
            this.color.b
        );
        this.uniforms["fogColor"].value = new THREE.Vector3(
            gameWin.threeScene.fog.color.r,
            gameWin.threeScene.fog.color.g,
            gameWin.threeScene.fog.color.b
            // 0, 0, 0
        );
        this.uniforms["fog"].value = new THREE.Vector3(
            gameWin.threeScene.fog.color.r,
            gameWin.threeScene.fog.color.g,
            gameWin.threeScene.fog.color.b
            // 0, 0, 0
        );
        //@ts-ignore
        this.uniforms["fogNear"].value = gameWin.threeScene.fog.near;
        //@ts-ignore
        this.uniforms["fogFar"].value = gameWin.threeScene.fog.far;

        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            fragmentShader: fragShader,
            vertexShader: vertShader,
            fog: true,
        });

        this.material.visible = true;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = "sea";
        this.mesh.receiveShadow = true;
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.x = -0.5;
        this.mesh.position.z = -0.5;

        if (!DEBUG_INFO.hideSea) {
            gameWin.threeScene.add(this.mesh);
        }
    }

    update(obj: GObject, gameWin: GameController) {
        this.uniforms["time"].value = gameWin.frame;
    }

    draw(context?: THREE.Scene) {}
}