#version 300 es
precision mediump float;

uniform sampler2D sampler;

uniform float ditheringEnabled;
uniform float gridSize;
uniform float invertColor;
uniform float pixelSizeRatio;
uniform float grayscaleOnly;
uniform float QuantizeColor;
uniform float BelowThresholdRatio;

in vec2 fragTextCoord;
out vec4 fragColor;

// Light values
in vec3 fPos;
in vec3 fNorm;
uniform vec3 pointLightPosition;
uniform float Is_Lit;

void main() {

  vec4 tex = texture(sampler, fragTextCoord);
  vec3 color = tex.rgb;

  if(QuantizeColor > 0.5f) {
    color.rgb = floor(color.rgb * QuantizeColor) / QuantizeColor;
  }

  if(Is_Lit > 0.5f) {

    vec3 L = normalize(pointLightPosition - fPos);
    vec3 N = normalize(fNorm);

    float light = max(dot(N, L), 0.0f);

    if(ditheringEnabled > 0.5f) {
      float pixelSize = gridSize * pixelSizeRatio;
      ivec2 p = ivec2(gl_FragCoord.xy / pixelSize);

      int x = p.x & 3;
      int y = p.y & 3;

      int index = (y == 0) ? int[4](0, 8, 2, 10)[x] : (y == 1) ? int[4](12, 4, 14, 6)[x] : (y == 2) ? int[4](3, 11, 1, 9)[x] : int[4](15, 7, 13, 5)[x];

      float dither = (float(index) + 0.5f) / 16.0f - 0.5f;
      light += dither * BelowThresholdRatio;
    }

    light = clamp(light, 0.0f, 1.0f);

    if(QuantizeColor > 0.5f) {
      light = floor(light * QuantizeColor) / QuantizeColor;
    }

    float lightIntensity = 0.5f + 1.0f * light;
    color *= lightIntensity;
  }

  /* luminance */
  float lum = dot(color, vec3(0.299f, 0.587f, 0.114f));

  if(grayscaleOnly > 0.5f) {
    color = vec3(lum);
  }

  if(invertColor > 0.5f) {
    color = 1.0f - color;
  }

  fragColor = vec4(color, tex.a);
}
