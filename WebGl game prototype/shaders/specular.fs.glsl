#version 300 es

precision mediump float;

out vec4 fragColor;

uniform sampler2D base_text;
uniform sampler2D specular_text;

uniform vec3 material_specular;
uniform float shininess;

uniform bool use_spec_map;

uniform vec3 viewPos;

uniform vec3 pointLightPosition;
uniform vec3 ambient;
uniform vec3 light_specular;
// uniform vec3 diffuse_intensity;

in vec2 fragTextCoord;
in vec3 fPos;
in vec3 fNorm;

void main() {
  //ambient
  vec3 ambient = ambient * texture(base_text, fragTextCoord).rgb;

  //diffuse
  vec3 norm = normalize(fNorm);
  vec3 lightDir = normalize(pointLightPosition - fPos);
  float diff = max(dot(norm, lightDir), 0.0f);
  vec3 diffuse = vec3(1.0f, 1.0f, 1.0f) * diff * texture(base_text, fragTextCoord).rgb;

  //specular
  vec3 viewDir = normalize(viewPos - fPos);
  vec3 reflectDir = reflect(-lightDir, norm);
  float spec = pow(max(dot(viewDir, reflectDir), 0.0f), shininess);
  vec3 specular;
  if(use_spec_map == true) {
    specular = light_specular * spec * vec3(texture(specular_text, fragTextCoord));
  } else {
    specular = light_specular * (spec * material_specular);
  }

  vec3 result = ambient + diffuse + specular;

  fragColor = vec4(result, 1.0f);
}