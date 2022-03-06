import * as THREE from 'three';
import { Color } from 'three';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import PlaneComponent from './PlaneComponent';

export default class RayComponent implements ComponentInterface {
    name: string = "RayComponent";
    private gw: GameController;
    private mesh;

    private mousePos: THREE.Vector3 = new THREE.Vector3();
    private rayPos = new THREE.Vector3();

    init(gameWin: GameController) {
        this.gw = gameWin;

        gameWin.canvas.addEventListener("mousemove", this.mouseMove, false);

        const geometry = new THREE.CircleGeometry(1);
        const material = new THREE.MeshStandardMaterial({color: "yellow"});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = 3/2*Math.PI;
        gameWin.threeScene.add(this.mesh);
    }

    mouseMove = (e: MouseEvent) => {
        const bb = this.gw.canvas.getBoundingClientRect();
        const mx = e.clientX - bb.left;
        const my = e.clientY - bb.top;

        this.mousePos.x = ( mx / this.gw.width ) * 2 - 1;
        this.mousePos.y = - ( my / this.gw.height ) * 2 + 1;
        this.mousePos.z = .5;
    }

    update(obj: GObject, gameWin: GameController) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera(this.mousePos, gameWin.threeCamera);

        const intersects = ray.intersectObjects(gameWin.threeScene.children);

        for ( let i = 0; i < intersects.length; i ++ ) {
            this.rayPos = intersects[i].point;
        }
    }

    draw (context?: THREE.Scene) {
        this.mesh.position.x = this.rayPos.x;
        this.mesh.position.y = this.rayPos.y+.5;
        this.mesh.position.z = this.rayPos.z;
    };

}