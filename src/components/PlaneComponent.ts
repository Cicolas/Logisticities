import * as THREE from 'three';
import { BufferGeometry, Color } from "three";
import ComponentInterface from "../lib/CUASAR/Component";
import GameWindow from "../lib/CUASAR/GameWindow";
import GObject from "../lib/CUASAR/GObject";
const perlin = require('../lib/perlin').noise;

export interface PlaneInterface {
    seed: number;
    width: number;
    height: number;
    depth: number;
    perlinScale1: number;
    perlinScale2: number;
    perlinPower1: number;
    perlinPower2: number;
}

export default class PlaneComponent implements ComponentInterface {
    name: string = "PlaneComponent";
    public mesh: THREE.Mesh;

    private seed: number;
    private width: number;
    private height: number;
    private depth: number;
    private perlinScale1: number;
    private perlinScale2: number;
    private perlinPower1: number;
    private perlinPower2: number;

    constructor(planeI: PlaneInterface){
        this.seed = planeI.seed;
        this.width = planeI.width;
        this.height = planeI.height;
        this.depth = planeI.depth;
        this.perlinScale1 = planeI.perlinScale1;
        this.perlinScale2 = planeI.perlinScale2;
        this.perlinPower1 = planeI.perlinPower1;
        this.perlinPower2 = planeI.perlinPower2;
    }

    init() {
        const m1 = this.generatePerlin(0, 0, this.perlinScale1, this.seed);
        const m2 = this.generatePerlin(0, 0, this.perlinScale2, this.seed+10);

        let m3 = [];

        for (let x = 0; x < this.width; x++) {
            m3[x] = [];
            for (let z = 0; z < this.depth; z++) {
                m1[x][z] **= this.perlinPower1;
                m2[x][z] **= this.perlinPower2;
                m3[x][z] = m2[x][z]*m1[x][z];

                m1[x][z] *= this.height;
                m2[x][z] *= this.height;
                m3[x][z] *= this.height;
            }
        }

        const geometry = this.RectangleGeometry(m3);
        const material = new THREE.MeshStandardMaterial({ color: 0x3b9126 });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = "plano";
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }

    update(obj: GObject, gameWin: GameWindow) {
        this.mesh.rotation.y += 0.01;
        (this.mesh.material as THREE.MeshStandardMaterial).color = new Color(0x3b9126);
    }

    draw (context?: THREE.Scene) {
        context.add(this.mesh);
    };


    RectangleGeometry(map: number[][]): BufferGeometry {
        const geometry = new THREE.BufferGeometry();

        const vert = this.width*this.depth;
        const size = ((this.width-1) * (this.depth-1))*6*3;
        const vertices = new Float32Array(size);

        let verticesArr = [];

        for (let x = 0; x < map.length-1; x++) {
            for (let z = 0; z < map[x].length-1; z++) {
                verticesArr.push(
                    x+1, map[z+1][x+1], z+1,
                    x+1, map[z][x+1],   z,
                    x,   map[z][x],     z,

                    x,   map[z+1][x],   z+1,
                    x+1, map[z+1][x+1], z+1,
                    x,   map[z][x],     z
                )
            }
        }

        vertices.set(verticesArr);
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.computeVertexNormals();
        geometry.translate(-this.width/2, 0, -this.depth/2);

        return geometry;
    }

    generatePerlin(offsetx: number = 0, offsety: number = 0, scale: number = 1, seed: number = 0): number[][] {
        perlin.seed(seed);

        const m = []

        for (let x = 0; x < this.width; x++) {
            m[x] = [];
            for (let z = 0; z < this.depth; z++) {
                // m[x][z] = (perlin.simplex2(x/scale+offsetx, z/scale+offsety)+1)/2;
                m[x][z] = (perlin.perlin2(x/scale+offsetx, z/scale+offsety)+1)/2;
            }
        }

        return m;
    }
}