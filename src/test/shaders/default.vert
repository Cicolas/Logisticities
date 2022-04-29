uniform float time;
uniform vec2 resolution;
uniform vec3 color;
uniform vec3 directionalLightColor;
uniform vec3 directionalLightDirection;
uniform float directionalLightIntensity;
uniform vec3 ambientLightColor;
uniform float ambientLightIntensity;
uniform vec3 fog;
uniform float fogNear;
uniform float fogFar;

varying vec3 vPos;
varying vec3 vNormal;
void main()	{
    vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}