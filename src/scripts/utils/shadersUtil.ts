import * as THREE from "three";

export interface ShaderUniformInterface {
    "time": { value: number };
    "resolution": { value: THREE.Vector2 };
    "color": { value: THREE.Vector3 };
    "directionalLightColor": { value: THREE.Vector3 };
    "directionalLightDirection": { value: THREE.Vector3 };
    "directionalLightIntensity": { value: number };
    "ambientLightColor": { value: THREE.Vector3 };
    "ambientLightIntensity": { value: number };
    "pointLightColors": { type: "fv"; value: [] };
    "pointLightPosition": { type: "fv"; value: [] };
    "pointLightIntensity": { type: "v4v"; value: [] };
    "fogColor": { value: THREE.Vector3 };
    "fog": { value: THREE.Vector3 };
    "fogNear": { value: number };
    "fogFar": { value: number };
}

export const DefaultUniformsTable: ShaderUniformInterface = {
    time: { value: 0 },
    resolution: { value: new THREE.Vector2() },
    color: { value: new THREE.Vector3(1, 1, 1) },
    directionalLightColor: { value: new THREE.Vector3(1, 1, 1) },
    directionalLightDirection: { value: new THREE.Vector3(0, 1, 0) },
    directionalLightIntensity: { value: 0.7 },
    ambientLightColor: {
        value: new THREE.Vector3(1, 1, 1),
    },
    ambientLightIntensity: { value: 0.3 },
    pointLightColors: { type: "fv", value: [] },
    pointLightPosition: { type: "fv", value: [] },
    pointLightIntensity: { type: "v4v", value: [] },
    fogColor: { value: new THREE.Vector3() },
    fog: { value: new THREE.Vector3() },
    fogNear: { value: 0 },
    fogFar: { value: 0 },
};