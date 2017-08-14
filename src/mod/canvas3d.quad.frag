precision mediump float;

uniform float uniGlobalAlpha;
uniform vec3 uniFillStyle;

void main() {
  gl_FragColor = vec4(uniFillStyle, uniGlobalAlpha);
}
