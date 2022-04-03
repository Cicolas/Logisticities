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
import Suply, { addInventory, getFromInventory, getRandomNeed, startRandomSuply, SuplyInventory, trainController } from '../scripts/suply';
import TrainComponent, { Train } from './TrainComponent';
import { pullToTop, pushToBottom } from '../scripts/utils';

const CITY_SIZE = 3;
const TRAIN_INTERVAL = 1;
const TRAIN_LIMIT = 1;
const TRAIN_CAPACITY = 10;

export interface CityInterface {
    UUID: string,
    cityName: string,
    roads?: RoadComponent[],
    productionSuply?: Suply[],
    trains: Train[],
}

export default class CityComponent implements ComponentInterface, CityInterface {
    name: string = "CityComponent";
    private gw: GameController;
    public mesh: THREE.Mesh;

    public cityName: string;
    public isSelected: boolean;
    public UUID: string;
    public position: THREE.Vector3;
    public coordinates: THREE.Vector2;
    public roads: RoadComponent[] = [];
    public productionSuply: Suply[] = [];
    public inventorySuply: SuplyInventory[] = [];
    public trains: Train[] = [];

    private lastSent: [CityInterface, RoadComponent, Suply][] = [];
    private plane: PlaneComponent;
    private definiton: number;
    private interval: number = 0;

    constructor(coordX: number = 0, coordY: number = 0, definition: number, options){
        this.coordinates = new THREE.Vector2(coordX, coordY);
        this.position = new THREE.Vector3(0, -100, 0);
        this.definiton = definition;
        this.cityName = options.name;
        this.UUID = options.UUID.toString();
    }

    init(gameWin: GameController) {
        this.gw = gameWin;
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
        this.addTrain();

        setTimeout(this.postInit.bind(this), 10, gameWin);
    }

    postInit(gameWin: GameController) {
        this.getNeeds();
    }

    update(obj: GObject, gameWin: GameController) {
        this.interval += gameWin.dt;

        if (this.interval > TRAIN_INTERVAL) {
            if (this.roads.length > 0 && this.trains.length > 0) {
                this.interval = 0;
                this.sendTrain(trainController(this));
            }
        }

        for (let i = 0; i < this.productionSuply.length; i++) {
            if (!this.productionSuply[i].need) {
                addInventory(this.inventorySuply, {
                    id: this.productionSuply[i].id,
                    quantity: this.productionSuply[i].productionRate*gameWin.dt,
                })
            }else {
                this.productionSuply[i].needNumber += this.productionSuply[i].productionRate*gameWin.dt;
            }
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
        this.productionSuply.push(startRandomSuply(this))
    }

    getNeeds() {
        const suply = getRandomNeed(this)[1];
        suply.needNumber = 0;
        suply.productionRate = 2;

        this.productionSuply.push(suply);
    }

    addTrain() {
        this.trains.push({
            velocity: 4,
            carrying: 0,
            capacity: 0,
            suply: null
        })
    }

    receiveTrain(t: Train) {
        const index = this.productionSuply.find(value => {
            return (
                value.need === true
                && value.id === t.suply.id
            )
        });

        if (index) {
            index.needNumber -= t.carrying;
            // console.log(this.productionSuply);
        }

        addInventory(this.inventorySuply, {
            id: t.suply.id,
            quantity: t.carrying
        })
    }

    sendTrain(cities: [CityInterface, RoadComponent, Suply][]) {
        if (cities.length > 0) {
            var c: [CityInterface, RoadComponent, Suply];

            for (let i = 0; i < cities.length; i++) {
                if (this.neverSent(cities[i])) {
                    c = cities[i]
                }
            }

            if (!c) {
                c = this.lastSent[0];
                pushToBottom(this.lastSent);
            }

            if (this.trains.length > 0) {
                const t = this.trains.pop();
                t.capacity = TRAIN_CAPACITY;
                t.carrying = getFromInventory(this.inventorySuply, c[2], c[0], t.capacity);
                t.suply = c[2];

                this.gw.getScene().addObject(
                    new GObject("trem").addComponent(
                        new TrainComponent(t, this, c[1])
                    ).initObject(this.gw)
                )

                this.addLastSent(c);
            }
        }
    }

    neverSent(item: [CityInterface, RoadComponent, Suply]) {
        const index = this.lastSent.findIndex(value => {
            return (value[0].UUID === item[0].UUID && value[2].id === item[2].id)
        })

        return (index===-1)?true: false;
    }

    addLastSent(item: [CityInterface, RoadComponent, Suply]) {
        if (this.neverSent(item)) {
            this.lastSent.push(item);
            return;
        }
    }
}