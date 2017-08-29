/** @module comparator */require( 'comparator', function(require, module, exports) { var _=function(){var D={"en":{},"fr":{}},X=require("$").intl;function _(){return X(D,arguments);}_.all=D;return _}();
    "use strict";

var $ = require("dom");
var DB = require("tfw.data-binding");
<<<<<<< HEAD
var Modal = require("wdg.modal");
=======
>>>>>>> eef1bd074c4f25918e1758ec902d99e84e2235e4
var Button = require("wdg.button");
var Canvas3D = require("canvas-3d");

var WIDTH = 340;
var HEIGHT = 200;


/**
 * @class Comparator
 *
 * @param {boolean} opts.visible - Set the visiblity of the component.
 *
 * @example
 * var Comparator = require("comparator");
 * var instance = new Comparator({visible: false});
 */
var Comparator = function(opts) {
  var that = this;

  var canvas1 = $.tag( "canvas", "thm-ele2", {
    width: WIDTH, height: HEIGHT
  });
  var canvas2 = $.tag( "canvas", "thm-ele2", {
    width: WIDTH, height: HEIGHT
  });
  var btnCompare = new Button({
    flat: true,
    wide: true,
    icon: "gear",
    text: "Start a speed test"
  });
  var divResult = $.div();
  var elem = $.elem( this, 'div', 'comparator', [
    $.div( "flex", [canvas1, canvas2] ),
    $.div( "flex", [btnCompare, divResult] ),
  ] );

  DB.prop( this, 'slot' )(function(slot) {
    if( typeof slot === "string" ) {
      slot = APP[slot];
    }
    if( typeof slot === "function" ) {
      loadImages( that.images ).then(function( images ) {
<<<<<<< HEAD
        var ctx1 = Canvas3D.getContext2D( canvas1 );
        try {
          slot( ctx1, images );
          ctx1.flush();
=======
        var ctx1 = canvas1.getContext("2d");
        try {
          slot( ctx1, images );
>>>>>>> eef1bd074c4f25918e1758ec902d99e84e2235e4
        } catch( ex ) {
          console.error( Error( ex ) );
        }
        var ctx2 = new Canvas3D( canvas2 );
        try {
          slot( ctx2, images );
<<<<<<< HEAD
          ctx2.flush();
=======
>>>>>>> eef1bd074c4f25918e1758ec902d99e84e2235e4
        } catch( ex ) {
          console.error( Error( ex ) );
        }
      });
    }
  });

  DB.propStringArray( this, 'images' );

  btnCompare.on(function() {
    var slot = that.slot;
    if( typeof slot === "string" ) {
      slot = APP[slot];
    }

    var c1 = document.createElement("canvas");
<<<<<<< HEAD
    c1.setAttribute("class", "thm-ele8");
    c1.setAttribute("width", WIDTH);
    c1.setAttribute("height", HEIGHT);
    var c2 = document.createElement("canvas");
    c2.setAttribute("class", "thm-ele8");
    c2.setAttribute("width", WIDTH);
    c2.setAttribute("height", HEIGHT);

    var btnClose = Button.Close();
    var divResultModal = $.div(["---"]);
    
    var modal = new Modal({
      header: "Test de vitesses comparées",
      content: [c1, $.tag("br"), c2],
      footer: [divResultModal, btnClose]
    });
    modal.attach();
    btnClose.on( modal.detach.bind( modal ) );

    var ctx1 = Canvas3D.getContext2D( c1 );
    var ctx2 = new Canvas3D( c2 );
    var time1;
    var time2;
    var LOOPS = that.loops;
    var loop;

    divResult.textContent = "---";
    divResultModal.textContent = "---";
    btnCompare.enabled = false;
    btnClose.enabled = false;

    window.setTimeout(function() {
      loadImages( that.images ).then(function( images ) {
        loop = LOOPS;
        time1 = window.performance.now();
        while( loop --> 0 ) {
          slot( ctx1, images );
        }
        ctx1.flush();
        time1 = window.performance.now() - time1;

        loop = LOOPS;
        time2 = window.performance.now();
        while( loop --> 0 ) {
          slot( ctx2, images );
        }
        ctx2.flush();
        time2 = window.performance.now() - time2;

        var result = Math.floor( 0.5 + 100 * (time1 / time2) );
        divResult.textContent = result + " %";
        divResultModal.textContent = Math.floor(0.5 + time1) + " / " + Math.floor(0.5 + time2 )
          + " = " + result.toFixed(2) + " %";
        btnCompare.enabled = true;
        btnClose.enabled = true;
      });
    }, 400);
=======
    c1.setAttribute("width", WIDTH);
    c1.setAttribute("height", HEIGHT);
    var c2 = document.createElement("canvas");
    c2.setAttribute("width", WIDTH);
    c2.setAttribute("height", HEIGHT);
    var ctx1 = c1.getContext("2d");
    var ctx2 = c2.getContext("2d");
    var time1;
    var time2;
    var LOOPS = 10000;
    var loop;

    divResult.textContent = "---";
    btnCompare.enabled = false;

    loadImages( that.images ).then(function( images ) {
      loop = LOOPS;
      time2 = window.performance.now();
      while( loop --> 0 ) {
        slot( ctx2, images );
      }
      time2 = window.performance.now() - time2;

      loop = LOOPS;
      time1 = window.performance.now();
      while( loop --> 0 ) {
        slot( ctx1, images );
      }
      time1 = window.performance.now() - time1;

      var result = Math.floor( 0.5 + 100 * (time2 / time1) );
      divResult.textContent = result + " %";
      btnCompare.enabled = true;
    });
>>>>>>> eef1bd074c4f25918e1758ec902d99e84e2235e4
  });

  opts = DB.extend({
    images: [],
<<<<<<< HEAD
    loops: 10000,
=======
>>>>>>> eef1bd074c4f25918e1758ec902d99e84e2235e4
    slot: null
  }, opts, this);
};


module.exports = Comparator;



function loadImages( images ) {
  var result = {};
  return new Promise(function (resolve, reject) {
    if( !Array.isArray( images ) || images.length === 0 ) {
      resolve( result );
      return;
    }

    var count = images.length;
    images.forEach(function (src) {
      var img = new Image();
      img.onload = function() {
        result[src] = img;
        count--;
        if( count <= 0 ) {
          resolve( result );
        }
      };
      img.onerror = function() {
        console.error( "Unable to load image: ", src );
        count--;
        if( count <= 0 ) {
          resolve( result );
        }
      };
      img.src = "css/main/" + src + ".png";
    });
  });
}


  
module.exports._ = _;
/**
 * @module comparator
 * @see module:$
 * @see module:dom
 * @see module:tfw.data-binding
<<<<<<< HEAD
 * @see module:wdg.modal
=======
>>>>>>> eef1bd074c4f25918e1758ec902d99e84e2235e4
 * @see module:wdg.button
 * @see module:canvas-3d

 */
});