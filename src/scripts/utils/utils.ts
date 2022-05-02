import * as THREE from "three";

export interface Vertex {
    position: position3D;
    normal: position3D;
    apropiated?: boolean;
}

export interface color {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface position {
    x: number;
    y: number;
}

export interface position3D extends position {
    z: number;
}

export interface cameraQuad {
    left: number;
    right: number;
    top: number;
    bottom: number;
}

export function getInRandomList<T>(list: [T, boolean][]): [T, boolean] {
    var s;
    do {
        s = list[Math.floor(Math.random() * 1000) % list.length];
    } while (s[1]);

    return s;
}

export function Clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export function InverseLerp(min, max, num) {
    return Clamp((num - min) / (max - min), 0, 1);
}

export function pullToTop<T>(arr: T[], i: number) {
    const item = arr.splice(i, 1)[0];

    arr.unshift(item);
}

export function pushToBottom<T>(arr: T[]) {
    const item = arr.shift();

    arr.push(item);
}

export function formatNumber(number: number, minDec: number, maxDec: number) {
    return number.toLocaleString(undefined, {
        minimumFractionDigits: minDec,
        maximumFractionDigits: maxDec,
    });
}

export function P3DtoVEC3(position) {
    return new THREE.Vector3(position.x, position.y, position.z);
}