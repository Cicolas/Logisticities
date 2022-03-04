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
    mousePos: THREE.Vector3 = new THREE.Vector3();

    rayPos = new THREE.Vector3();

    private mesh;

    private plane;

    init(gameWin: GameController) {
        this.plane = gameWin.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;

        this.width = gameWin.width;
        this.height = gameWin.height;

        gameWin.canvas.addEventListener("mousemove", this.mouseMove, false);

        const geometry = new THREE.CircleGeometry(1);
        const material = new THREE.MeshStandardMaterial({color: "red"});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = 3/2*Math.PI;
        gameWin.threeScene.add(this.mesh);
    }

    mouseMove = (e) => {
        // console.log(e);

        this.mousePos.x = ( e.clientX / this.width ) * 2 - 1.02;
        this.mousePos.y = - ( e.clientY / this.height ) * 2 + 1.02;
        this.mousePos.z = .5;

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
        this.mesh.position.x = this.rayPos.x;
        this.mesh.position.y = this.rayPos.y;
        this.mesh.position.z = this.rayPos.z;
    };

}