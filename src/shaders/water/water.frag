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
    // gl_FragColor = vec4(color, 1);
    const vec3 directionalLightDirection = vec3(0, 0, 1);

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

    #ifdef USE_FOG
        #ifdef USE_LOGDEPTHBUF_EXT
            float depth = gl_FragDepthEXT / gl_FragCoord.w;
        #else
            float depth = gl_FragCoord.z / gl_FragCoord.w;
        #endif
        float fogFactor = smoothstep( fogNear, fogFar, depth );
        gl_FragColor.xyz = mix( gl_FragColor.xyz, fog.xyz, fogFactor );
    #endif
}

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}