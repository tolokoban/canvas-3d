"use strict";

var Program = require("canvas-3d.program");

var NB_TRI = 200;
var ELEM_MAX_LEN = NB_TRI * 3;
var NB_ATT = 6;  // X, Y, Z, R, G, B.

function Mesh( canvas3D ) {
  var gl = canvas3D.gl;
  this._gl = gl;
  
  this._canvas3 = canvas3D;
  
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

module.exports = Mesh;


Mesh.prototype.flush = function() {
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
  prg.$uniGlobalAlpha = c3.globalAlpha;
  prg.$uniTransform = c3._transform;

  prg.bindAttribs( vertBuff, "attPosition", "attColor" );
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


Mesh.prototype.rect = function( x, y, z, w, h, r, g, b ) {
  if( this._ptrElem >= ELEM_MAX_LEN - 6 ) {
    // If there is no space for two new triangles, just flush the buffer.
    this.flush();
  }

  var idxVert = this._idxVert;
  var ptrVert = this._ptrVert;
  var ptrElem = this._ptrElem;

  // Vertex 0.
  this._vertData[ptrVert + 0] = x;
  this._vertData[ptrVert + 1] = y;
  this._vertData[ptrVert + 2] = z;
  this._vertData[ptrVert + 3] = r;
  this._vertData[ptrVert + 4] = g;
  this._vertData[ptrVert + 5] = b;
  // Vertex 1.
  this._vertData[ptrVert + 6] = x + w;
  this._vertData[ptrVert + 7] = y;
  this._vertData[ptrVert + 8] = z;
  this._vertData[ptrVert + 9] = r;
  this._vertData[ptrVert + 10] = g;
  this._vertData[ptrVert + 11] = b;
  // Vertex 2.
  this._vertData[ptrVert + 12] = x + w;
  this._vertData[ptrVert + 13] = y + h;
  this._vertData[ptrVert + 14] = z;
  this._vertData[ptrVert + 15] = r;
  this._vertData[ptrVert + 16] = g;
  this._vertData[ptrVert + 17] = b;
  // Vertex 3.
  this._vertData[ptrVert + 18] = x;
  this._vertData[ptrVert + 19] = y + h;
  this._vertData[ptrVert + 20] = z;
  this._vertData[ptrVert + 21] = r;
  this._vertData[ptrVert + 22] = g;
  this._vertData[ptrVert + 23] = b;

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
