uniform float time;
uniform float windForce;
uniform vec3 windDirection;

varying vec3 vPos;
varying vec3 vNormal;
void main() {
    vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
    vNormal = normal;
    vec3 p = position;
    vec3 windDirection = normalize(windDirection);
    float t = (sin(time)+1.);

    p.x += (mix(.0, windForce, p.y)*t-mix(.0, windForce, p.y))*windDirection.x;
    p.y += (mix(.0, windForce, p.y)*t-mix(.0, windForce, p.y))*windDirection.y;
    p.z += (mix(.0, windForce, p.y)*t-mix(.0, windForce, p.y))*windDirection.z;
    vec4 position = projectionMatrix * modelViewMatrix * vec4(p,1.0);


    gl_Position = position;
}