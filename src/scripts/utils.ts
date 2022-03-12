export interface Vertex {
    position: THREE.Vector3;
    normal: THREE.Vector3;
    apropiated?: boolean;
}

export interface color {
    r: number,
    g: number,
    b: number
}

export interface position {
    x:number,
    y:number
}

export interface cameraQuad {
    left: number,
    right: number,
    top: number,
    bottom: number,
}