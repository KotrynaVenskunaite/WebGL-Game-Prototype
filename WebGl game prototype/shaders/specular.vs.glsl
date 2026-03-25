#version 300 es

precision mediump float;

// layout(location = 0) in vec3 aPos;
// layout(location = 1) in vec3 aNormal;
// layout(location = 2) in vec2 aTexCoords;

uniform mat4 mProj; //projection
uniform mat4 mView; //view
uniform mat4 mWorld; //model

in vec2 vertTextCoord;
in vec3 vPos;
in vec3 vNorm;

out vec2 fragTextCoord;
out vec3 fPos;
out vec3 fNorm;

void main() {

  fragTextCoord = vertTextCoord;
  fPos = vec3(mWorld * vec4(vPos, 1.0f));
  fNorm = mat3(transpose(inverse(mWorld))) * vNorm;

  gl_Position = mProj * mView * vec4(fPos, 1.0f);
}