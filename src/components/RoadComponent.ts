import { randomUUID } from 'crypto';
import * as THREE from 'three';
import { BufferGeometry, Color, Vector2, Vector3 } from "three";
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import CityComponent from './CityComponent';
import PlaneComponent, { Vertex } from './PlaneComponent';
import jsAstar from 'javascript-astar';
import { DEBUG_INFO } from '../enviroment';

const LINE_DEFINITION = 10;

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
    public vertices: THREE.Vector3[];
    public line;

    public cities: [GObject, GObject] = [null, null];
    public distance: number;
    private plane: PlaneComponent;
    private fromName: string;
    private toName: string;
    private definition: number;

    private pathFindCells:  number[][] = [];
    private finalPath: position[] = [];
    private points: THREE.Vector3[] = [];

    // constructor(from: GObject, to: GObject, definition: number){
    //     this.points = [];
    //     this.cities[0] = from;
    //     this.cities[1] = to;
    //     this.definition = definition;
    // }
    constructor(from: string, to: string, definition: number){
        this.vertices = [];
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
        this.smoothRoute(this.plane.grid);
        // this.drawRoute(cc2Pos);

        const geometry = new THREE.BufferGeometry().setFromPoints(this.vertices);

        this.line = new THREE.Line(geometry, material);
        gameWin.threeScene.add(this.line);

        if (DEBUG_INFO.showRoadGuides) {
            const planeMat = new THREE.LineBasicMaterial({
                color: 0xff0000,
                linejoin: "bevel",
            })
            const planeGeo = new THREE.BufferGeometry().setFromPoints(this.points);
            const planeLine = new THREE.Line(planeGeo, planeMat);
            gameWin.threeScene.add(planeLine);
        }

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

    smoothRoute(grid: Vertex[][]){
        for (let i = 0; i < this.points.length; i++) {
            const pi = this.points[i];
            // const pc = new THREE.Vector3();
            const pc = this.points[i+1];
            const pc2 = this.points[i+2];
            const pf = this.points[i+3];
            // console.log(pi, pc, pf);

            if (i+3 < this.points.length) {
                const curveSize = this.isCurve(
                    {x: pi.x, y: pi.z},
                    {x: pc.x, y: pc.z},
                    {x: pc2.x, y: pc2.z},
                    {x: pf.x, y: pf.z}
                );

                if (curveSize === 1) {
                    console.log("1: ", i);
                    for (let t = 0; t < LINE_DEFINITION; t++) {
                        const time = t/(LINE_DEFINITION-1);

                        var n1 = pi.clone().multiplyScalar((1-time)**2);
                        var n2 = pc.clone().multiplyScalar(time*(2*(1-time)));
                        var n3 = pc2.clone().multiplyScalar(time**2);

                        var p = n1.add(n2).add(n3);
                        this.vertices.push(p);
                    }
                    i++;
                }else if(curveSize === 2) {
                    console.log("2: ", i);
                    for (let t = 0; t < LINE_DEFINITION; t++) {
                        const time = t/(LINE_DEFINITION-1);

                        var n1 = pi.clone().multiplyScalar((1-time)**3);
                        var n2 = pc.clone().multiplyScalar(3*((1-time)**2)*time);
                        var n3 = pc2.clone().multiplyScalar(3*(1-time)*(time**2));
                        var n4 = pf.clone().multiplyScalar(time**3);

                        var p = n1.add(n2).add(n3).add(n4);
                        this.vertices.push(p);
                    }
                    i+=2;
                }else {
                    this.vertices.push(pi.clone());
                }
            }else {
                this.vertices.push(pi.clone());
            }
        }
        // console.log(this.vertices);
    }

    isCurve(pos1: position, pos2: position, pos3: position, pos4: position) {
        const n = {x: 0, y: 0};
        n.x = pos1.x-pos2.x;
        n.y = pos1.y-pos2.y;

        const n2 = {x: 0, y: 0};
        n2.x = pos2.x-pos3.x;
        n2.y = pos2.y-pos3.y;

        const n3 = {x: 0, y: 0};
        n3.x = pos3.x-pos4.x;
        n3.y = pos3.y-pos4.y;

        // console.log(n, n2, n3);

        if ((n.x !== n2.x || n.y !== n2.y) &&
            (n2.x === n3.x && n2.y === n3.y)) {
            return 1;
        }
        if ((n.x !== n2.x || n.y !== n2.y) &&
            (n2.x !== n3.x || n2.y !== n3.y)) {
            return 2;
        }

        return 0;
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