import { randomUUID } from 'crypto';
import * as THREE from 'three';
import { BufferGeometry, Color } from "three";
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import CityComponent from './CityComponent';
import PlaneComponent, { Vertex } from './PlaneComponent';
import jsAstar from 'javascript-astar';

const LINE_DEFINITION = 1;
const DEFAULT_CELL = {
    distFromStart: -1, distFromEnd: -1,
    position: undefined,
    value: 1000000,
    got: false,
    able: false,
    history: []
};

interface Cell {
    position: position;
    distFromStart: number;
    distFromEnd: number;
    value: number;
    got: boolean;
    able: boolean;
    history: Cell[];
}

interface position {x:number, y:number}


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

    private pathFindCells:  number[][] = [];
    private finalPath: position[] = [];

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

        const material = new THREE.LineBasicMaterial({
            color: 0x000000,
            linejoin: "bevel",
        })

        const cc1 = this.cities[0].getComponent(CityComponent) as CityComponent;
        const cc2 = this.cities[1].getComponent(CityComponent) as CityComponent;

        const cc1Pos = new THREE.Vector2().copy(cc1.coordinates);
        const cc2Pos = new THREE.Vector2().copy(cc2.coordinates);

        this.generateCells(this.plane.grid);
        this.calculateRoute(this.plane.grid, cc1Pos, cc2Pos);
        // this.drawRoute(cc2Pos);

        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(geometry, material);
        gameWin.threeScene.add(this.line);

        setTimeout(this.postInit.bind(this), 20, gameWin);
    }

    postInit(gameWin: GameController) {
    }

    update(obj: GObject, gameWin: GameWindow) {
    }
    draw (context?: THREE.Scene) {};

    calculateDistance(cityPos1: THREE.Vector3, cityPos2: THREE.Vector3) {
        return cityPos1.distanceTo(cityPos2);
    }

    calculateRoute(grid: Vertex[][], startPos: position, finalPos: position) {
        const graph = new jsAstar.Graph(this.pathFindCells, { diagonal: true });
        const start = graph.grid[startPos.x][startPos.y];
        const end = graph.grid[finalPos.x][finalPos.y];

        this.finalPath = jsAstar.astar.search(graph, start, end)

        const s = grid[startPos.x][startPos.y].position.clone();
        s.y += .5
        this.points.push(s);
        for (let i = 0; i < this.finalPath.length; i++) {
            const element = this.finalPath[i];

            const pos = grid[element.x][element.y].position.clone();
            pos.y += .5
            this.points.push(pos);
        }
    }

    generateCells(grid: Vertex[][]) {
        for (let i = 0; i < grid.length; i++) {
            this.pathFindCells[i] = [];
            for (let j = 0; j < grid.length; j++) {
                this.pathFindCells[i][j] = grid[i][j].apropiated?1:0;
            }
        }
        // console.log(this.pathFindCells);
    }
}

// calculateLine(cityPos1: THREE.Vector3, cityPos2: THREE.Vector3) {
//     const definition = LINE_DEFINITION*((this.definition/(8*5))**1/2)*(this.distance/Math.SQRT2)*2;
//     // console.log(definition);

//     this.points.push(cityPos1);
//     for (let i = 1; i <= Math.floor(definition); i++) {
//         const step = definition/i;
//         const x = (cityPos2.x - cityPos1.x)/step+cityPos1.x;
//         const z = (cityPos2.z - cityPos1.z)/step+cityPos1.z;

//         const pos = this.plane.getPositionByCoordinates(
//             new THREE.Vector2(x, z)
//         );

//         // const pos = this.plane.getGridByCoordinates(
//         //     new THREE.Vector2(x, z)
//         // )

//         pos.y += .5;
//         this.points.push(pos);
//     }
//     this.points.push(cityPos2);
// }