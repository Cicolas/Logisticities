import * as THREE from 'three';
import vertShader from "../shaders/default.vert";
import fragShader from "../shaders/default.frag";
import { DefaultUniformsTable, ShaderUniformInterface } from '../../scripts/utils/shadersUtil';

export default class DefaultMaterial{
    public material: THREE.ShaderMaterial;
    public uniformsTable: ShaderUniformInterface =
    {
        "time": { value: 1.0 },
        "resolution": {value: new THREE.Vector2()},
        "color": {value: new THREE.Vector3(1, .2, 1)},
        "directionalLightColor": {value: new THREE.Vector3(1, 1, 1)},
        "directionalLightDirection": {value: new THREE.Vector3(0, 1, 0)},
        "directionalLightIntensity": {value: .7},
        "ambientLightColor": {value: new THREE.Vector3(171/255, 220/255, 255/255)},
        "ambientLightIntensity": {value: .3},
        "pointLightColors": {type: 'fv', value: []},
        "pointLightPosition": {type: 'fv', value: []},
        "pointLightIntensity": {type: 'v4v', value: []},
        "fogColor": { value: new THREE.Vector3()},
        "fog": {value: new THREE.Vector3()},
        "fogNear": {value: 0},
        "fogFar": {value: 0},
    }

    constructor(frag: string = fragShader, vert: string = vertShader, useFog: boolean = false, maxPointLight: number = 0) {
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniformsTable as any,
            defines: {
                PI: Math.PI,
                MAX_POINT_LIGHT: maxPointLight,
                HAVE_POINT_LIGHT: maxPointLight>0,
            },
            fragmentShader: frag,
            vertexShader: vert,
            fog: useFog
        });
    }
}