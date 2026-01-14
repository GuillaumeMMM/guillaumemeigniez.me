#version 300 es
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_imageSize;
uniform float u_time;
uniform vec4 u_events;

in vec2 v_uv;
out vec4 outColor;

float noise(vec2 uv) {
    return (fract(sin(dot(uv * u_time, vec2(12.9898, 78.233))) * 43758.5453) - 0.5);
}

float rand(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 applyFlutedDistortion(
    sampler2D tex,
    vec2 uv,
    vec2 resolution,
    float distortion,
    vec3 lightPos,
    float time
) {
    // --- flute pattern ---
    float fluteCount = 5.0;
    float flutePos = fract(uv.x * fluteCount + 0.5);

    // fake normal from flute
    vec3 normal;
    normal.x = cos(flutePos * 6.2831853) * 0.45;
    normal.y = 0.0;
    normal.z = sqrt(max(0.0, 1.0 - normal.x * normal.x));
    normal = normalize(normal);

    // lighting
    vec3 lightDir = normalize(lightPos);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float specular = pow(max(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0), 32.0);

    // distorted UV
    vec2 dUV = uv + normal.xy * distortion;

    float n = rand(dUV * resolution * 0.2 + time);
    vec2 noiseOffset = (vec2(n) - 0.5) * 0.002;

    // cheap blur (5 taps instead of 25)
    vec3 col = vec3(0.0);
    col += texture(tex, dUV + noiseOffset).rgb * 0.4;
    col += texture(tex, dUV + noiseOffset + vec2(0.002, 0.0)).rgb * 0.15;
    col += texture(tex, dUV + noiseOffset - vec2(0.002, 0.0)).rgb * 0.15;
    col += texture(tex, dUV + noiseOffset + vec2(0.0, 0.002)).rgb * 0.15;
    col += texture(tex, dUV + noiseOffset - vec2(0.0, 0.002)).rgb * 0.15;

    // subtle chromatic split
    col.r = texture(tex, dUV + vec2(distortion * 0.02, 0.0)).r;
    col.b = texture(tex, dUV - vec2(distortion * 0.02, 0.0)).b;

    // lighting response
    col *= (0.5 + diffuse * 0.5);
    col += specular * 0.05;

    // blend with original
    vec3 base = texture(tex, uv).rgb;
    return mix(base, col, uv.x);
}

void main() {
    float screenRatio = u_resolution.x / u_resolution.y;
    float imageRatio = u_imageSize.x / u_imageSize.y;

    vec2 scale = vec2(min(screenRatio / imageRatio, 1.0), min(imageRatio / screenRatio, 1.0));

    vec2 uv = (v_uv - 0.5) * scale + 0.5;

    vec3 color = texture(u_texture, uv).rgb;

    color = color + u_events.r * noise(uv) + u_events.g * (applyFlutedDistortion(u_texture, uv, u_resolution, 0., vec3(0., 0., 1.0), u_time) - color);

    outColor = vec4(color, 1.0);
}
