import * as THREE from 'three';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import Suply from '../scripts/suply';
import { Clamp } from '../scripts/utils/utils';
import CityComponent from './CityComponent';
import PlaneComponent from './PlaneComponent';
import RoadComponent from './RoadComponent';

export interface Train {
    velocity: number,
    carrying: number,
    capacity: number,
    suply: Suply
}

export default class TrainComponent implements ComponentInterface, Train {
    name: string = "TrainComponent";
    private gw: GameController;
    public mesh: THREE.Mesh;
    public velocity: number;
    public finish: boolean;
    public carrying: number;
    public capacity: number;
    public suply: Suply;

    private direction: number;
    private city
    private road: RoadComponent;
    private n: number = 0;

    constructor(train: Train, city: CityComponent, road: RoadComponent, velocity: number = 4){
        this.road = road;
        this.velocity = train.velocity;
        this.capacity = train.capacity;
        this.carrying = train.carrying;
        this.suply = train.suply;
        this.city = city;

        this.direction = (city.UUID === road.cities[0].UUID)?1:-1;
    }

    init(gameWin: GameController) {
        this.gw = gameWin;
        const geometry = new THREE.BoxGeometry(1, .5, .5);
        const material = new THREE.MeshStandardMaterial({color: "orange"});
        this.mesh = new THREE.Mesh(geometry, material);

        gameWin.threeScene.add(this.mesh);

        setTimeout(this.postInit.bind(this), 20, gameWin);
    }

    postInit(gameWin: GameController) {
    }

    update(obj: GObject, gameWin: GameController) {
        if (Math.floor(this.n*this.road.vertices.length-1) < this.road.vertices.length-1) {
            this.n += gameWin.dt*(1/this.road.distance)*this.velocity;

            this.setPosition(this.n);
        }else{
            this.finishCourse();
            this.finish = true;
            this.gw.getScene().removeObject(obj);
        }
    }

    draw (context?: THREE.Scene) {};

    setPosition(t: number) {
        var percent = t;
        if(this.direction === -1){
            percent = -1*(percent-1);
        }

        var n = Clamp(Math.floor(percent*this.road.vertices.length-1), 0, this.road.vertices.length-1);

        const pos = this.road.vertices[n];

        const rotation = new THREE.Vector3();
        if (n+1 !== this.road.vertices.length) {
            const a = this.road.vertices[n+1].clone().sub(pos).normalize();
            rotation.y = Math.atan2(a.z, -a.x);
        }

        this.mesh.position.copy(pos);
        this.mesh.rotation.y = rotation.y;
    }

    finishCourse() {
        this.gw.threeScene.remove(this.mesh);
        this.city.addTrain();

        const city2 =
            this.road.cities.filter(value => value.name !== this.city.UUID)[0];

        city2.receiveTrain({
            velocity: this.velocity,
            carrying: this.carrying,
            capacity: this.capacity,
            suply: this.suply
        });
    }
}