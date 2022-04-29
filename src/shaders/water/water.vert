uniform float time;
uniform vec2 resolution;
uniform vec3 color;
uniform vec3 fog;
uniform float fogNear;
uniform float fogFar;

varying vec3 vPos;
varying vec3 vNormal;
varying float n;
varying vec2 vUv;
void main()	{
    n = position.x/50.;
    vPos = position;
    vNormal = normal;

    vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    vec2 wave = uv;

    gl_Position = vec4(
        pos.x,
        pos.y,
        pos.z,
        pos.w
    );
}