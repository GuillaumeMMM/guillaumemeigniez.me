const sticker = document.getElementById('sticker');
const canvas = document.getElementById('canvas');
const sideImage = document.getElementById('side-image');
let dragging = false;
let offX = 0;
let offY = 0;

const stickerDimensions = { width: 100, height: 100 };

sticker.setAttribute('width', `${stickerDimensions.width}px`);
sticker.setAttribute('height', `${stickerDimensions.height}px`);

//  Drag
sticker.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragging = true;
    offX = e.clientX - sticker.offsetLeft;
    offY = e.clientY - sticker.offsetTop;
    sticker.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!dragging) return;

    const maxX = document.documentElement.scrollWidth - stickerDimensions.width;
    const maxY = document.documentElement.scrollHeight - stickerDimensions.height - 10;
    sticker.style.left = Math.min(Math.max(0, e.clientX - offX), maxX) + 'px';
    sticker.style.top = Math.min(Math.max(0, e.clientY - offY), maxY) + 'px';
});

document.addEventListener('mouseup', () => {
    dragging = false;
    sticker.style.cursor = 'grab';
});

//  Canvas
async function loadShaderSource(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to load shader: ${url}`);
    }
    return await response.text();
}

(async function () {
    const gl = canvas.getContext("webgl2");

    if (!gl) {
        alert("WebGL2 not supported in your browser.");
    }

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

    const vertexShader = compileShader(
        gl.VERTEX_SHADER,
        await loadShaderSource("assets/js/shaders/shader.vert")
    );

    const fragmentShader = compileShader(
        gl.FRAGMENT_SHADER,
        await loadShaderSource("assets/js/shaders/shader.frag")
    );

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

    // Draw
    let start = performance.now();

    const u_resLoc = gl.getUniformLocation(program, "u_resolution");
    const u_posLoc = gl.getUniformLocation(program, "u_position");
    const u_sizeLoc = gl.getUniformLocation(program, "u_size");
    const uTimeLoc = gl.getUniformLocation(program, "u_time");

    function render() {
        let now = performance.now();
        gl.uniform1f(uTimeLoc, (now - start) * 0.001);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }

    function resizeCanvas() {
        const { width, height } = document.documentElement.getBoundingClientRect();

        canvas.setAttribute('width', `${width}px`);
        canvas.setAttribute('height', `${height}px`);

        const sideImageRect = sideImage.getBoundingClientRect();
        gl.viewport(0, 0, width, height);
        gl.uniform2f(u_resLoc, width, height);
        gl.uniform2f(u_posLoc, sideImageRect.left, height - window.scrollY - sideImageRect.y - sideImageRect.height);
        gl.uniform2f(u_sizeLoc, sideImageRect.width, sideImageRect.height);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    render();
})();