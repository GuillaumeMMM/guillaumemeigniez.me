#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2 u_resolution;
uniform vec2 u_position;
uniform vec2 u_size;

void main() {

    vec2 st = gl_FragCoord.xy / u_resolution;
    vec2 pos = u_position / u_resolution;
    vec2 size = u_size / u_resolution;

    vec2 inside = step(pos, st) * step(st, pos + size);

    float squareMask = inside.x * inside.y;

    outColor = squareMask * vec4(1., 0., 1., 1.);
}
