'use strict';

var Model = function (gl, vertices, indices, normals, textCoords, texture, color, name) {
	this.vbo = gl.createBuffer();
	this.ibo = gl.createBuffer();
	this.nbo = gl.createBuffer();
    this.tbo = gl.createBuffer();
	this.nPoints = indices.length;

	this.world = glMatrix.mat4.create();
	this.textCoords = textCoords;

    this.texture = texture || null;
    this.color = color || null;
    this.name = name;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.tbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textCoords), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
};

var CreateShaderProgram = function (gl, vsText, fsText){
    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vsText);
    
    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fsText);

    gl.compileShader(vs);
    if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
        return{
            error: 'ERROR COMPILING VERTEX SHADER' + gl.getShaderInfoLog(vs)
        };
    }

    gl.compileShader(fs);
    if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
        return{
            error: 'ERROR COMPILING FRAGMENT SHADER' + gl.getShaderInfoLog(fs)
        };
    }

    var program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter (program, gl.LINK_STATUS)){
        return{
            error: 'ERROR LINKING PROGRAM'+ gl.getProgramInfoLog(program)
        };
    }
    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        return{
            error: 'ERROR VALIDATING PROGRAM'+ gl.getProgramInfoLog(program)
        };
    }

    return program;
};

var Camera = function (position, LookAt, up){
    this.forward = glMatrix.vec3.create();
    this.up = glMatrix.vec3.create();
    this.right = glMatrix.vec3.create();

    this.position = position;

    glMatrix.vec3.subtract(this.forward, LookAt, this.position);
    glMatrix.vec3.cross(this.right, this.forward, up);
    glMatrix.vec3.cross(this.up, this.right, this.forward);

    glMatrix.vec3.normalize(this.forward, this.forward);
    glMatrix.vec3.normalize(this.right, this.right);
    glMatrix.vec3.normalize(this.up, this.up);
};

Camera.prototype.GetViewMatrix = function(out){
    var lookAt = glMatrix.vec3.create();
    glMatrix.vec3.add(lookAt, this.position, this.forward);
    glMatrix.mat4.lookAt(out, this.position, lookAt, this.up);
    return out;
};


Camera.prototype.rotateRight = function (rad) {
	var rightMatrix = glMatrix.mat4.create();
	glMatrix.mat4.rotate(rightMatrix, rightMatrix, rad, glMatrix.vec3.fromValues(0, 1, 0));
	glMatrix.vec3.transformMat4(this.forward, this.forward, rightMatrix);
	this._realign();
};

Camera.prototype._realign = function() {
	glMatrix.vec3.cross(this.right, this.forward, this.up);
	glMatrix.vec3.cross(this.up, this.right, this.forward);

	glMatrix.vec3.normalize(this.forward, this.forward);
	glMatrix.vec3.normalize(this.right, this.right);
	glMatrix.vec3.normalize(this.up, this.up);
};

Camera.prototype.moveForward = function (dist) {
	glMatrix.vec3.scaleAndAdd(this.position, this.position, this.forward, dist);
};

Camera.prototype.moveRight = function (dist) {
	glMatrix.vec3.scaleAndAdd(this.position, this.position, this.right, dist);
};

Camera.prototype.moveUp = function (dist) {
	glMatrix.vec3.scaleAndAdd(this.position, this.position, this.up, dist);
};

Camera.prototype.setRotation = function (yaw, pitch) {
    // Clamp pitch to avoid flip
    const maxPitch = Math.PI / 2 - 0.001;
    pitch = Math.max(-maxPitch, Math.min(maxPitch, pitch));

    // Forward vector from yaw & pitch
    this.forward[0] = Math.cos(pitch) * Math.sin(yaw);
    this.forward[1] = Math.sin(pitch);
    this.forward[2] = Math.cos(pitch) * Math.cos(yaw);

    glMatrix.vec3.normalize(this.forward, this.forward);

    // Rebuild right and up
    const worldUp = glMatrix.vec3.fromValues(0, 1, 0);
    glMatrix.vec3.cross(this.right, this.forward, worldUp);
    glMatrix.vec3.normalize(this.right, this.right);

    glMatrix.vec3.cross(this.up, this.right, this.forward);
    glMatrix.vec3.normalize(this.up, this.up);
};

function raySphereIntersect(rayOrigin, rayDir, sphereCenter, sphereRadius, maxInteractionRange) {
    //create sphere
    let Spehre_Vector = glMatrix.vec3.create();
    glMatrix.vec3.subtract(Spehre_Vector, rayOrigin, sphereCenter);

    //points in spcace between sphere and camera
    let b = glMatrix.vec3.dot(Spehre_Vector, rayDir);
    let c = glMatrix.vec3.dot(Spehre_Vector, Spehre_Vector) - sphereRadius * sphereRadius;

    let h = b*b - c;

    //ray lenght
    let raycastlength = -b - Math.sqrt(h);

    //if ray intersects with sphere and is less than max range but more than 0, retunt true (is looking)
    if (h >= 0 && raycastlength <= maxInteractionRange && raycastlength >= 0) return true;
    return false;
}