async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${url}`);
    }
    return await response.text();
}

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
    });
}

function getTime(now, start) {
    return (now - start) * 0.001
}

function areColliding(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function createTexture(gl, img) {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
}

(async function () {
    const gl = canvas.getContext("webgl2");

    //  Show the static image instead of the animation
    if (!gl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.add("no-webgl");
        return;
    }

    //  Background textures are created once per url and reused
    const texturesCache = new Map();
    function getTexture(url) {
        if (!texturesCache.has(url)) {
            texturesCache.set(url, loadImage(url).then(img => createTexture(gl, img)));
        }
        return texturesCache.get(url);
    }

    //  Download shaders, background and stickers in parallel
    const [vertexSource, fragmentSource, firstBgTexture, stickerImages] = await Promise.all([
        loadShaderSource("assets/js/shaders/shader.vert"),
        loadShaderSource("assets/js/shaders/shader.frag"),
        getTexture(stickers[0].bgUrl),
        Promise.all(stickers.map(st => loadImage(`assets/img/sticker${st.id}.webp`))),
    ]);

    // Compile shader helper
    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }

    gl.useProgram(program);

    // Fullscreen quad positions
    const positions = new Float32Array([
        -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);

    // Create buffer and upload data
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // Bind attribute
    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTimeLoc = gl.getUniformLocation(program, "u_time");
    const uMouseLoc = gl.getUniformLocation(program, "u_mouse");

    //  1 if textures should be pixelized, 0 otherwize
    const uPixelIntensityLoc = gl.getUniformLocation(program, "u_pixel_intensity");

    //  Start time of bg transition on collision
    const uStartTransitionTimeLoc = gl.getUniformLocation(program, "u_time_start_trans");

    //  Initial fade transition advancement
    const uApparitionTransitionTimeLoc = gl.getUniformLocation(program, "u_time_apparition_trans");
    gl.uniform1f(uStartTransitionTimeLoc, 0);
    gl.uniform1f(uPixelIntensityLoc, 1);

    let texture_bg = firstBgTexture;
    let texture_bg_next = null;

    //  Current background texture
    const uImageLoc = gl.getUniformLocation(program, "u_image_bg");

    //  Next background texture
    const uImageNextLoc = gl.getUniformLocation(program, "u_image_bg_next");

    //  Background position
    const uImagePosLoc = gl.getUniformLocation(program, "u_imagePos_bg");

    //  Background size
    const uImageSizeLoc = gl.getUniformLocation(program, "u_imageSize_bg");
    gl.uniform1i(uImageLoc, 0);
    gl.uniform1i(uImageNextLoc, 1);

    //  Stickers
    const textures = stickerImages.map(img => createTexture(gl, img));

    document.getElementById('side-image-loading').style.opacity = 0;
    Array.from(document.querySelectorAll('.sticker-loading')).map(((el, i) => {
        el.classList.add('sticker-fading');
        setTimeout(() => {
            el.style.opacity = 0

            setTimeout(() => {
                el.style.display = 'none';
            }, 200)
        }, i * 100)
    }));

    const stickersTextures = textures.map((texture, i) => {
        return {
            image: texture,
            texture: gl.getUniformLocation(program, `u_image_sticker_${i}`),
            pos: gl.getUniformLocation(program, `u_imagePos_sticker_${i}`),
            size: gl.getUniformLocation(program, `u_imageSize_sticker_${i}`)
        }
    })

    const STICKER_TEXTURE_OFFSET = 2;
    stickersTextures.forEach((stTex, index) => {
        gl.uniform1i(stTex.texture, STICKER_TEXTURE_OFFSET + index);
    })

    let start = performance.now();
    let transitionProgress = 0;
    let isTransitionning = false;
    let lastStickerIdColliding = null;
    let collidingStickersIds = [];
    let documentRect = document.documentElement.getBoundingClientRect();
    let displayedBgIndex = 0;

    function render() {
        let now = performance.now();
        gl.uniform1f(uTimeLoc, getTime(now, start));
        if (isTransitionning) {
            transitionProgress += 5 / 100;
            gl.uniform1f(uStartTransitionTimeLoc, transitionProgress);

            if (transitionProgress >= 1) {
                //  When the bg transition is done, switch current and next textures
                isTransitionning = false;
                gl.uniform1i(uImageLoc, displayedBgIndex === 0 ? 1 : 0);
                gl.uniform1i(uImageNextLoc, displayedBgIndex === 0 ? 0 : 1);
                displayedBgIndex = displayedBgIndex === 0 ? 1 : 0;
            }
        }

        if (now - start < 500) {
            gl.uniform1f(uApparitionTransitionTimeLoc, (now - start) / 500);
        } else {
            gl.uniform1f(uApparitionTransitionTimeLoc, 1);
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture_bg);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, texture_bg_next);

        stickersTextures.forEach((stTex, i) => {
            gl.activeTexture(gl.TEXTURE0 + STICKER_TEXTURE_OFFSET + i);
            gl.bindTexture(gl.TEXTURE_2D, stTex.image);
        })

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        updateTexturesPositions();

        requestAnimationFrame(render);
    }

    //  Element positions change on scroll, but the canvas size does not
    function updateRects() {
        documentRect = document.documentElement.getBoundingClientRect();
        sideImageRect = sideImage.getBoundingClientRect();
        sideImageHeight = sideImageRect.width / sideImageRatio;
        stickersRects = stickers.map(st => ({ rect: st.el.getBoundingClientRect(), id: st.id }))
    }

    function resizeCanvas() {
        updateRects();

        const width = Math.round(documentRect.width);
        const height = Math.round(documentRect.height);
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
            gl.viewport(0, 0, width, height);
        }

        const outsideStickers = stickersRects.filter(s => s.rect.x + s.rect.width > document.documentElement.clientWidth - 10)

        outsideStickers.forEach(st => {
            const sticker = stickers.find(stick => stick.id === st.id);
            const maxX = document.documentElement.clientWidth - st.rect.width;
            sticker.el.style.left = `${maxX}px`;
        })

        updateRects();
        updateTexturesPositions();
    }

    function updateTexturesPositions() {
        //  Match background position and size with DOM side-image div
        gl.uniform2f(uImagePosLoc, sideImageRect.left, documentRect.height - window.scrollY - sideImageRect.y - sideImageHeight);
        gl.uniform2f(uImageSizeLoc, sideImageRect.width, sideImageHeight);

        //  Match stickers position and size with DOM sticker divs
        stickersTextures.forEach((stTex, i) => {
            gl.uniform2f(stTex.pos, stickersRects[i].rect.left, documentRect.height - window.scrollY - stickersRects[i].rect.y - stickersRects[i].rect.height);
            gl.uniform2f(stTex.size, stickersRects[i].rect.width, stickersRects[i].rect.height);
        })

        gl.uniform2f(uMouseLoc, mouse.x, documentRect.height - window.scrollY - mouse.y);

        //  When a new sticker collides with the bg, update the bg image
        const collidingStickers = stickersRects.filter(stickerRect => areColliding(sideImageRect, stickerRect.rect));
        const newColliding = collidingStickers.filter(st => !collidingStickersIds.includes(st.id)).map(st => st.id);
        collidingStickersIds = collidingStickers.map(st => st.id);

        if (newColliding && newColliding.length > 0 && newColliding[0] !== lastStickerIdColliding) {
            getTexture(stickers.find(st => st.id === newColliding[0])?.bgUrl).then((res) => {
                if (displayedBgIndex === 0) {
                    texture_bg_next = res;
                } else {
                    texture_bg = res;
                }
                lastStickerIdColliding = newColliding[0];
                isTransitionning = true;
                transitionProgress = 0;
                gl.uniform1f(uStartTransitionTimeLoc, 0);
            });
        }

        if (documentRect.width < pixelizationLimit) {
            gl.uniform1f(uPixelIntensityLoc, 0);
        } else {
            gl.uniform1f(uPixelIntensityLoc, 1);
        }
    }

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", updateRects, { passive: true });

    resizeCanvas();
    render();
})();
