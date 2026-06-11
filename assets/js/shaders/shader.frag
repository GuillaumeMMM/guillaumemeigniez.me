#version 300 es
precision highp float;
out vec4 outColor;

uniform float u_time;
uniform vec2 u_mouse;
uniform float u_time_start_trans;
uniform float u_time_apparition_trans;
uniform float u_pixel_intensity;

uniform sampler2D u_image_bg;
uniform sampler2D u_image_bg_next;
uniform vec2 u_imagePos_bg;
uniform vec2 u_imageSize_bg;

uniform sampler2D u_image_sticker_0;
uniform vec2 u_imagePos_sticker_0;
uniform vec2 u_imageSize_sticker_0;

uniform sampler2D u_image_sticker_1;
uniform vec2 u_imagePos_sticker_1;
uniform vec2 u_imageSize_sticker_1;

uniform sampler2D u_image_sticker_2;
uniform vec2 u_imagePos_sticker_2;
uniform vec2 u_imageSize_sticker_2;

uniform sampler2D u_image_sticker_3;
uniform vec2 u_imagePos_sticker_3;
uniform vec2 u_imageSize_sticker_3;

vec4 pixelized(sampler2D tex, vec2 uv, float blurDiscFactor, float tileSize, float distanceToMouse) {
    vec2 texSize = vec2(textureSize(tex, 0));
    float aspect = texSize.x / texSize.y;
    ;
    float disc = smoothstep(50., 1000. / blurDiscFactor, distanceToMouse);

    vec2 size = tileSize * vec2(aspect, 1.0) + (10. * (1. - u_pixel_intensity));

    vec2 snapped = mix(uv, floor(uv * size) / size, disc);
    vec2 texel = snapped * texSize;

    return texelFetch(tex, ivec2(floor(texel) + 0.5), 0);
}

vec4 shadow(vec4 bg, vec4 sprite, float shadowAlpha) {
    vec4 shadowColor = vec4(0.0, 0.0, 0.0, shadowAlpha);
    return mix(mix(bg, shadowColor, shadowAlpha), sprite, sprite.a);
}

float shadowAlpha(sampler2D tex, vec2 uv, vec2 offset, float spread, float distanceToMouse) {
    float alpha = .0;
    int samples = 2;
    for(int x = -samples; x <= samples; x++) {
        for(int y = -samples; y <= samples; y++) {
            vec2 sampleUV = uv - offset + vec2(x, y) * spread;
            alpha += pixelized(tex, sampleUV, 3., 35., distanceToMouse).a;
        }
    }
    return alpha / pow(float(samples) * 2.0 + 1.0, 2.0);
}

vec4 mixWithShadow(vec4 pixelizedBg, vec4 pixelizedBgNext, vec4 pixelizedSticker, float shadowF, float transitionTime) {
    return mix(shadow(pixelizedBg, pixelizedSticker, shadowF), shadow(pixelizedBgNext, pixelizedSticker, shadowF), transitionTime);
}

void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uvBg = (fragCoord - u_imagePos_bg) / u_imageSize_bg;
    vec2 uvSticker0 = (fragCoord - u_imagePos_sticker_0) / u_imageSize_sticker_0;
    vec2 uvSticker1 = (fragCoord - u_imagePos_sticker_1) / u_imageSize_sticker_1;
    vec2 uvSticker2 = (fragCoord - u_imagePos_sticker_2) / u_imageSize_sticker_2;
    vec2 uvSticker3 = (fragCoord - u_imagePos_sticker_3) / u_imageSize_sticker_3;

    float showSticker1 = 1. - step(u_imageSize_sticker_1.x, 0.001);
    float showSticker2 = 1. - step(u_imageSize_sticker_2.x, 0.001);
    float showSticker3 = 1. - step(u_imageSize_sticker_3.x, 0.001);

    float distanceToMouse = distance(u_mouse, gl_FragCoord.xy);

    float isTransitionOver = step(u_time_start_trans, 0.9999);
    float transitionTime = u_time_start_trans * isTransitionOver;
    vec4 pixelizedBg = pixelized(u_image_bg, uvBg, .8, 25. - 2. * transitionTime, distanceToMouse);
    vec4 pixelizedBgNext = pixelized(u_image_bg_next, uvBg, .8, 25., distanceToMouse);

    vec4 pixelizedSticker0 = pixelized(u_image_sticker_0, uvSticker0, 1.5, 35., distanceToMouse);
    vec4 pixelizedSticker1 = showSticker1 * pixelized(u_image_sticker_1, uvSticker1, 1.5, 35., distanceToMouse);
    vec4 pixelizedSticker2 = showSticker2 * pixelized(u_image_sticker_2, uvSticker2, 1.5, 35., distanceToMouse);
    vec4 pixelizedSticker3 = showSticker3 * pixelized(u_image_sticker_3, uvSticker3, 1.5, 35., distanceToMouse);

    float spread = 0.01 + distanceToMouse / 20000.;
    float shadowF0 = shadowAlpha(u_image_sticker_0, uvSticker0, vec2(0.02, -0.02), spread, distanceToMouse);
    float shadowF1 = showSticker1 * shadowAlpha(u_image_sticker_1, uvSticker1, vec2(0.02, -0.02), spread, distanceToMouse);
    float shadowF2 = showSticker2 * shadowAlpha(u_image_sticker_2, uvSticker2, vec2(0.02, -0.02), spread, distanceToMouse);
    float shadowF3 = showSticker3 * shadowAlpha(u_image_sticker_3, uvSticker3, vec2(0.02, -0.02), spread, distanceToMouse);

    vec4 stickers = mix(mix(mix(pixelizedSticker0, pixelizedSticker1, pixelizedSticker1.a), pixelizedSticker2, pixelizedSticker2.a), pixelizedSticker3, pixelizedSticker3.a);
    float shadows = shadowF0 + shadowF1 + shadowF2 + shadowF3;

    outColor = u_time_apparition_trans * mixWithShadow(pixelizedBg, pixelizedBgNext, stickers, shadows, transitionTime);
}
