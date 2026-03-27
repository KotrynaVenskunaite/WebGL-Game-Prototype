#version 300 es

precision mediump float;

in vec2 texCoords;

uniform sampler2D sampler;

const float REDxOffset = 0.05f;
const float REDyOffset = 0.0f;

const float GREENxOffset = 0.0f;
const float GREENyOffset = 0.0f;

const float BLUExOffset = -0.05f;
const float BLUEyOffset = 0.0f;

out vec4 fragColor;

vec4 chromaticAberration(vec2 uv, vec4 fragColor) {
  return vec4(texture(sampler, vec2(uv.x + (0.1f * REDxOffset), uv.y + (0.1f * REDyOffset))).x, texture(sampler, vec2(uv.x + (0.1f * GREENxOffset), uv.y + (0.1f * GREENyOffset))).y, texture(sampler, vec2(uv.x + (0.1f * BLUExOffset), uv.y + (0.1f * BLUEyOffset))).z, 1.0f);
}

void main() {
  // float luminesence = dot(texture(sampler, texCoords).rgb, vec3(0.2f, 0.7f, 0.07f));
  // fragColor = vec4(vec3(luminesence), 1.0f);
  // fragColor = texture(sampler, texCoords);
  vec4 texel = texture(sampler, texCoords);
  fragColor = chromaticAberration(texCoords, texel);
}