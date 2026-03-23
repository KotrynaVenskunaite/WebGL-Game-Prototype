precision mediump float;

// Phong + Normalmap Fragment Shader
// constants
const float ZERO = 0.0;
const float ONE = 1.0;

const float normalStrength = 0.1;

// uniforms
uniform vec4 lightColor;
uniform vec4 lightPosition;             // should be in the eye space
uniform vec3 lightAttenuations;         // attenuation coefficients (k0, k1, k2)
uniform vec4 materialAmbient;           // material ambient color
uniform vec4 materialDiffuse;           // material diffuse color
uniform vec4 materialSpecular;          // material specular color
uniform float materialShininess;        // material specular exponent
uniform sampler2D map0;                 // texture map
uniform sampler2D map1;                 // normal map

uniform vec2 normalMapResolution;
uniform bool isMapGenerated;
uniform int renderResult;

// input varying variables
varying vec3 positionVec;               // vertex position in eye space
varying vec3 normalVec;                 // normal vector in eye space
varying vec2 texCoord0;                 // texture coords
varying vec3 tangentVec;                // tangent vector in eye space
varying vec3 binormalVec;               // binormal (bitangent) vector in eye space

vec3 Blur(vec2 uv) {
  const float Pi = 6.28318530718; // Pi*2
  // GAUSSIAN BLUR SETTINGS {{{
  const float Directions = 16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
  const float Quality = 3.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
  const float Size = 2.0; // BLUR SIZE (Radius)
  // GAUSSIAN BLUR SETTINGS }}}
  vec2 Radius = Size / normalMapResolution;

   // Normalized pixel coordinates (from 0 to 1)
  vec3 color = texture2D(map1, uv).rgb;

    // Blur calculations
  for(float d = 0.0; d < Pi; d += Pi / Directions) {
    for(float i = 1.0 / Quality; i <= 1.0; i += 1.0 / Quality) {

      vec2 offset = vec2(cos(d), sin(d)) * Radius * i;

      color += texture2D(map1, uv + offset).rgb;
    }
  }

  // Output to screen
  color /= Quality * Directions - 15.0;

  return color;
}

float getHeight(vec2 uv) {
  // return texture2D(map1, uv).r;
  return Blur(uv).r;
}

vec3 bumpFromDepth(vec2 uv) {

  vec2 step = 1.0 / normalMapResolution;

  float height = getHeight(uv);

  vec2 dxy = height - vec2(getHeight(uv + vec2(step.x, 0.0)), getHeight(uv + vec2(0.0, step.y)));

  return normalize(vec3(dxy * normalStrength / step, 1.0));
}

void main(void) {
  // re-normalize varying vars
  vec3 normal = normalize(normalVec);
  vec3 tangent = normalize(tangentVec);
  vec3 binormal = normalize(binormalVec); // bitangent

  // construct TBN matrix
  mat3 matrixTbn = mat3(tangent, binormal, normal);

  // compute light vector and attenuation
  vec3 light;
  float attenuation;
  // directional light
  if(lightPosition.w == ZERO) {
    light = normalize(lightPosition.xyz);
    attenuation = ONE;
  }
  // positional light
  else {
    // compute light vector in eye space
    light = lightPosition.xyz - positionVec;

    // compute attenuation: 1 / (k0 + k1*d + k2*d*d)
    vec3 attFact;
    attFact.x = ONE;                // 1
    attFact.z = dot(light, light);  // dist * dist
    attFact.y = sqrt(attFact.z);    // dist
    attenuation = ONE / dot(lightAttenuations, attFact);

    light = normalize(light);
  }

  // compute view vector (from vertex to camera) in eye space
  vec3 view = normalize(-positionVec);

  // compute view vector in tangent space with TBN
  vec3 tsView = matrixTbn * view;

  // compute light vector in tangent space with TBN matrix
  vec3 tsLight = matrixTbn * light;

  // get normal in tangent space from normal map,
  // then set the range from [0, 1] to [-1, 1]
  // vec3 tsNormal = texture2D(map1, vec2(1.0 - texCoord0.x, texCoord0.y)).rgb * 2.0 - 1.0;

  vec3 tsNormal = (isMapGenerated == false) ? texture2D(map1, vec2(1.0 - texCoord0.x, texCoord0.y)).rgb * 2.0 - 1.0 : bumpFromDepth(vec2(1.0 - texCoord0.x, texCoord0.y));

  tsNormal.xy *= 1.0;
  tsNormal = normalize(tsNormal);

  // compute reflected ray vector: 2 * (N dot L) * N - L
  vec3 tsReflect = reflect(-tsLight, tsNormal);

  // start with ambient
  vec3 color = materialAmbient.rgb;

  // add diffuse portion using Lambert cosine law
  float dotNL = max(dot(tsNormal, tsLight), ZERO);
  color += dotNL * materialDiffuse.rgb * lightColor.rgb;

  // apply texture before specular
  color *= texture2D(map0, vec2(1.0 - texCoord0.x, texCoord0.y)).rgb;

  // add specular portion
  float dotVR = max(dot(tsView, tsReflect), ZERO);
  color += pow(dotVR, materialShininess) * materialSpecular.rgb * lightColor.rgb;

  // finally, set frag color
  // keep alpha as original material diffuse has
  if(renderResult == 0) {
    gl_FragColor = vec4(color * attenuation, materialDiffuse.a);
  } else {
    gl_FragColor = vec4(texture2D(map1, vec2(1.0 - texCoord0.x, texCoord0.y)).rgb, materialDiffuse.a);
  }

}