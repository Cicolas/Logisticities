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
uniform float highestPeak;
uniform float height;
uniform vec3 colors[4];

#ifdef HAVE_POINT_LIGHT
    uniform vec3 pointLightColors[MAX_POINT_LIGHT];
    uniform vec3 pointLightPosition[MAX_POINT_LIGHT];
    uniform float pointLightIntensity[MAX_POINT_LIGHT];
#endif

varying vec3 vPos;
varying vec3 vNormal;

void defaultBehavior(vec4 _color) {
    gl_FragColor = _color;
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

    // checkStepness(vertex: Vertex) {
    //     const rotation = new THREE.Vector2();
    //     rotation.x = -Math.atan2(vertex.normal.y, vertex.normal.z);
    //     rotation.y =
    //         (1 / 2) * Math.PI - Math.atan2(vertex.normal.y, vertex.normal.x);

    //     if (
    //         Math.abs((rotation.x * 180) / Math.PI + 90) > MAX_STEPNESS ||
    //         Math.abs((rotation.y * 180) / Math.PI) > MAX_STEPNESS
    //     ) {
    //         return false;
    //     }

    //     return true;
    // }

float checkStepeness() {
    float maxStepness = 15.;

    vec2 rotation = vec2(0);
    rotation.x = (1./2. * PI) - atan(vNormal.y, vNormal.z);
    rotation.y = (1./2. * PI) - atan(vNormal.y, vNormal.x);

    float arg1 = maxStepness/abs((rotation.x * 180.) / PI);
    float arg2 = maxStepness/abs((rotation.y * 180.) / PI);

    // arg1 = abs(clamp(arg1, 0., 1.)-1.);
    // arg2 = abs(clamp(arg2, 0., 1.)-1.);

    arg1 = abs(smoothstep(1., 1., arg1)-1.);
    arg2 = abs(smoothstep(1., 1., arg2)-1.);

    return clamp(arg1+arg2, 0., 1.);
}

void main()	{
    // gl_FragColor = vec4((vPos+vec3(5))/vec3(10), 1);
    vec3 col = mix(colors[1], colors[2], checkStepeness());
    float snow = smoothstep(height/5., height/5., vPos.y);
    float sand = abs(smoothstep(1./20., 1./20., vPos.y)-1.);
    col = mix(col, sand*colors[0], sand);
    col = mix(col, snow*colors[3], snow);
    defaultBehavior(vec4(vec3(col), 1));
}
