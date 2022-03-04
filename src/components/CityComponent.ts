import { randomUUID } from 'crypto';
import * as THREE from 'three';
import { BufferGeometry, Color } from "three";
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import PlaneComponent from './PlaneComponent';

const CITY_SIZE = 3;

export default class CityComponent implements ComponentInterface {
    name: string = "CityComponent";
    public mesh: THREE.Mesh;

    public cityName: string;

    private plane: PlaneComponent;
    private coordinates: THREE.Vector2;
    private position: THREE.Vector3;
    private definiton: number;

    constructor(coordX: number = 0, coordY: number = 0, definition: number, mapsize: number, options){
        this.coordinates = new THREE.Vector2(coordX*definition/2*mapsize, coordY*definition/2*mapsize);
        this.position = new THREE.Vector3(0, -100, 0);
        this.definiton = definition;
        this.cityName = options.name;
    }

    init(gameWin: GameController) {
        this.plane = gameWin.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;

        console.log(this.cityName);

        const geometry = new THREE.BoxGeometry(this.definiton/80*CITY_SIZE, this.definiton/80*CITY_SIZE, this.definiton/80*CITY_SIZE);
        const material = new THREE.MeshStandardMaterial({color: "purple"});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.cityName;
        this.mesh.rotation.x = 3/2*Math.PI;
        gameWin.threeScene.add(this.mesh);

        setTimeout(this.postInit.bind(this), 100);
    }

    postInit() {
        const p = this.plane.getPositionByCoordinates(this.coordinates);

        this.position = p.position;
        this.mesh.rotation.x = -Math.atan2(p.normal.y, p.normal.z);
        this.mesh.rotation.y = 1/2*Math.PI-Math.atan2(p.normal.y, p.normal.x);

        // console.log(Math.atan2(p.normal.y, p.normal.x)/Math.PI*180);
        // console.log("normal: ", p.normal);
        // console.log(this.mesh.rotation);
    }

    update(obj: GObject, gameWin: GameWindow) {
    }

    draw (context?: THREE.Scene) {
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y+.5;
        this.mesh.position.z = this.position.z;
        (this.mesh.material as THREE.MeshStandardMaterial).color = new Color("purple");
    };
}