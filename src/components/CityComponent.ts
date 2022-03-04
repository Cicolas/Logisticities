import * as THREE from 'three';
import { BufferGeometry, Color } from "three";
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import PlaneComponent from './PlaneComponent';

export default class CityComponent implements ComponentInterface {
    name: string = "CityComponent";
    public mesh: THREE.Mesh;

    private plane: PlaneComponent;
    private coordinates: THREE.Vector2;
    private position: THREE.Vector3;

    init(gameWin: GameController) {
        this.plane = gameWin.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;

        this.coordinates = new THREE.Vector2(0, -10);
        this.position = new THREE.Vector3(0, -100, 0);

        const geometry = new THREE.BoxGeometry(2, 2);
        const material = new THREE.MeshStandardMaterial({color: "purple"});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = 3/2*Math.PI;
        gameWin.threeScene.add(this.mesh);

        setTimeout(this.postInit.bind(this), 100);
    }

    postInit() {
        const p = this.plane.getPositionByCoordinates(this.coordinates);

        this.position = p.position;
        this.mesh.rotation.x = -Math.atan2(p.normal.y, p.normal.z);
        this.mesh.rotation.y = 1/2*Math.PI-Math.atan2(p.normal.y, p.normal.x);

        console.log(Math.atan2(p.normal.y, p.normal.x)/Math.PI*180);
        console.log("normal: ", p.normal);
        console.log(this.mesh.rotation);
    }

    update(obj: GObject, gameWin: GameWindow) {
    }

    draw (context?: THREE.Scene) {
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y+1;
        this.mesh.position.z = this.position.z;
    };
}