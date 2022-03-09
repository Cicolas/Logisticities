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

interface Cell {
    position: position;
    distFromStart: number;
    distFromEnd: number;
    value: number;
    got: boolean;
    able: boolean;
    history: position[];
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

    private pathFindCells:  Cell[][] = [];

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

        const cc1Pos = new THREE.Vector2().copy(cc1.coordinates);
        const cc2Pos = new THREE.Vector2().copy(cc2.coordinates);
        // console.log(this.cities);
        // this.distance = this.calculateDistance(cc1.mesh.position, cc2.mesh.position);
        // this.calculateLine(cc1.mesh.position, cc2.mesh.position);
        this.generateCells(this.plane.grid, cc1Pos, cc2Pos);
        this.calculateRoute(this.plane.grid, cc1Pos, cc2Pos, 10000);

        const geometry = new THREE.BufferGeometry().setFromPoints(this.points);

        this.line = new THREE.Line(geometry, material);
        gameWin.threeScene.add(this.line);
    }

    update(obj: GObject, gameWin: GameWindow) {}
    draw (context?: THREE.Scene) {};

    calculateDistance(cityPos1: THREE.Vector3, cityPos2: THREE.Vector3) {
        return cityPos1.distanceTo(cityPos2);
    }

    calculateRoute(grid: Vertex[][], startPos: position, finalPos: THREE.Vector2, bestFind: number) {
        // this.points.push(grid[linePos.x][linePos.y].position);
        const vecPos = new THREE.Vector3().copy(grid[startPos.x][startPos.y].position);
        vecPos.y += .5;
        this.points.push(vecPos);

        var cell = this.pathFindCells[startPos.x][startPos.y]
        cell.got = true;
        var bestCell: Cell = {
            distFromStart: 0, distFromEnd: 0,
            position: undefined,
            value: 1000000,
            got: false,
            able: false,
            history: []
        };

        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                if (!(i == 0 && j == 0)) {
                    const c = this.discoverCell(
                        new THREE.Vector2(startPos.x+i, startPos.y+j),
                        new THREE.Vector2(startPos.x, startPos.y),
                        new THREE.Vector2(finalPos.x, finalPos.y),
                        cell.value
                    );
                    // console.log([startPos.x+i, startPos.y+j, c.distFromStart, c.distFromEnd]);

                    if (c.value < bestCell.value && c.able && !c.got) {
                        bestCell.value = c.value;
                        bestCell = c;
                    }
                }
            }
        }
        cell = bestCell;
        console.log(cell);

        if (cell.distFromEnd === 0) {
            const vecPos = new THREE.Vector3().copy(grid[finalPos.x][finalPos.y].position);
            vecPos.y += .5;
            this.points.push(vecPos);
            return;
        }else if(cell.value > bestFind) {
            return cell.value;
        }else{
            const n = this.calculateRoute(grid, cell.position, finalPos, 10000);
        }
        // console.log(linePos);
        // this.calculateRoute(grid, linePos, destiny);
    }

    discoverCell(cellPos: THREE.Vector2, startPos: THREE.Vector2, finalPos: THREE.Vector2, currentVal: number): Cell {
        const distS = startPos.distanceTo(cellPos)+currentVal;
        const distF = finalPos.distanceTo(cellPos);

        const cell = this.pathFindCells[cellPos.x][cellPos.y]
        cell.distFromStart = distS;
        cell.distFromEnd = distF;
        cell.value = distS+distF;

        return cell;
    }

    generateCells(grid: Vertex[][], startPos: THREE.Vector2, finalPos: THREE.Vector2) {
        for (let i = 0; i < grid.length; i++) {
            this.pathFindCells[i] = [];
            for (let j = 0; j < grid.length; j++) {
                // const pos = new THREE.Vector2(i, j);
                // const startP = startPos.distanceTo(pos);
                // const finalP = finalPos.distanceTo(pos);
                this.pathFindCells[i][j] = {
                    position: {x: i, y: j},
                    distFromStart: 0,
                    distFromEnd: 0,
                    value: 0,
                    got: false,
                    able: grid[i][j].apropiated,
                    history: []
                } as Cell;
            }
        }
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