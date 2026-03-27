//post process variables
let postProcessVao;
let postProcessIbo;
// let postProcessProgram;
let framebuffer;
let framebufferTexture;
let framebufferDepthBuffer;

function postProcessSetup(gl){
    const data = new Float32Array([
        //pos       //tex coords
        1,1,0,       1,1,    //v1
        1,-1,0,      1,0,    //v2
        -1,-1,0,     0,0,    //v3
        -1,1,0,      0,1     //v4
    ]);

    const iData = new Uint8Array([
        0,1,2,  //triangle 1
        0,2,3   //triangle 2
    ]);

    postProcessVao = createVAO(gl, data, iData);

    //setup shaders
    framebufferSetup(gl, gl.canvas);
}

function framebufferSetup(gl, canvas){
    framebufferTexture = createCanvasTexture(gl, canvas);
    framebufferDepthBuffer = gl.createRenderbuffer();

    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebufferTexture, 0);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0]);

    gl.bindRenderbuffer(gl.RENDERBUFFER, framebufferDepthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebufferDepthBuffer);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('Framebuffer is incomplete:', status);
    }

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function resizeFramebuffer(gl, canvas){
    if (!framebuffer || !framebufferTexture || !framebufferDepthBuffer) {
        return;
    }

    gl.bindTexture(gl.TEXTURE_2D, framebufferTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    gl.bindRenderbuffer(gl.RENDERBUFFER, framebufferDepthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) {
        console.error('Framebuffer incomplete after resize:', status);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function createCanvasTexture(gl, canvas){
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    return tex;
}

function createVAO(gl, data, indiceData){
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    //pos and text coords buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    const stride = 3 * Float32Array.BYTES_PER_ELEMENT + 2 * Float32Array.BYTES_PER_ELEMENT;
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(0);

    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(1);


    const indiceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indiceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indiceData, gl.STATIC_DRAW);

    postProcessIbo = indiceBuffer;
    gl.bindVertexArray(null);

    return vao;

}