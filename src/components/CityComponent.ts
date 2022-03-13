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
    public isSelected: boolean;

    private plane: PlaneComponent;
    public coordinates: THREE.Vector2;
    private position: THREE.Vector3;
    private definiton: number;
    private uuid: string;

    constructor(coordX: number = 0, coordY: number = 0, definition: number, options){
        this.coordinates = new THREE.Vector2(coordX, coordY);
        this.position = new THREE.Vector3(0, -100, 0);
        this.definiton = definition;
        this.cityName = options.name;
        this.uuid = options.UUID.toString();
    }

    init(gameWin: GameController) {
        this.plane = gameWin.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;

        const geometry = new THREE.BoxGeometry(this.definiton/80*CITY_SIZE, this.definiton/80*CITY_SIZE, this.definiton/80*CITY_SIZE);
        const material = new THREE.MeshStandardMaterial({color: "purple"});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = this.uuid;
        this.mesh.rotation.x = 3/2*Math.PI;
        gameWin.threeScene.add(this.mesh);

        setTimeout(this.postInit.bind(this), 10);
    }

    postInit() {
        this.spawnCity();
    }

    update(obj: GObject, gameWin: GameWindow) {
        // if (this.isSelected) {
        //     console.log(this.mesh.rotation.x*180/Math.PI+90);
        //     console.log(this.mesh.rotation.y*180/Math.PI);
        // }
    }

    draw (context?: THREE.Scene) {
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y+.5;
        this.mesh.position.z = this.position.z;
        (this.mesh.material as THREE.MeshStandardMaterial).color = this.isSelected?new Color("red"): new Color("purple");
    }

    spawnCity() {
        const v = this.plane.grid[this.coordinates.x][this.coordinates.y];

        this.position = v.position;
        this.mesh.rotation.x = -Math.atan2(v.normal.y, v.normal.z);
        this.mesh.rotation.y = 1/2*Math.PI-Math.atan2(v.normal.y, v.normal.x);
    }
}