function loadTexture(gl, url, imageSizeLoc) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 0, 255])
    );

    const image = new Image();
    image.src = url;

    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
        );

        gl.uniform2f(imageSizeLoc, image.width, image.height);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    };
    return texture;
}

async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${url}`);
    }
    return await response.text();
}

const canvas = document.getElementById("background");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL2 not supported");
}

function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.pageX;
    mouseY = window.innerHeight - e.pageY;
});

(async function () {
    const vertexSource = await loadShaderSource("/assets/shaders/vertex.glsl");
    const fragmentSource = await loadShaderSource("/assets/shaders/fragment.glsl");

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
        return;
    }

    gl.useProgram(program);

    const uvs = new Float32Array([
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1,
    ]);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

    const uvLoc = gl.getAttribLocation(program, "a_uv");
    gl.enableVertexAttribArray(uvLoc);
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 0, 0);

    const positions = new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    const mouseLoc = gl.getUniformLocation(program, "u_mouse");
    const timeLoc = gl.getUniformLocation(program, "u_time");
    const textureLoc = gl.getUniformLocation(program, "u_texture");
    const imageSizeLoc = gl.getUniformLocation(program, "u_imageSize");
    const eventsLoc = gl.getUniformLocation(program, "u_events");

    gl.activeTexture(gl.TEXTURE0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.bindTexture(gl.TEXTURE_2D, loadTexture(gl, "/assets/img/back.jpg", imageSizeLoc));
    gl.uniform1i(textureLoc, 0);

    gl.clearColor(0, 0, 0, 1);
    gl.uniform4f(eventsLoc, 0, 0, 0, 0);

    const startTime = performance.now();

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
    }

    window.addEventListener("resize", resizeCanvas);

    const pageLinks = document.querySelectorAll('.description a, .footer a')

    Array.from(pageLinks).forEach((link, index) => {
        const currentPos = index % 4;
        const array = Array(4).fill(0).map((e, i) => currentPos === i ? 1 : 0)
        link.addEventListener('pointerover', () => {
            gl.uniform4f(eventsLoc, ...array);
        })

        link.addEventListener('pointerout', () => {
            gl.uniform4f(eventsLoc, 0, 0, 0, 0);
        })
    })

    function render() {
        resizeCanvas();
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const time = (performance.now() - startTime) * 0.01;

        gl.useProgram(program);
        gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
        gl.uniform2f(mouseLoc, mouseX, mouseY);
        gl.uniform1f(timeLoc, time);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    render();
})();