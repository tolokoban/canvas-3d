/** @module canvas-3d.sprite */require( 'canvas-3d.sprite', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
 var GLOBAL = {
  "vert": "uniform mat3 uniTransform;\r\nuniform float uniWidth;\r\nuniform float uniHeight;\r\n\r\nattribute vec3 attPosition;\r\nattribute vec3 attUVA;\r\nvarying vec3 varUVA;\r\n\r\nvoid main() {\r\n  varUVA = attUVA;\r\n  \r\n  vec3 pos = uniTransform * vec3( attPosition.xy, 1.0 );\r\n  gl_Position = vec4( pos.xy, attPosition.z, 1.0 );\r\n\r\n  // Convert pixels to WebGL space coords.\r\n  gl_Position.x = 2.0 * gl_Position.x / uniWidth - 1.0;\r\n  gl_Position.y = 1.0 - 2.0 * gl_Position.y / uniHeight;\r\n}\r\n",
  "frag": "precision lowp float;\r\n\r\nvarying vec3 varUVA;\r\n\r\n// Textures.\r\nuniform sampler2D tex;\r\n\r\nvoid main() { \r\n  gl_FragColor = texture2D(tex, varUVA.xy);\r\n  gl_FragColor.a *= varUVA.z;\r\n  if( gl_FragColor.a < 0.01 ) discard;\r\n}\r\n"};
  "use strict";

var Program = require("canvas-3d.program");

var NB_TRI = 256;
var ELEM_MAX_LEN = NB_TRI * 3;
var NB_ATT = 6;  // X, Y, Z, U, V, A.

function Sprite( canvas3D, image ) {
  var gl = canvas3D.gl;
  this._gl = gl;

  this._canvas3 = canvas3D;
  this._texture = createTexture( gl, image );
  image.$sprite = this;
  
  this._vertData = new Float32Array( NB_ATT * NB_TRI * 3 );
  this._vertBuff = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, this._vertBuff );
  gl.bufferData( gl.ARRAY_BUFFER, this._vertData, gl.DYNAMIC_DRAW );

  this._elemData = new Uint16Array( NB_TRI * 3 );
  this._elemBuff = gl.createBuffer();
  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._elemBuff );
  gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this._elemData, gl.DYNAMIC_DRAW );

  // Index of the next free vertex for use in `_elem`.
  this._idxVert = 0;
  // Pointer on the next free vertex.
  this._ptrVert = 0;
  // Pointer on the next free element.
  this._ptrElem = 0;

  this._prg = new Program( gl, {
    vert: GLOBAL.vert,
    frag: GLOBAL.frag
  });
}

module.exports = Sprite;


Sprite.prototype.flush = function() {
  if( this._ptrElem === 0 ) return false;

  var c3 = this._canvas3;
  var gl = this._gl;
  var prg = this._prg;
  var vertData = this._vertData;
  var vertBuff = this._vertBuff;
  var elemBuff = this._elemBuff;
  var elemData = this._elemData;

  prg.use();
  prg.$uniWidth = gl.canvas.width;
  prg.$uniHeight = gl.canvas.height;
  prg.$uniTransform = c3._transform;

  // Textures.
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, this._texture );
  prg.$tex = 0;

  prg.bindAttribs( vertBuff, "attPosition", "attUVA" );
  gl.bindBuffer( gl.ARRAY_BUFFER, vertBuff );
  gl.bufferSubData( gl.ARRAY_BUFFER, 0, vertData );

  gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, elemBuff );
  gl.bufferSubData( gl.ELEMENT_ARRAY_BUFFER, 0, elemData );

  gl.drawElements( gl.TRIANGLES, this._ptrElem, gl.UNSIGNED_SHORT, 0 );

  this._idxVert = 0;
  this._ptrVert = 0;
  this._ptrElem = 0;
  return true;
};


Sprite.prototype.paint = function( x1, y1, z1, u1, v1, a1,
                                   x2, y2, z2, u2, v2, a2,
                                   x3, y3, z3, u3, v3, a3,
                                   x4, y4, z4, u4, v4, a4 ) {
  if( this._ptrElem >= ELEM_MAX_LEN - 6 ) {
    // If there is no space for two new triangles, just flush the buffer.
    this.flush();
  }

  var idxVert = this._idxVert;
  var ptrVert = this._ptrVert;
  var ptrElem = this._ptrElem;

  // Vertex 0.
  this._vertData[ptrVert + 0] = x1;
  this._vertData[ptrVert + 1] = y1;
  this._vertData[ptrVert + 2] = z1;
  this._vertData[ptrVert + 3] = u1;
  this._vertData[ptrVert + 4] = v1;
  this._vertData[ptrVert + 5] = a1;
  // Vertex 1.
  this._vertData[ptrVert + 6] = x2;
  this._vertData[ptrVert + 7] = y2;
  this._vertData[ptrVert + 8] = z2;
  this._vertData[ptrVert + 9] = u2;
  this._vertData[ptrVert + 10] = v2;
  this._vertData[ptrVert + 11] = a2;
  // Vertex 2.
  this._vertData[ptrVert + 12] = x3;
  this._vertData[ptrVert + 13] = y3;
  this._vertData[ptrVert + 14] = z3;
  this._vertData[ptrVert + 15] = u3;
  this._vertData[ptrVert + 16] = v3;
  this._vertData[ptrVert + 17] = a3;
  // Vertex 3.
  this._vertData[ptrVert + 18] = x4;
  this._vertData[ptrVert + 19] = y4;
  this._vertData[ptrVert + 20] = z4;
  this._vertData[ptrVert + 21] = u4;
  this._vertData[ptrVert + 22] = v4;
  this._vertData[ptrVert + 23] = a4;

  this._elemData[ptrElem + 0] = idxVert + 0;
  this._elemData[ptrElem + 1] = idxVert + 1;
  this._elemData[ptrElem + 2] = idxVert + 2;
  this._elemData[ptrElem + 3] = idxVert + 0;
  this._elemData[ptrElem + 4] = idxVert + 2;
  this._elemData[ptrElem + 5] = idxVert + 3;

  this._idxVert += 4;
  this._ptrVert += 24;
  this._ptrElem += 6;
};


function createTexture( gl, img ) {
  var texture = gl.createTexture();

  // Définir les paramètres de répétition.
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
  gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

  // Charger les données de l'image dans la carte graphique.
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, texture );
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
    gl.RGBA, gl.UNSIGNED_BYTE,
    img );

  img.$texture = texture;
  return img.$texture;
};


  
module.exports._ = _;
/**
 * @module canvas-3d.sprite
 * @see module:$
 * @see module:canvas-3d.program

 */
});