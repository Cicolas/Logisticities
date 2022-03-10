import * as THREE from 'three';
import { DEBUG_INFO } from '../enviroment';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { color } from './PlaneComponent';

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
    public height: number;
    public depth: number;
    private color: THREE.Color;
    private opacity: number;

    constructor(seaI: SeaInterface){
        this.width = seaI.width;
        this.height = seaI.height;
        this.depth = seaI.depth;
        this.opacity = seaI.opacity;
        this.color = new THREE.Color();
        this.color.r = seaI.color.r;
        this.color.g = seaI.color.g;
        this.color.b = seaI.color.b;
    }

    init(gameWin: GameController) {
        // console.log(this.map);
        this.geometry = new THREE.PlaneGeometry(this.width-1, this.depth-1);
        this.material = new THREE.MeshStandardMaterial({
            color: this.color,
            opacity: this.opacity,
            // depthFunc: THREE.NotEqualDepth,
            transparent: true
            // blending: THREE.MultiplyBlending,
        });
        this.material.visible = true;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI/2;
        this.mesh.position.x = -.5;
        this.mesh.position.z = -.5;

        if (!DEBUG_INFO.hideSea) {
            gameWin.threeScene.add(this.mesh);
        }
    }

    update(obj: GObject, gameWin: GameWindow) {
        // this.mesh.rotation.y += 0.01;
        // (this.mesh.material as THREE.MeshStandardMaterial).color = new Color(0x3b9126);
    }

    draw (context?: THREE.Scene) {};
}