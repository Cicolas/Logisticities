uniform float time;
uniform vec2 resolution;
uniform vec3 color;
uniform vec3 directionalLightColor;
uniform vec3 directionalLightDirection;

varying vec3 vPos;
varying vec3 vNormal;
void main()	{
    vec3 normal = normalize(vNormal);
    vec3 dir = normalize(directionalLightDirection);
    vec3 nColor = clamp(
        vec3(
            normal.x*(-directionalLightDirection.x),
            normal.y*(-directionalLightDirection.y),
            normal.z*(directionalLightDirection.z)
        ), 0., 1.
    );

    vec3 xColor = nColor.x*color;
    vec3 yColor = nColor.y*color;
    vec3 zColor = nColor.z*color;

    gl_FragColor = vec4(xColor+yColor+zColor, 1);
}