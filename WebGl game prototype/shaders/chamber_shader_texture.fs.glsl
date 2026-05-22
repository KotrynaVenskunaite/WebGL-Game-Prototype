#version 300 es

precision mediump float;

out vec4 fragColor;

uniform sampler2D sampler;
uniform float alpha;
in vec2 fragTextCoord;

void main() {
  vec4 texColor = texture(sampler, fragTextCoord);
  fragColor = vec4(texColor.rgb, texColor.a * alpha);
}