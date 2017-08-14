precision mediump float;

uniform float uniGlobalAlpha;

varying vec2 varUV;

// Textures.
uniform sampler2D tex;

void main() { 
  gl_FragColor = texture2D(tex, varUV);
  gl_FragColor.a *= uniGlobalAlpha;
  if( gl_FragColor.a < 0.01 ) discard;
}
