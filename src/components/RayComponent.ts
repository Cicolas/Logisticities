import * as THREE from 'three';
import { Color } from 'three';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import PlaneComponent from './PlaneComponent';

export default class RayComponent implements ComponentInterface {
    name: string = "RayComponent";
    width: number;
    height: number;
    mousePos: THREE.Vector2 = new THREE.Vector2();

    rayPos = new THREE.Vector3();

    private geometry;
    private material;
    private mesh;

    init(gameWin: GameController) {
        this.width = gameWin.width;
        this.height = gameWin.height;

        gameWin.canvas.addEventListener("mousemove", this.mouseMove, false);

        this.geometry = new THREE.SphereGeometry(1);
        this.material = new THREE.MeshStandardMaterial({color: "red"});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        gameWin.threeScene.add(this.mesh);
    }

    mouseMove = (e) => {
        // console.log(e);

        this.mousePos.x = ( e.clientX / this.width ) * 2 - 1;
        this.mousePos.y = - ( e.clientY / this.height ) * 2 + 1;

        // console.log(this.mousePos);
    }

    update(obj: GObject, gameWin: GameController) {
        const ray = new THREE.Raycaster();
        ray.setFromCamera(this.mousePos, gameWin.threeCamera);

        const intersects = ray.intersectObjects(gameWin.threeScene.children);

        for ( let i = 0; i < intersects.length; i ++ ) {
            // const obj = gameWin.getScene().getObject(intersects[i].object.name)
            // let comp: PlaneComponent;

            // if (obj) {
            //     comp = obj.getComponent(PlaneComponent) as PlaneComponent
            // }


            // if (comp) {
                // (comp.mesh.material as THREE.MeshStandardMaterial).color = new Color("white");
            // }

            this.rayPos = intersects[i].point;
        }
    }

    draw (context?: THREE.Scene) {
        this.mesh.position.x = this.rayPos.x-1;
        this.mesh.position.y = this.rayPos.y+2;
        this.mesh.position.z = this.rayPos.z-1;
    };

}