#version 300 es

precision mediump float;

in vec2 texCoords;

uniform sampler2D sampler;
uniform vec2 canvasResolution;

uniform float REDxOffset;
uniform float REDyOffset;

uniform float GREENxOffset;
uniform float GREENyOffset;

uniform float BLUExOffset;
uniform float BLUEyOffset;

uniform bool useCA;
uniform bool useBlur;

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

vec3 chromaticAberration(vec2 uv) {
  return vec3(texture(sampler, vec2(uv.x + (0.1f * REDxOffset), uv.y + (0.1f * REDyOffset))).x, texture(sampler, vec2(uv.x + (0.1f * GREENxOffset), uv.y + (0.1f * GREENyOffset))).y, texture(sampler, vec2(uv.x + (0.1f * BLUExOffset), uv.y + (0.1f * BLUEyOffset))).z);
}

void main() {
  // vec4 texel = texture(sampler, texCoords);
  // float luminesence = dot(texture(sampler, texCoords).rgb, vec3(0.2f, 0.7f, 0.07f));
  // fragColor = vec4(vec3(luminesence), 1.0f);
  // fragColor = texture(sampler, texCoords);

  // chromatic abberation
  vec3 color = vec3(-0.5f, 0.2f, 1.0f);

  if(useCA == true) {
    vec3 chromaticAberration = chromaticAberration(texCoords);
    color = color * chromaticAberration;
  }
  if(useBlur == true) {
    vec3 BlurCanvas = Blur(texCoords);
    color = color * BlurCanvas;
  }
  if(useBlur == false && useCA == false) {
    color = texture(sampler, texCoords).rgb;
  }
  //test case
  // vec3 chromaticAberration = chromaticAberration(texCoords);
  // vec3 BlurCanvas = Blur(texCoords);
  // vec3 color = chromaticAberration * BlurCanvas;

  //Blur
  fragColor = vec4(color, 1.0f);
}