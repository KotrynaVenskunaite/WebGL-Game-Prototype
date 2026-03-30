#version 300 es

precision mediump float;

in vec2 texCoords;

uniform sampler2D sampler;
uniform vec2 canvasResolution;

const float REDxOffset = 0.05f;
const float REDyOffset = 0.0f;

const float GREENxOffset = 0.0f;
const float GREENyOffset = 0.0f;

const float BLUExOffset = -0.05f;
const float BLUEyOffset = 0.0f;

out vec4 fragColor;

vec3 Blur(vec2 uv) {
  const float Pi = 6.28318530718f; // Pi*2
  // GAUSSIAN BLUR SETTINGS {{{
  const float Directions = 16.0f; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
  const float Quality = 3.0f; // BLUR QUALITY (Default 4.0 - More is better but slower)
  const float Size = 2.0f; // BLUR SIZE (Radius)
  // GAUSSIAN BLUR SETTINGS }}}
  vec2 Radius = Size / canvasResolution;

   // Normalized pixel coordinates (from 0 to 1)
  vec3 color = texture(sampler, texCoords).rgb;

    // Blur calculations
  for(float d = 0.0f; d < Pi; d += Pi / Directions) {
    for(float i = 1.0f / Quality; i <= 1.0f; i += 1.0f / Quality) {

      vec2 offset = vec2(cos(d), sin(d)) * Radius * i;

      color += texture(sampler, uv + offset).rgb;
    }
  }

  // Output to screen
  color /= Quality * Directions - 15.0f;

  return color;
}

vec3 chromaticAberration(vec2 uv, vec4 fragColor) {
  return vec3(texture(sampler, vec2(uv.x + (0.1f * REDxOffset), uv.y + (0.1f * REDyOffset))).x, texture(sampler, vec2(uv.x + (0.1f * GREENxOffset), uv.y + (0.1f * GREENyOffset))).y, texture(sampler, vec2(uv.x + (0.1f * BLUExOffset), uv.y + (0.1f * BLUEyOffset))).z);
}

void main() {
  vec4 texel = texture(sampler, texCoords);
  // float luminesence = dot(texture(sampler, texCoords).rgb, vec3(0.2f, 0.7f, 0.07f));
  // fragColor = vec4(vec3(luminesence), 1.0f);
  // fragColor = texture(sampler, texCoords);

  //chromatic abberation
  // 
  vec3 chromaticAberration = chromaticAberration(texCoords, texel);
  vec3 BlurCanvas = Blur(texCoords) * 1.0f;

  // vec3 color = chromaticAberration * BlurCanvas;

  //Blur
  fragColor = vec4(chromaticAberration * BlurCanvas, 1.0f);
}