import * as THREE from 'three';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GObject from "../lib/CUASAR/GObject";
import PlaneComponent from './PlaneComponent';
import cityOBJ from "../models/predio.obj";
import { DEBUG_INFO } from '../enviroment';
import { Color } from 'three';
import RoadComponent from './RoadComponent';
import Suply, { getRandomNeed, startRandomSuply } from '../scripts/suply';
import { CityInterface } from './UI/box/BoxElement';

const CITY_SIZE = 3;

export default class CityComponent implements ComponentInterface, CityInterface {
    name: string = "CityComponent";
    public mesh: THREE.Mesh;

    public cityName: string;
    public isSelected: boolean;
    public UUID: string;
    public position: THREE.Vector3;
    public coordinates: THREE.Vector2;
    public roads: RoadComponent[] = [];
    public suplies: Suply[] = [];

    private plane: PlaneComponent;
    private definiton: number;
    private n: number = 0;

    constructor(coordX: number = 0, coordY: number = 0, definition: number, options){
        this.coordinates = new THREE.Vector2(coordX, coordY);
        this.position = new THREE.Vector3(0, -100, 0);
        this.definiton = definition;
        this.cityName = options.name;
        this.UUID = options.UUID.toString();
    }

    init(gameWin: GameController) {
        this.plane = gameWin.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;

        if (DEBUG_INFO.city.dontLoadObj) {
            const geometry = new THREE.BoxGeometry(this.definiton/80*CITY_SIZE, this.definiton/80*CITY_SIZE, this.definiton/80*CITY_SIZE);
            const material = new THREE.MeshStandardMaterial({color: "purple"});
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.name = this.UUID;
            this.mesh.rotation.x = 3/2*Math.PI;
            this.setCity();
            gameWin.threeScene.add(this.mesh);
        }else {
            this.loadOBJ(gameWin);
        }

        this.startSuply();

        setTimeout(this.postInit.bind(this), 10, gameWin);
    }

    postInit(gameWin: GameController) {
        this.getNeeds();
    }

    update(obj: GObject, gameWin: GameController) {
        this.n += gameWin.dt;

        for (let i = 0; i < this.suplies.length; i++) {
            const element = this.suplies[i];
            element.quantity += gameWin.dt
        }
    }

    draw (context?: THREE.Scene) {
        if (this.mesh) {
            (this.mesh.material as THREE.MeshStandardMaterial).color = this.isSelected?new Color("#fff"): new Color("#777");
        }
    }

    setCity() {
        const v = this.plane.grid[this.coordinates.x][this.coordinates.y];

        this.position = v.position;
        this.mesh.position.x = v.position.x;
        this.mesh.position.y = v.position.y+(DEBUG_INFO.city.dontLoadObj?.5:0);
        this.mesh.position.z = v.position.z;

        if (DEBUG_INFO.city.dontLoadObj) {
            this.mesh.rotation.x = -Math.atan2(v.normal.y, v.normal.z);
            this.mesh.rotation.y = 1/2*Math.PI-Math.atan2(v.normal.y, v.normal.x);
        }else {
            this.mesh.rotation.x = -Math.atan2(v.normal.y, v.normal.z)+Math.PI/2;
            this.mesh.rotation.z = Math.atan2(v.normal.y, v.normal.x)-Math.PI/2;
        }
    }

    loadOBJ(gameWin: GameController) {
        const loader = new OBJLoader();

        loader.load(cityOBJ, (obj: THREE.Group) => {
            const c = obj.children[0] as THREE.Mesh;
            c.parent = null;

            this.mesh = c;
            this.mesh.name = this.UUID;
            this.setCity();
            this.mesh.scale.x = this.definiton/80;
            this.mesh.scale.y = this.definiton/80;
            this.mesh.scale.z = this.definiton/80;
            gameWin.threeScene.add(this.mesh);
        })

        return;
    }

    addRoad(road: RoadComponent): boolean {
        this.roads.push(road);
        return true;
    }

    startSuply() {
        this.suplies.push(startRandomSuply(this.cityName))
    }

    getNeeds() {
        const suply = {...getRandomNeed(this.cityName)[1]};
        suply.need = true;

        this.suplies.push(suply);
    }
}