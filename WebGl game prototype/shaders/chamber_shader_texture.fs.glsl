#version 300 es

precision mediump float;

out vec4 fragColor;

uniform sampler2D sampler;
in vec2 fragTextCoord;

void main() {
  fragColor = texture(sampler, fragTextCoord);
}