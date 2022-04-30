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

#ifdef HAVE_POINT_LIGHT
    uniform vec3 pointLightColors[MAX_POINT_LIGHT];
    uniform vec3 pointLightPosition[MAX_POINT_LIGHT];
    uniform float pointLightIntensity[MAX_POINT_LIGHT];
#endif

varying vec3 vPos;
varying vec3 vNormal;
void main()	{
    // gl_FragColor = vec4((vPos+vec3(5))/vec3(10), 1);
    gl_FragColor = vec4(color, 1);
    vec3 normal = normalize(vNormal);
    vec3 dir = normalize(directionalLightDirection);
    float dotp = clamp(dot(dir, normal)*directionalLightIntensity, 0., 1.);

    vec3 directionalLight = directionalLightColor*dotp;
    vec3 ambientLight = ambientLightColor*ambientLightIntensity;

    vec3 actualPointLight = vec3(0., 0., 0.);

    #ifdef HAVE_POINT_LIGHT
        for(int i = 0; i < MAX_POINT_LIGHT; i++) {
            vec3 dist = vPos - pointLightPosition[i];
            vec3 plDir = normalize(dist);
            actualPointLight += clamp(dot(-plDir, vNormal) * pointLightIntensity[i], 0., 1.) * pointLightColors[i];
        }
    #endif

    vec3 actualLight = directionalLight+ambientLight+actualPointLight;
    gl_FragColor.rgb = gl_FragColor.rgb*actualLight;

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