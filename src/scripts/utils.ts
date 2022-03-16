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

export function getInRandomList<T>(list: [T, boolean][]): [T, boolean] {
    var s;
    do{
        s = list[Math.floor(Math.random()*1000)%list.length];
    }while(s[1])

    return s;
}