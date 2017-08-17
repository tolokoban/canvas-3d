precision mediump float;

uniform float uniGlobalAlpha;

varying vec3 varColor;

void main() {
  gl_FragColor = vec4(varColor, uniGlobalAlpha);
}
