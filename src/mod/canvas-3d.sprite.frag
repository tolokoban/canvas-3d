precision lowp float;

varying vec3 varUVA;

// Textures.
uniform sampler2D tex;

void main() { 
  gl_FragColor = texture2D(tex, varUVA.xy);
  gl_FragColor.a *= varUVA.z;
  if( gl_FragColor.a < 0.01 ) discard;
}
