#version 300 es
precision mediump float;

uniform mat4 mProj;
uniform mat4 mView;
uniform mat4 mWorld;

in vec2 vertTextCoord;
in vec3 vPos;
in vec3 vNorm;

out vec2 fragTextCoord;
out vec3 fPos;
out vec3 fNorm;

void main() {

  fragTextCoord = vertTextCoord;
  fPos = (mWorld * vec4(vPos, 1.0f)).xyz;
  fNorm = (mWorld * vec4(vNorm, 0.0f)).xyz;

  gl_Position = mProj * mView * vec4(fPos, 1.0f);
}
