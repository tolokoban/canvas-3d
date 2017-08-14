"use strict";

var BPE = ( new Float32Array() ).BYTES_PER_ELEMENT;


function Canvas3D( canvas ) {
  var gl = canvas.getContext("webgl", {
    alpha: false,
    depth: true,
    stencil: false,
    antialias: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    failIfPerformanceCaveat: false
  });
  
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

  readonly( this, "gl", gl );

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

  // Program for quads.
  this._prgQuad = new Program( gl, {
    vert: GLOBAL.quadV,
    frag: GLOBAL.quadF
  });

  // Initial fillStyle is black.
  this._fillStyle = new Float32Array( [0, 0, 0] );
  // Initial globalAlpha is full opacity.
  this.globalAlpha = 1;

  // Default Z position.
  this.z = 0;

  // Attributes for a quad.
  this._vertQuad = new Float32Array([
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0
  ]);
  this._buffQuad = gl.createBuffer();

  // Transformation matrix.
  this._transform = new Float32Array([
    1, 0, 0,
    0, 1, 0,
    0, 0, 1
  ]);
}

module.exports = Canvas3D;


Canvas3D.prototype.translate = function( tx, ty ) {
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

Canvas3D.prototype.fillRect = function( x, y, w, h ) {
  this.fillQuad2D(
    x, y,
    x + w, y,
    x + w, y + h,
    x, y + h
  );
};
  
Canvas3D.prototype.fillQuad2D = function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
  var z = this.z;
  this.fillQuad3D( x1, y1, z, x2, y2, z, x3, y3, z, x4, y4, z );
};

Canvas3D.prototype.fillQuad3D = function( x1, y1, z1, x2, y2, z2, x3, y3, z3, x4, y4, z4 ) {
  var gl = this.gl;  
  var prg = this._prgQuad;
  var vert = this._vertQuad;
  var buff = this._buffQuad;
  
  vert[0] = x1;
  vert[1] = y1;
  vert[2] = z1;
  vert[3] = x2;
  vert[4] = y2;
  vert[5] = z2;
  vert[6] = x3;
  vert[7] = y3;
  vert[8] = z3;
  vert[9] = x4;
  vert[10] = y4;
  vert[11] = z4;
  
  prg.use();
  prg.$uniWidth = gl.canvas.width;
  prg.$uniHeight = gl.canvas.height;
  prg.$uniGlobalAlpha = this.globalAlpha;
  prg.$uniFillStyle = this._fillStyle;
  prg.$uniTransform = this._transform;

  prg.bindAttribs( buff, "attPosition" );
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
  if( style.charAt(0) === "#" ) {
    if( style.length === 4 ) {
      parseColorHexa3.call( this, style );
    }
    else if( style.length === 7 ) {
      parseColorHexa6.call( this, style );
    }
  }
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


///////////////////
// WebGL Program //
///////////////////


var Program = function() {
  /**
   * Creating  a  WebGL  program  for shaders  is  painful.  This  class
   * simplifies the process.
   *
   * @class Program
   *
   * Object properties starting with `$` are WebGL uniforms or attributes.
   * Uniforms behave as expected: you can read/write a value.
   * Attributes when read, return the location. And when written, enable/disabled
   * this attribute. So you read integers and writte booleans.
   *
   * @param gl - WebGL context.
   * @param codes  - Object  with two  mandatory attributes:  `vert` for
   * vertex shader and `frag` for fragment shader.
   * @param  includes  -  (optional)  If  defined,  the  `#include  foo`
   * directives  of  shaders   will  be  replaced  by   the  content  of
   * `includes.foo`.
   */
  function Program( gl, codes, includes ) {
    if ( typeof codes.vert !== 'string' ) {
      throw Error( '[webgl.program] Missing attribute `vert` in argument `codes`!' );
    }
    if ( typeof codes.frag !== 'string' ) {
      throw Error( '[webgl.program] Missing attribute `frag` in argument `codes`!' );
    }

    codes = parseIncludes( codes, includes );

    this.gl = gl;
    Object.freeze( this.gl );

    this._typesNamesLookup = getTypesNamesLookup( gl );

    var shaderProgram = gl.createProgram();
    gl.attachShader( shaderProgram, getVertexShader( gl, codes.vert ) );
    gl.attachShader( shaderProgram, getFragmentShader( gl, codes.frag ) );
    gl.linkProgram( shaderProgram );

    this.program = shaderProgram;
    Object.freeze( this.program );

    this.use = function () {
      gl.useProgram( shaderProgram );
    };
    this.use();

    createAttributes( this, gl, shaderProgram );
    createUniforms( this, gl, shaderProgram );
  }

  Program.prototype.getTypeName = function ( typeId ) {
    return this._typesNamesLookup[ typeId ];
  };

  Program.prototype.bindAttribs = function ( buffer ) {
    var gl = this.gl;
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    var names = Array.prototype.slice.call( arguments, 1 );
    var totalSize = 0;
    names.forEach( function ( name ) {
      var attrib = this.attribs[ name ];
      if ( !attrib ) {
        throw "Cannot find attribute \"" + name + "\"!\n" +
          "It may be not active because unused in the shader.\n" +
          "Available attributes are: " + Object.keys( this.attribs ).map( function ( name ) {
            return '"' + name + '"';
          } ).join( ", " );
      }
      totalSize += ( attrib.size * attrib.length ) * BPE;
    }, this );
    var offset = 0;
    names.forEach( function ( name ) {
      var attrib = this.attribs[ name ];
      gl.enableVertexAttribArray( attrib.location );
      gl.vertexAttribPointer(
        attrib.location,
        attrib.size * attrib.length,
        gl.FLOAT,
        false, // No normalisation.
        totalSize,
        offset
      );
      offset += ( attrib.size * attrib.length ) * BPE;
    }, this );
  };


  function createAttributes( that, gl, shaderProgram ) {
    var index, item;
    var attribs = {};
    var attribsCount = gl.getProgramParameter( shaderProgram, gl.ACTIVE_ATTRIBUTES );
    for ( index = 0; index < attribsCount; index++ ) {
      item = gl.getActiveAttrib( shaderProgram, index );
      item.typeName = that.getTypeName( item.type );
      item.length = getSize.call( that, gl, item );
      item.location = gl.getAttribLocation( shaderProgram, item.name );
      console.info( "item=", item );
      attribs[ item.name ] = item;
    }

    that.attribs = attribs;
    Object.freeze( that.attribs );
  }

  function createAttributeSetter( gl, item, shaderProgram ) {
    console.info( "item=", item );
    var name = item.name;
    return function ( v ) {
      if ( typeof v !== 'boolean' ) {
        throw "[webgl.program::$" + name +
          "] Value must be a boolean: true if you want to enable this attribute, and false to disable it.";
      }
      if ( v ) {
        console.log( "enableVertexAttribArray(", gl.getAttribLocation( shaderProgram, name ), ")" );
        gl.enableVertexAttribArray(
          gl.getAttribLocation( shaderProgram, name )
        );
      } else {
        gl.disableVertexAttribArray(
          gl.getAttribLocation( shaderProgram, name )
        );
      }
    };
  }

  function createAttributeGetter( gl, item, shaderProgram ) {
    var loc = gl.getAttribLocation( shaderProgram, item.name );
    return function () {
      return loc;
    };
  }

  function createUniforms( that, gl, shaderProgram ) {
    var index, item;
    var uniforms = {};
    var uniformsCount = gl.getProgramParameter( shaderProgram, gl.ACTIVE_UNIFORMS );
    for ( index = 0; index < uniformsCount; index++ ) {
      item = gl.getActiveUniform( shaderProgram, index );
      uniforms[ item.name ] = gl.getUniformLocation( shaderProgram, item.name );
      Object.defineProperty( that, '$' + item.name, {
        set: createUniformSetter( gl, item, uniforms[ item.name ], that._typesNamesLookup ),
        get: createUniformGetter( item ),
        enumerable: true,
        configurable: false
      } );
    }
    that.uniforms = uniforms;
    Object.freeze( that.uniforms );
  }

  /**
   * This is a preprocessor for shaders.
   * Directives  `#include`  will be  replaced  by  the content  of  the
   * correspondent attribute in `includes`.
   */
  function parseIncludes( codes, includes ) {
    var result = {};
    var id, code;
    for ( id in codes ) {
      code = codes[ id ];
      result[ id ] = code.split( '\n' ).map( function ( line ) {
        if ( line.trim().substr( 0, 8 ) != '#include' ) return line;
        var pos = line.indexOf( '#include' ) + 8;
        var includeName = line.substr( pos ).trim();
        // We accept all this systaxes:
        // #include foo
        // #include 'foo'
        // #include <foo>
        // #include "foo"
        if ( "'<\"".indexOf( includeName.charAt( 0 ) ) > -1 ) {
          includeName = includeName.substr( 1, includeName.length - 2 );
        }
        var snippet = includes[ includeName ];
        if ( typeof snippet !== 'string' ) {
          console.error( "Include <" + includeName + "> not found in ", includes );
          throw Error( "Include not found in shader: " + includeName );
        }
        return snippet;
      } ).join( "\n" );
    }
    return result;
  }


  function createUniformSetter( gl, item, nameGL, lookup ) {
    var nameJS = '_$' + item.name;

    switch ( item.type ) {
    case gl.BYTE:
    case gl.UNSIGNED_BYTE:
    case gl.SHORT:
    case gl.UNSIGNED_SHORT:
    case gl.INT:
    case gl.UNSIGNED_INT:
    case gl.SAMPLER_2D: // For textures, we specify the texture unit.
      if ( item.size == 1 ) {
        return function ( v ) {
          gl.uniform1i( nameGL, v );
          this[ nameJS ] = v;
        };
      } else {
        return function ( v ) {
          gl.uniform1iv( nameGL, v );
          this[ nameJS ] = v;
        };
      }
      break;
    case gl.FLOAT:
      if ( item.size == 1 ) {
        return function ( v ) {
          gl.uniform1f( nameGL, v );
          this[ nameJS ] = v;
        };
      } else {
        return function ( v ) {
          gl.uniform1fv( nameGL, v );
          this[ nameJS ] = v;
        };
      }
      break;
    case gl.FLOAT_VEC3:
      if ( item.size == 1 ) {
        return function ( v ) {
          gl.uniform3fv( nameGL, v );
          this[ nameJS ] = v;
        };
      } else {
        throw Error(
          "[webgl.program.createWriter] Don't know how to deal arrays of FLOAT_VEC3 in uniform `" +
            item.name + "'!'"
        );
      }
      break;
    case gl.FLOAT_MAT3:
      if ( item.size == 1 ) {
        return function ( v ) {
          gl.uniformMatrix3fv( nameGL, false, v );
          this[ nameJS ] = v;
        };
      } else {
        throw Error(
          "[webgl.program.createWriter] Don't know how to deal arrays of FLOAT_MAT3 in uniform `" +
            item.name + "'!'"
        );
      }
      break;
    case gl.FLOAT_MAT4:
      if ( item.size == 1 ) {
        return function ( v ) {
          gl.uniformMatrix4fv( nameGL, false, v );
          this[ nameJS ] = v;
        };
      } else {
        throw Error(
          "[webgl.program.createWriter] Don't know how to deal arrays of FLOAT_MAT4 in uniform `" +
            item.name + "'!'"
        );
      }
      break;
    default:
      throw Error(
        "[webgl.program.createWriter] Don't know how to deal with uniform `" +
          item.name + "` of type " + lookup[ item.type ] + "!"
      );
    }
  }

  function createUniformGetter( item ) {
    var name = '_$' + item.name;
    return function () {
      return this[ name ];
    };
  }


  function getShader( type, gl, code ) {
    var shader = gl.createShader( type );
    gl.shaderSource( shader, code );
    gl.compileShader( shader );
    if ( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
      console.log( code );
      console.error( "An error occurred compiling the shader: " + gl.getShaderInfoLog( shader ) );
      return null;
    }

    return shader;
  }

  function getFragmentShader( gl, code ) {
    return getShader( gl.FRAGMENT_SHADER, gl, code );
  }

  function getVertexShader( gl, code ) {
    return getShader( gl.VERTEX_SHADER, gl, code );
  }

  function getTypesNamesLookup( gl ) {
    var lookup = {};
    var k, v;
    for ( k in gl ) {
      v = gl[ k ];
      if ( typeof v === 'number' ) {
        lookup[ v ] = k;
      }
    }
    return lookup;
  }

  function getSize( gl, item ) {
    switch ( item.type ) {
    case gl.FLOAT_VEC4:
      return 4;
    case gl.FLOAT_VEC3:
      return 3;
    case gl.FLOAT_VEC2:
      return 2;
    case gl.FLOAT:
      return 1;
    default:
      throw "[webgl.program:getSize] I don't know the size of the attribute '" + item.name +
        "' because I don't know the type " + this.getTypeName( item.type ) + "!";
    }
  }

  return Program;
}();
