#version 300 es

precision mediump float;

in vec2 texCoords;

uniform sampler2D sampler;
uniform vec2 canvasResolution;
uniform vec2 windowResolution;

//choraAberr manual floats
uniform float REDxOffset;
uniform float REDyOffset;

uniform float GREENxOffset;
uniform float GREENyOffset;

uniform float BLUExOffset;
uniform float BLUEyOffset;

//color correction
uniform vec3 colorChanels;

// shader in use variables
uniform bool useCA;
uniform bool useBlur;
uniform bool useDither;

uniform vec2 mousePos;

//temporary test
float grainMultiplier = 1.2f;

out vec4 fragColor;

//dither variables 
vec4 lum = vec4(0.2126f, 0.7152f, 0.0722f, 0);
// const int dither_matrix_2x2[16] = int[](0, 8, 2, 18, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5);
const int dither_matrix_2x2[4] = int[](0, 3, 2, 1);

vec3 Blur(vec2 uv) {
  const float Pi = 6.28318530718f; // Pi*2
  // GAUSSIAN BLUR SETTINGS {{{
  const float Directions = 16.0f; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
  const float Quality = 4.0f; // BLUR QUALITY (Default 4.0 - More is better but slower)
  const float Size = 6.0f; // BLUR SIZE (Radius)
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

// vec3 chromaticAberration(vec2 uv) {
//   return vec3(texture(sampler, vec2(uv.x + (0.1f * REDxOffset), uv.y + (0.1f * REDyOffset))).x, texture(sampler, vec2(uv.x + (0.1f * GREENxOffset), uv.y + (0.1f * GREENyOffset))).y, texture(sampler, vec2(uv.x + (0.1f * BLUExOffset), uv.y + (0.1f * BLUEyOffset))).z);
// }

vec3 chromaticAberration(vec2 uv) {
  //vec2 ca_center = normalize(mousePos);
  vec2 ca_center = (mousePos / windowResolution) * 2.0f - 1.0f;
  ca_center.y = ca_center.y * -1.0f;
  //ca_center = vec2(0.5, 0.2);
  float d = length(uv - 0.5f);

  float REDx = (ca_center.x / 5.0f) + ca_center.x * 0.1f;
  float REDy = (ca_center.y / 5.0f) + ca_center.y * 0.1f;
  float GREENx = 0.0f;
  float GREENy = 0.0f;
  float BLUEx = (ca_center.x / 5.0f + ca_center.x * 0.1f) * -1.0f;
  float BLUEy = (ca_center.y / 5.0f + ca_center.y * 0.1f) * -1.0f;
  return vec3(texture(sampler, vec2(uv.x - d * 0.1f * REDx, uv.y - d * 0.1f * REDy)).x, texture(sampler, vec2(uv.x - d * 0.1f * GREENx, uv.y - d * 0.1f * GREENy)).y, texture(sampler, vec2(uv.x - d * 0.1f * BLUEx, uv.y - d * 0.1f * BLUEy)).z);
}

float dither2x2(vec2 uv, float luma) {
  float dither_amount = 2.0f;
  int x = int(mod(uv.x, dither_amount));
  int y = int(mod(uv.y, dither_amount));
  int index = x + y * int(dither_amount);
  float limit = (float(dither_matrix_2x2[index]) + 1.0f) / (1.0f + 4.0f);
  return luma < limit ? 0.0f : 1.0f;
}

float threshold(float color) {
  float thresholdWhiteValue = 0.3f;
  float thresholdGreyValue = 0.2f;
  if(color > thresholdWhiteValue) {
    return 1.0f;
  }
  if(color > thresholdGreyValue) {
    return 0.5f;
  }
  return 0.0f;
}

float rand(vec2 uv) {

  return fract(sin(dot(uv.xy, vec2(12.9898f, 78.233f))) * 43758.5453f);
}

void main() {
  // vec4 texel = texture(sampler, texCoords);
  // float luminesence = dot(texture(sampler, texCoords).rgb, vec3(0.2f, 0.7f, 0.07f));
  // fragColor = vec4(vec3(luminesence), 1.0f);
  // fragColor = texture(sampler, texCoords);

  vec3 chromaticAberration = chromaticAberration(texCoords);
  vec3 BlurCanvas = Blur(texCoords);
  vec3 color = colorChanels;

  if(useCA == true && useBlur == true) {
    color *= mix(chromaticAberration, BlurCanvas, 0.5f);
  } else if(useCA == true) {
    color = color * chromaticAberration;
  } else if(useBlur == true) {
    color = color * BlurCanvas;
  } else {
    color = color * texture(sampler, texCoords).rgb;
  }

  //test case
  // vec3 chromaticAberration = chromaticAberration(texCoords);
  // vec3 BlurCanvas = Blur(texCoords);
  // vec3 color = chromaticAberration * BlurCanvas;

  //Blur

  // fragColor.rgb = colorChanels;
  // fragColor = fragColor * texture(sampler, texCoords);
  // fragColor.rgb = fragColor.rgb * chromaticAberration;
  float grayscale = dot(color, lum.rgb);
  vec3 dither = vec3(dither2x2(gl_FragCoord.xy, grayscale));
  if(useDither == true) {
    color = color * dither;
  } 

  // float thresholded = dither2x2(texCoords, grayscale + ((rand(texCoords) / 9.0f)));

  // fragColor = vec4(vec3(thresholded), 1.0f);
  fragColor = vec4(color, 1.0f);
  // fragColor = vec4(fragColor.r * dither2x2(gl_FragCoord.xy, grayscale), fragColor.g * dither2x2(gl_FragCoord.xy, grayscale), fragColor.b * dither2x2(gl_FragCoord.xy, grayscale), 1.0f);
  // fragColor = vec4(color * dither, 1.0f);
}
