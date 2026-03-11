precision mediump float;

// Phong + Normalmap vertex shader
// constants
const float ZERO = 0.0;
const float ONE = 1.0;

// vertex attributes
attribute vec3 vertexPosition;          // vertex pos in object space
attribute vec3 vertexNormal;            // normal vector in object space
attribute vec2 vertexTexCoord0;         // texcoord in object space
attribute vec3 vertexTangent;           // tangent vector in object space

// uniforms
uniform mat4 matrixNormal;              // normal vector transform matrix
uniform mat4 matrixModelView;           // model-view matrix
uniform mat4 matrixModelViewProjection; // model-view-projection matrix

// output varying variables
varying vec3 positionVec;               // vertex position in eye space
varying vec3 normalVec;                 // normal vector in eye space
varying vec2 texCoord0;                 // texture coords in eye space
varying vec3 tangentVec;                // tangent vector in eye space
varying vec3 binormalVec;               // binormal (bitangent) vector in eye space

void main(void) {
  // transform vertex position to clip space
  gl_Position = matrixModelViewProjection * vec4(vertexPosition, ONE);

  // transform the normal vector from object space to eye space
  normalVec = (matrixNormal * vec4(vertexNormal, ONE)).xyz;//Changed value from ONE

  // get tangent vector in eye space
  tangentVec = (matrixNormal * vec4(vertexTangent, ONE)).xyz; //Changed value from ONE

  // compute binormal (bitangent) in eye space
  binormalVec = normalize(cross(normalVec, tangentVec));

  // transform vertex position from object space to eye space
  positionVec = vec3(matrixModelView * vec4(vertexPosition, ONE));

  // pass texture coord
  texCoord0 = vertexTexCoord0;
}