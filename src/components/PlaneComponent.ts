import * as THREE from 'three';
import { BufferGeometry, Color, TextureLoader, Vector2, Vector3 } from "three";
import { DEBUG_INFO } from '../enviroment';
import GameController from '../GameController';
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
import { color, InverseLerp, position, Vertex } from '../scripts/utils/utils';
import util from 'util';
const perlin = require('../lib/perlin').noise;

const FALLOUT = {
    min: .1,
    max: .9
};
const MAX_STEPNESS = 15;

export interface colorMap {
    sand: color,
    grass: color,
    rock: color,
    snow: color,
}

export interface PlaneInterface {
    seed: number;
    width: number;
    height: number;
    depth: number;
    perlinScale1: number;
    perlinScale2: number;
    perlinPower1: number;
    perlinPower2: number;
    gridDefinition: number;
    color: colorMap
    seaLevel: number;
}

export default class PlaneComponent implements ComponentInterface {
    name: string = "PlaneComponent";
    public mesh: THREE.Mesh;
    private geometry: THREE.BufferGeometry;
    private material: THREE.Material;

    public width: number;
    public height: number;
    public depth: number;
    private seed: number;
    private perlinScale1: number;
    private perlinScale2: number;
    private perlinPower1: number;
    private perlinPower2: number;
    private colors: colorMap;

    private gw: GameController;

    private map: number[][] = [];
    private vertexMap: Vertex[][] = [];
    public grid: Vertex[][] = [];
    private gridDefinition: number;
    private seaLevel: number;

    constructor(planeI: PlaneInterface) {
        this.seed = Math.floor(planeI.seed);
        this.width = planeI.width;
        this.height = planeI.height;
        this.depth = planeI.depth;
        this.perlinScale1 = planeI.perlinScale1;
        this.perlinScale2 = planeI.perlinScale2;
        this.perlinPower1 = planeI.perlinPower1;
        this.perlinPower2 = planeI.perlinPower2;
        this.gridDefinition = planeI.gridDefinition;
        this.colors = planeI.color;
        this.seaLevel = planeI.seaLevel;
    }

    init(gameWin: GameController) {
        this.gw = gameWin;
        console.log("seed: " + this.seed);

        const m1 = this.generatePerlin(0, 0, this.perlinScale1, this.seed);
        const m2 = this.generatePerlin(0, 0, this.perlinScale2, this.seed+10);
        const fallout = this.createFallout(FALLOUT.min, FALLOUT.max);

        var highestPeak = 0;

        for (let x = 0; x < this.width; x++) {
            this.map[x] = [];
            for (let z = 0; z < this.depth; z++) {
                m1[x][z] **= this.perlinPower1;
                m2[x][z] **= this.perlinPower2;
                this.map[x][z] = m2[x][z] * m1[x][z];

                m1[x][z] *= this.height;
                m2[x][z] *= this.height;
                this.map[x][z] *= DEBUG_INFO.noMask?1:fallout[x][z];
                this.map[x][z] *= this.height;
                this.map[x][z] -= this.seaLevel;

                if (this.map[x][z] > highestPeak) {
                    highestPeak = this.map[x][z];
                }
            }
        }

        // console.log(this.map);
        this.geometry = this.rectangleGeometry(this.map, highestPeak);

        const shadow = this.geometry;
        const shadowMat = new THREE.MeshLambertMaterial({
            depthFunc: THREE.EqualDepth,
            transparent: true,
            blending: THREE.MultiplyBlending,
            // shininess: 0,
            // reflectivity: 0
        });
        const shadowMesh = new THREE.Mesh(shadow, shadowMat);
        shadowMesh.name = "shadow";

        this.mesh = new THREE.Mesh(this.geometry);
        this.mesh.name = "plano";

        gameWin.threeScene.add(this.mesh);
        gameWin.threeScene.add(shadowMesh);

        this.generateGrid();
        this.optimizeGrid();
        this.optimizeGrid();
        if (DEBUG_INFO.showGrid) {
            this.drawGrid();
        }

        this.mesh.material = new THREE.MeshBasicMaterial({
            vertexColors: true,
            wireframe: DEBUG_INFO.showWireframe,
        });
        this.mesh.geometry = this.setColor(this.map, this.geometry, highestPeak);

        // this.setColor(this.grid);
        // this.mesh.geometry = this.geometry;
        // console.log(this.grid);
    }

    update(obj: GObject, gameWin: GameWindow) {
        // this.mesh.rotation.y += 0.01;
        // (this.mesh.material as THREE.MeshStandardMaterial).color = new Color(0x3b9126);
    }

    draw(context?: THREE.Scene) {}

    rectangleGeometry(map: number[][], highestPeak: number): BufferGeometry {
        const geometry = new THREE.BufferGeometry();

        const size = (this.width - 1) * (this.depth - 1) * 6 * 3;
        const vertices = new Float32Array(size);

        let verticesArr = [];

        for (let x = 0; x < map.length - 1; x++) {
            for (let z = 0; z < map[x].length - 1; z++) {
                verticesArr.push(
                    x+1-(this.width/2), map[z+1][x+1], z+1-(this.depth/2),
                    x+1-(this.width/2), map[z][x+1],   z-(this.depth/2),
                    x-(this.width/2),   map[z][x],     z-(this.depth/2),

                    x-(this.width/2),   map[z+1][x],   z+1-(this.depth/2),
                    x+1-(this.width/2), map[z+1][x+1], z+1-(this.depth/2),
                    x-(this.width/2),   map[z][x],     z-(this.depth/2)
                );
            }
        }

        vertices.set(verticesArr);
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();

        return geometry;
    }

    generatePerlin(
        offsetx: number = 0,
        offsety: number = 0,
        scale: number = 1,
        seed: number = 0
    ): number[][] {
        perlin.seed(seed);

        const m = [];

        for (let x = 0; x < this.width; x++) {
            m[x] = [];
            for (let z = 0; z < this.depth; z++) {
                // m[x][z] = (perlin.simplex2(x/scale+offsetx, z/scale+offsety)+1)/2;
                m[x][z] = DEBUG_INFO.map.planify
                    ? (DEBUG_INFO.noMask?0:.9)
                    : (perlin.perlin2(
                          x / scale + offsetx,
                          z / scale + offsety
                      ) +
                          1) /
                      2;
            }
        }

        return m;
    }

    //* Doesn't work well for non integer coords
    getPositionByCoordinates(coord: position): THREE.Vector3 {
        var posVec = new THREE.Vector3();
        posVec.x = Math.round(coord.x);
        posVec.z = Math.round(coord.y);

        const y =
            this.map[Math.round(coord.y + this.depth / 2)][
                Math.round(coord.x + this.width / 2)
            ];
        posVec.y = y;

        return posVec;
    }
    //TODO: reimplement like in wasm branch
    getVertexByCoordinates(coord: position): Vertex {
        //caches every vertex into this.vertexMap
        if (this.vertexMap.length <= 0) {
            for (let x = 0; x < this.width; x++) {
                this.vertexMap[x] = [];
                for (let z = 0; z < this.depth; z++) {
                    let posVec = new THREE.Vector3();
                    let normVec = new THREE.Vector3();

                    const ray = new THREE.Raycaster();
                    const rx = x+.5-this.width/2;
                    const rz = z+.5-this.depth/2;

                    ray.set(
                        new THREE.Vector3(rx, this.height * 10, rz),
                        new THREE.Vector3(0, -1, 0)
                    );

                    const intersect = ray.intersectObject(this.mesh)[0];
                    if (intersect) {
                        posVec = intersect.point;
                        normVec = intersect.face.normal;
                    }

                    const v: Vertex = { position: posVec, normal: normVec };
                    v.apropiated = this.checkStepness(v);

                    this.vertexMap[x][z] = v;
                }
            }
        }
        const ix = Math.round(coord.x+this.width/2);
        const iz = Math.round(coord.y+this.depth/2);

        return this.vertexMap[ix===this.width?this.width-1:ix][iz===this.depth?this.depth-1:iz];
    }
    getGridByCoordinates(coord: position): THREE.Vector3 {
        var posVec = new THREE.Vector3();
        posVec.x =
            (coord.x / (this.width / 2 - 0.5)) * (this.gridDefinition / 2);
        posVec.y =
            (coord.y / (this.depth / 2 - 0.5)) * (this.gridDefinition / 2);

        posVec.x = Math.round(posVec.x) + 10;
        posVec.y = Math.round(posVec.y) + 10;

        console.log(this.grid[posVec.x][posVec.y].position);

        return this.grid[posVec.x][posVec.y].position;
    }

    generateGrid() {
        for (let i = 0; i <= this.gridDefinition; i++) {
            this.grid[i] = [];
            for (let j = 0; j <= this.gridDefinition; j++) {
                const p = {x: 0, y: 0};
                p.x = ((i/(this.gridDefinition))*2-1)*(this.width/2);
                p.y = ((j/(this.gridDefinition))*2-1)*(this.depth/2);

                p.x = Math.round(p.x);
                p.y = Math.round(p.y);

                if (DEBUG_INFO.map.fastLoad)
                    this.grid[i][j] = {position: this.getPositionByCoordinates(p), normal: new THREE.Vector3(0, 1, 0), apropiated: true};
                else
                    this.grid[i][j] = this.getVertexByCoordinates(p);
            }
        }
    }
    // TODO: check areas that is inaccessible
    optimizeGrid() {
        for (let i = 1; i < this.gridDefinition - 1; i++) {
            for (let j = 1; j < this.gridDefinition - 1; j++) {
                var neighborhood = 0;
                for (let k = 0; k < 9; k++) {
                    const x = i - ((k % 3) - 1);
                    const y = j - (Math.floor(k / 3) - 1);
                    const v = this.grid[x][y];

                    if (!v.apropiated) {
                        neighborhood++;
                    }
                }

                if (neighborhood <= 3) {
                    this.grid[i][j].apropiated = true;
                } else if (neighborhood >= 6) {
                    this.grid[i][j].apropiated = false;
                }
                if (this.grid[i][j].position.y < 0) {
                    this.grid[i][j].apropiated = false;
                }
            }
        }

        for (let i = 0; i < this.gridDefinition; i++) {
            this.grid[0][i].apropiated = false;
            this.grid[i][0].apropiated = false;
            this.grid[this.gridDefinition - 1][i].apropiated = false;
            this.grid[i][this.gridDefinition - 1].apropiated = false;
        }
    }
    drawGrid() {
        for (let i = 0; i < this.gridDefinition; i++) {
            for (let j = 0; j < this.gridDefinition; j++) {
                const g = this.grid[i][j];
                const geometry = new THREE.SphereGeometry(0.25);
                const material = new THREE.MeshStandardMaterial({
                    color: g.apropiated ? "green" : "red",
                });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.x = g.position.x;
                mesh.position.y = g.position.y;
                mesh.position.z = g.position.z;
                this.gw.threeScene.add(mesh);
            }
        }
    }

    checkStepness(vertex: Vertex) {
        const rotation = new THREE.Vector2();
        rotation.x = -Math.atan2(vertex.normal.y, vertex.normal.z);
        rotation.y =
            (1 / 2) * Math.PI - Math.atan2(vertex.normal.y, vertex.normal.x);

        if (
            Math.abs((rotation.x * 180) / Math.PI + 90) > MAX_STEPNESS ||
            Math.abs((rotation.y * 180) / Math.PI) > MAX_STEPNESS
        ) {
            return false;
        }

        return true;
    }

    setColor(map: number[][], geo: THREE.BufferGeometry, highestPeak: number) {
        const size = (this.width - 1) * (this.depth - 1) * 6 * 3;
        const colors = new Float32Array(size);
        let colorArr = [];

        let allVertex;

        const f = (i, j) => {
            return {
                x: i - this.width / 2,
                y: j - this.height / 2,
            };
        };

        for (let x = 0; x < map.length - 1; x++) {
            for (let z = 0; z < map[x].length - 1; z++) {
                const pos = [
                    f(x + 1, z + 1),
                    f(x + 1, z),
                    f(x, z),
                    f(x, z + 1),
                ].map((value) => {
                    return new THREE.Vector2(value.x, value.y);
                });

                const colors = [
                    this.getColor(
                        this.getVertexByCoordinates(pos[0]),
                        map[z + 1][x + 1],
                        highestPeak
                    ),
                    this.getColor(
                        this.getVertexByCoordinates(pos[1]),
                        map[z][x + 1],
                        highestPeak
                    ),
                    this.getColor(
                        this.getVertexByCoordinates(pos[2]),
                        map[z][x],
                        highestPeak
                    ),
                    this.getColor(
                        this.getVertexByCoordinates(pos[3]),
                        map[z + 1][x],
                        highestPeak
                    ),
                ];

                if (DEBUG_INFO.showWireframe) {
                    colorArr.push(
                        map[z + 1][x + 1], map[z + 1][x + 1], map[z + 1][x + 1],
                        map[z][x + 1], map[z][x + 1], map[z][x + 1],
                        map[z][x], map[z][x], map[z][x],

                        map[z + 1][x], map[z + 1][x], map[z + 1][x],
                        map[z + 1][x + 1], map[z + 1][x + 1], map[z + 1][x + 1],
                        map[z][x], map[z][x], map[z][x]
                    );
                } else {
                    colorArr.push(
                        colors[0].r, colors[0].g, colors[0].b,
                        colors[0].r, colors[0].g, colors[0].b,
                        colors[0].r, colors[0].g, colors[0].b,

                        colors[0].r, colors[0].g, colors[0].b,
                        colors[0].r, colors[0].g, colors[0].b,
                        colors[0].r, colors[0].g, colors[0].b

                        // colors[0].r, colors[0].g, colors[0].b,
                        // colors[1].r, colors[1].g, colors[1].b,
                        // colors[2].r, colors[2].g, colors[2].b,

                        // colors[3].r, colors[3].g, colors[3].b,
                        // colors[0].r, colors[0].g, colors[0].b,
                        // colors[2].r, colors[2].g, colors[2].b,
                    );
                }
            }
        }

        colors.set(colorArr);
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geo.computeVertexNormals();
        return geo;
    }

    getColor(vert: Vertex, height: number, highestPeak: number): color {
        const actualHeight = (height*highestPeak);
        if (actualHeight < this.height/80) return this.colors.sand;

        if (!DEBUG_INFO.map.altitudeColor) {
            if (actualHeight > this.height) return this.colors.snow;
            if (vert.apropiated) return this.colors.grass;
            return this.colors.rock;
        }

        if (actualHeight < this.height/4) return this.colors.grass;
        if (actualHeight < this.height) return this.colors.rock;
        return this.colors.snow;
    }

    createFallout(falloutStart: number, falloutEnd: number) {
        const falloutMap: number[][] = [];

        for (let x = 0; x < this.width; x++) {
            falloutMap[x] = [];
            for (let z = 0; z < this.depth; z++) {
                const _x = (x-(this.width/2-.5))/(this.width/2-.5);
                const _y = (z-(this.depth/2-.5))/(this.depth/2-.5);

                const pos = new THREE.Vector2(_x, _y);
                const f = pos.length();

                // const f = Math.max(Math.abs(_x), Math.abs(_y));

                if (f < falloutStart) {
                    falloutMap[x][z] = 1;
                }else if(f > falloutEnd){
                    falloutMap[x][z] = 0;
                }else {
                    falloutMap[x][z] = Math.abs(InverseLerp(falloutStart, falloutEnd, f)-1);
                }
            }
        }

        return falloutMap;
    }
}