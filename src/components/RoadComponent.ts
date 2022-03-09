import { log } from 'console';
import { randomUUID } from 'crypto';
import * as THREE from 'three';
import { BufferGeometry, Color } from "three";
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import CityComponent from './CityComponent';
import PlaneComponent, { Vertex } from './PlaneComponent';

const LINE_DEFINITION = 1;

export default class RoadComponent implements ComponentInterface {
    name: string = "RoadComponent";
    public points: THREE.Vector3[];
    public line;

    public cities: [GObject, GObject] = [null, null];
    public distance: number;
    private plane: PlaneComponent;
    private fromName: string;
    private toName: string;
    private definition: number;

    // constructor(from: GObject, to: GObject, definition: number){
    //     this.points = [];
    //     this.cities[0] = from;
    //     this.cities[1] = to;
    //     this.definition = definition;
    // }
    constructor(from: string, to: string, definition: number){
        this.points = [];
        this.fromName = from;
        this.toName = to;
        this.definition = definition;
    }

    init(gameWin: GameController) {
        this.plane = gameWin.getScene().getObject("plano").getComponent(PlaneComponent) as PlaneComponent;

        this.cities[0] = gameWin.getScene().getObject(this.fromName);
        this.cities[1] = gameWin.getScene().getObject(this.toName);

        setTimeout(this.postInit.bind(this), 20, gameWin);
    }

    postInit(gameWin: GameController) {
        const material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linejoin: "bevel",
        })

        const cc1 = this.cities[0].getComponent(CityComponent) as CityComponent;
        const cc2 = this.cities[1].getComponent(CityComponent) as CityComponent;

        console.log(this.cities);
        // this.distance = this.calculateDistance(cc1.mesh.position, cc2.mesh.position);
        // this.calculateLine(cc1.mesh.position, cc2.mesh.position);
        this.calculateRoute(this.plane.grid, new THREE.Vector2().copy(cc1.coordinates), new THREE.Vector2().copy(cc2.coordinates));

        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(geometry, material);
        gameWin.threeScene.add(this.line);
    }

    calculateLine(cityPos1: THREE.Vector3, cityPos2: THREE.Vector3) {
        const definition = LINE_DEFINITION*((this.definition/(8*5))**1/2)*(this.distance/Math.SQRT2)*2;
        // console.log(definition);

        this.points.push(cityPos1);
        for (let i = 1; i <= Math.floor(definition); i++) {
            const step = definition/i;
            const x = (cityPos2.x - cityPos1.x)/step+cityPos1.x;
            const z = (cityPos2.z - cityPos1.z)/step+cityPos1.z;

            const pos = this.plane.getPositionByCoordinates(
                new THREE.Vector2(x, z)
            );

            // const pos = this.plane.getGridByCoordinates(
            //     new THREE.Vector2(x, z)
            // )

            pos.y += .5;
            this.points.push(pos);
        }
        this.points.push(cityPos2);
    }

    calculateDistance(cityPos1: THREE.Vector3, cityPos2: THREE.Vector3) {
        return cityPos1.distanceTo(cityPos2);
    }

    calculateRoute(grid: Vertex[][], linePos: THREE.Vector2, destiny: THREE.Vector2) {
        // this.points.push(grid[linePos.x][linePos.y].position);
        const vecPos = new THREE.Vector3().copy(grid[linePos.x][linePos.y].position);
        vecPos.y += .5;
        this.points.push(vecPos);

        if (linePos.y < destiny.y) {
            linePos.y++;
        }else if(linePos.y > destiny.y){
            linePos.y--;
        }else if(linePos.x < destiny.x){
            linePos.x++;
        }else if(linePos.x > destiny.x){
            linePos.x--;
        }else{
            return;
        }

        // console.log(linePos);
        this.calculateRoute(grid, linePos, destiny);
    }

    update(obj: GObject, gameWin: GameWindow) {}
    draw (context?: THREE.Scene) {};
}