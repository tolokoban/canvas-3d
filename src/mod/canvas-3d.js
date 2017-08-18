"use strict";

var Mesh = require("canvas-3d.mesh");
var Program = require("canvas-3d.program");

var EMPTY = function() {};

// An  error message  is  displayed  in the  console  when  a not  yet
// implemented method  or property is  used. But to  prevent reporting
// many times the  same error, we use  this map to store  what we have
// already reported.
var NOT_IMPLEMENTED = {};

var Canvas3D = function( canvas ) {
  var that = this;

  var gl = canvas.getContext("webgl", {
    alpha: false,
    depth: true,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    failIfPerformanceCaveat: false
  });
  this._gl = gl;
  
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  readonly( this, "gl", gl );
  readonly( this, "canvas", canvas );

  prop( this, 'depthTest', function() {
    return this._depthTest;
  }, function(v) {
    if( v ) {
      gl.enable( gl.DEPTH_TEST );
      gl.depthFunc( gl.LEQUAL );
      this._depthTest = true;
    } else {
      gl.disable( gl.DEPTH_TEST );
      this._depthTest = false;
    }
  });

  prop( this, "globalAlpha", function() {
    return this._globalAlpha;
  }, function( alpha ) {
    this._globalAlpha = alpha;
    gl.enable( gl.BLEND );
    if( alpha < 0.0001 ) {
      gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE );
    } else {
      // Il  faut que  la couleur  finale ait  un alpha  de 1.   C'est
      // pourquoi on utilise cette astuce  de la couleur constante qui
      // est l'inverse de l'alpha de la source.
      gl.blendColor( 0, 0, 0, alpha );
      gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA );
      gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ZERO, gl.ONE );
    }
  });

  prop( this, 'fillStyle', function() {
    return this._fillStyleName || "#000";
  }, parseColor );

  //--------------------
  // Modules for meshes.
  this._mesh = new Mesh( this );

  //--------------------
  // Program for images.
  this._prgImage = new Program( gl, {
    vert: GLOBAL.imageV,
    frag: GLOBAL.imageF
  });

  // Attributes for a image.
  this._vertImage = new Float32Array([
    0, 0, 0, 0, 0,
    0, 0, 0, 1, 0,
    0, 0, 0, 1, 1,
    0, 0, 0, 0, 1
  ]);
  this._buffImage = gl.createBuffer();

  // Initial fillStyle is black.
  this._fillStyle = new Float32Array( [0, 0, 0] );
  // Initial globalAlpha is full opacity.
  this.globalAlpha = 1;

  // Default Z position.
  this.z = 0;

  // Transformation matrix.
  this._transform = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ]);

  // Current Path.
  this._path = new Path( this );

  // Context for save() / restore().
  this._contextStack = [];

  // Show error message for not yet implemented properties.
  [
    "currentTransform",
    "direction",
    "filter",
    "font",
    "globalCompositeOperation",
    //"imageSmoothingEnabled",
    "imageSmoothingQuality",
    "lineCap",
    "lineDashOffset",
    "lineJoin",
    "lineWidth",
    "miterLimit",
    "shadowBlur",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY",
    "strokeStyle",
    "textAlign",
    "textBaseline"
  ].forEach(function(propName) {
    prop( that, propName, function() {
      if( NOT_IMPLEMENTED[propName] ) return;
      NOT_IMPLEMENTED[propName] = 1;
      console.error( Error("[Canvas3D] Property not yet implemented: " + propName) );
    }, function(v) {
      if( NOT_IMPLEMENTED[propName] ) return;
      NOT_IMPLEMENTED[propName] = 1;
      console.error( Error("[Canvas3D] Property not yet implemented: " + propName) );
    });
  });
};

Canvas3D.getContext2D = function( canvas ) {
  var ctx = canvas.getContext("2d");
  ctx.resize = function( resolution ) {
    if ( typeof resolution !== 'number' ) {
      resolution = window.devicePixelRatio;
    }
    var displayWidth = Math.floor( canvas.clientWidth * resolution );
    var displayHeight = Math.floor( canvas.clientHeight * resolution );

    // Check if the canvas is not the same size.
    if ( canvas.width !== displayWidth ||
         canvas.height !== displayHeight ) {
      // Make the canvas the same size
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  };

  ctx.flush = EMPTY;

  ctx.clearScreen = function() {
    ctx.fillRect( 0, 0, canvas.width, canvas.height );
  };

  ctx.paintQuad = function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
    ctx.beginPath();
    ctx.moveTo( x1, y1 );
    ctx.lineTo( x2, y2 );
    ctx.lineTo( x3, y3 );
    ctx.lineTo( x4, y4 );
    ctx.fill();
  };
  
  return ctx;
};


module.exports = Canvas3D;

[
  "addHitRegion",
  "arc",
  "arcTo",
  "bezierCurveTo",
  "clearHitRegions",
  "clearRect",
  "clip",
  "createImageData",
  "createLinearGradient",
  "createPattern",
  "createRadialGradient",
  "drawFocusIfNeeded",
  "drawWidgetAsOnScreen",
  "drawWindow",
  "ellipse",
  "fillText",
  "getImageData",
  "getLineDash",
  "isPointInPath",
  "isPointInStroke",
  "measureText",
  "putImageData",
  "quadraticCurveTo",
  "rect",
  "removeHitRegion",
  "resetTransform",
  "scrollPathIntoView",
  "setLineDash",
  "setTransform",
  "stroke",
  "strokeRect",
  "strokeText",
  "transform"
].forEach(function( methodName ) {
  Canvas3D.prototype[methodName] = function() {
    if( NOT_IMPLEMENTED[methodName] ) return;
    NOT_IMPLEMENTED[methodName] = 1;
    console.error( Error("[Canvas3D] Not implemented yet: " + methodName + "()") );
  };
});

Canvas3D.prototype.flush = function() {
  this._mesh.flush();
};

/**
 * Clear the whole screen with the `fillStyle` color.
 */
Canvas3D.prototype.clearScreen = function() {
  var gl = this._gl;
  var color = this._fillStyle;
  gl.clearColor( color[0], color[1], color[2], this.globalAlpha );
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
};

Canvas3D.prototype.resize = function( resolution ) {
  var gl = this.gl;
  if ( typeof resolution !== 'number' ) {
    resolution = window.devicePixelRatio;
  }
  var displayWidth = Math.floor( gl.canvas.clientWidth * resolution );
  var displayHeight = Math.floor( gl.canvas.clientHeight * resolution );

  // Check if the canvas is not the same size.
  if ( gl.canvas.width !== displayWidth ||
       gl.canvas.height !== displayHeight ) {

    // Make the canvas the same size
    gl.canvas.width = displayWidth;
    gl.canvas.height = displayHeight;
    gl.viewport( 0, 0, displayWidth, displayHeight );
  }
};

Canvas3D.prototype.beginPath = function() {
  this._path = new Path( this );
};

Canvas3D.prototype.moveTo = function(x, y) {
  this._path.moveTo(x, y, this.z);
};

Canvas3D.prototype.lineTo = function(x, y) {
  this._path.lineTo(x, y, this.z);
};

Canvas3D.prototype.closePath = function() {
  this._path.closePath();
};

Canvas3D.prototype.fill = function() {
  this._path.fill();
};

Canvas3D.prototype.scale = function( sx, sy ) {
  this.flush();

  var t = this._transform;
  var m11 = t[0];
  var m21 = t[1];
  var m31 = t[2];
  var m12 = t[3];
  var m22 = t[4];
  var m32 = t[5];

  t[0] = sx * m11;
  t[1] = sx * m21;
  t[2] = sx * m31;
  t[3] = sy * m12;
  t[4] = sy * m22;
  t[5] = sy * m32;
};

Canvas3D.prototype.translate = function( tx, ty ) {
  this.flush();

  var t = this._transform;
  var m11 = t[0];
  var m21 = t[1];
  var m31 = t[2];
  var m12 = t[3];
  var m22 = t[4];
  var m32 = t[5];
  var m13 = t[6];
  var m23 = t[7];
  var m33 = t[8];

  t[6] = tx * m11 + ty * m12 + m13;
  t[7] = tx * m21 + ty * m22 + m23;
  t[8] = tx * m31 + ty * m32 + m33;
};

Canvas3D.prototype.rotate = function( a ) {
  this.flush();
  
  var t = this._transform;
  var m11 = t[0];
  var m21 = t[1];
  var m31 = t[2];
  var m12 = t[3];
  var m22 = t[4];
  var m32 = t[5];
  var m13 = t[6];
  var m23 = t[7];
  var m33 = t[8];

  var c = Math.cos( -a );
  var s = Math.sin( -a );

  t[0] = c*m11 - s*m12;
  t[1] = c*m21 - s*m22;
  t[2] = c*m31 - s*m32;
  t[3] = s*m11 + c*m12;
  t[4] = s*m21 + c*m22;
  t[5] = s*m31 + c*m32;
};

Canvas3D.prototype.save = function() {
  this._contextStack.push({
    globalAlpha: this.globalAlpha,
    fillStyle: new Float32Array( this._fillStyle ),
    transform: new Float32Array( this._transform )
  });
};

Canvas3D.prototype.restore = function() {
  if( this._contextStack.length === 0 ) return;
  this.flush();
  
  var context = this._contextStack.pop();

  this.globalAlpha = context.globalAlpha;
  this._fillStyle = context.fillStyle;
  this._transform = context.transform;
};

Canvas3D.prototype.fillRect = function( x, y, w, h ) {
  var z = this.z;
  var c = this._fillStyle;
  this._mesh.rect( x, y, z, w, h, c[0], c[1], c[2] );
};

Canvas3D.prototype.paintQuad = function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
  var z = this.z;
  var c = this._fillStyle;
  this._mesh.quad(
    x1, y1, z,
    x2, y2, z,
    x3, y3, z,
    x4, y4, z,
    c[0], c[1], c[2]  );
};

Canvas3D.prototype.createTexture = function( img ) {
  if( !img.$texture ) {
    var gl = this.gl;
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
  }
  return img.$texture;
};

Canvas3D.prototype.deleteTexture = function( img ) {
  if( img.$texture ) {
    this.gl.deleteTexture( img.$texture );
    delete img.$texture;
  }
};

Canvas3D.prototype.drawImage = function( img, x, y ) {
  var w = img.width;
  var h = img.height;
  var z = this.z - 0.1;

  var gl = this.gl;
  var prg = this._prgImage;
  var vert = this._vertImage;
  var buff = this._buffImage;

  vert[0] = x;
  vert[1] = y;
  vert[2] = z;
  vert[5] = x + w;
  vert[6] = y;
  vert[7] = z;
  vert[10] = x + w;
  vert[11] = y + h;
  vert[12] = z;
  vert[15] = x;
  vert[16] = y + h;
  vert[17] = z;

  prg.use();
  prg.$uniWidth = gl.canvas.width;
  prg.$uniHeight = gl.canvas.height;
  prg.$uniGlobalAlpha = this.globalAlpha;
  prg.$uniTransform = this._transform;

  // Textures.
  gl.activeTexture( gl.TEXTURE0 );
  gl.bindTexture( gl.TEXTURE_2D, this.createTexture( img ) );
  prg.$tex = 0;

  prg.bindAttribs( buff, "attPosition", "attUV" );
  gl.bindBuffer( gl.ARRAY_BUFFER, buff );
  gl.bufferData( gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW );

  gl.drawArrays( gl.TRIANGLE_FAN, 0, 4 );
};

Canvas3D.prototype.clear = function() {
  var gl = this.gl;
  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
};



function prop( object, name, get, set ) {
  Object.defineProperty( object, name, {
    get: get, set: set,
    enumerable: true,
    configurable: false
  });
}

function readonly( object, name, value ) {
  Object.defineProperty( object, name, {
    value: value,
    writable: false,
    enumerable: true,
    configurable: false
  });
}

function parseColor( style ) {
  if( typeof style !== "string" ) return;

  style = style.trim().toLowerCase();
  this._fillStyleName = style;
  if( style.charAt(0) === "#" ) {
    if( style.length === 4 ) {
      parseColorHexa3.call( this, style );
    }
    else if( style.length === 7 ) {
      parseColorHexa6.call( this, style );
    }
  } else if( style.substr( 0, 3 ) === "rgb" ) {
    parseColorRGB.call( this, style );
  } else {
    var div = document.createElement( "div" );
    div.style.color = style;
    document.body.appendChild( div );
    var result = window.getComputedStyle( div ,null).getPropertyValue('color');
    parseColorRGB.call( this, result );
    document.body.removeChild( div );
  }
}

function parseColorRGB( style ) {
  var d0 = "0".charCodeAt( 0 );
  var d9 = d0 + 9;
  var i = 3;
  var s = style.length - 1;
  // m == 0 :
  var m = 0;
  var c;
  var R = 0, G = 0, B = 0;

  // Rechercher le premier chiffre.
  while( i < s ) {
    c = style.charCodeAt( i );
    if( c >= d0 && c <= d9 ) break;
    i++;
  }

  // Lire la valeur du rouge.
  while( i < s ) {
    c = style.charCodeAt( i );
    if( c < d0 || c > d9 ) break;
    R = 10 * R + c - d0;
    i++;
  }

  // Rechercher le prochain chiffre.
  while( i < s ) {
    c = style.charCodeAt( i );
    if( c >= d0 && c <= d9 ) break;
    i++;
  }

  // Lire la valeur du rouge.
  while( i < s ) {
    c = style.charCodeAt( i );
    if( c < d0 || c > d9 ) break;
    G = 10 * G + c - d0;
    i++;
  }

  // Rechercher le prochain chiffre.
  while( i < s ) {
    c = style.charCodeAt( i );
    if( c >= d0 && c <= d9 ) break;
    i++;
  }

  // Lire la valeur du rouge.
  while( i < s ) {
    c = style.charCodeAt( i );
    if( c < d0 || c > d9 ) break;
    B = 10 * B + c - d0;
    i++;
  }

  this._fillStyle[0] = R / 255;
  this._fillStyle[1] = G / 255;
  this._fillStyle[2] = B / 255;
}

var HEXA3 = {
  "0": 0,
  "1": 1 / 15,
  "2": 2 / 15,
  "3": 3 / 15,
  "4": 4 / 15,
  "5": 5 / 15,
  "6": 6 / 15,
  "7": 7 / 15,
  "8": 8 / 15,
  "9": 9 / 15,
  "a": 10 / 15,
  "b": 11 / 15,
  "c": 12 / 15,
  "d": 13 / 15,
  "e": 14 / 15,
  "f": 1
};

function parseColorHexa3( style ) {
  this._fillStyle[0] = HEXA3[ style.charAt(1) ];
  this._fillStyle[1] = HEXA3[ style.charAt(2) ];
  this._fillStyle[2] = HEXA3[ style.charAt(3) ];
}

var HEXA6 = {
  "0": 0,
  "1": 1 / 225,
  "2": 2 / 225,
  "3": 3 / 225,
  "4": 4 / 225,
  "5": 5 / 225,
  "6": 6 / 225,
  "7": 7 / 225,
  "8": 8 / 225,
  "9": 9 / 225,
  "a": 10 / 225,
  "b": 11 / 225,
  "c": 12 / 225,
  "d": 13 / 225,
  "e": 14 / 225,
  "f": 15 / 255
};

function parseColorHexa6( style ) {
  this._fillStyle[0] = HEXA3[ style.charAt(1) ] + HEXA6[ style.charAt(2) ];
  this._fillStyle[1] = HEXA3[ style.charAt(3) ] + HEXA6[ style.charAt(4) ];
  this._fillStyle[2] = HEXA3[ style.charAt(5) ] + HEXA6[ style.charAt(6) ];
}


//////////
// Path //
//////////


function Path( canvas3D ) {
  this._canvas3D = canvas3D;
  // The (x,y,z) coords of every point of the path.
  this._points = [];
  // Points' count: this._points / 3.
  this._count = 0;
  this._currentPolyline = { indexes: [] };
  this._polylines = [this._currentPolyline];
}

Path.prototype.moveTo = function( x, y, z ) {
  if( this._currentPolyline.indexes.length > 0 ) {
    this._currentPolyline = { indexes: [] };
    this._polylines.push( this._currentPolyline );
  }
  this.lineTo( x, y, z );
};

Path.prototype.lineTo = function( x, y, z ) {
  var idx = this._count;
  this._count = idx + 1;
  this._points.push( x, y, z );
  this._currentPolyline.indexes.push( idx );
};

Path.prototype.closePath = function() {
  this._currentPolyline.closed = true;
};

Path.prototype.fill = function() {
  /*
    console.info("[mod/canvas-3d] this._polylines=", this._polylines);
    console.info("[mod/canvas-3d] this._points=", this._points);
  */

};

