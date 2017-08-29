/**********************************************************************
 require( 'require' )
 -----------------------------------------------------------------------
 @example

 var Path = require("node://path");  // Only in NodeJS/NW.js environment.
 var Button = require("tfw.button");

 **********************************************************************/

window.require = function() {
    var modules = {};
    var definitions = {};
    var nodejs_require = typeof window.require === 'function' ? window.require : null;

    var f = function(id, body) {
        if( id.substr( 0, 7 ) == 'node://' ) {
            // Calling for a NodeJS module.
            if( !nodejs_require ) {
                throw Error( "[require] NodeJS is not available to load module `" + id + "`!" );
            }
            return nodejs_require( id.substr( 7 ) );
        }

        if( typeof body === 'function' ) {
            definitions[id] = body;
            return;
        }
        var mod;
        body = definitions[id];
        if (typeof body === 'undefined') {
            var err = new Error("Required module is missing: " + id);   
            console.error(err.stack);
            throw err;
        }
        mod = modules[id];
        if (typeof mod === 'undefined') {
            mod = {exports: {}};
            var exports = mod.exports;
            body(f, mod, exports);
            modules[id] = mod.exports;
            mod = mod.exports;
            //console.log("Module initialized: " + id);
        }
        return mod;
    };
    return f;
}();
function addListener(e,l) {
    if (window.addEventListener) {
        window.addEventListener(e,l,false);
    } else {
        window.attachEvent('on' + e, l);
    }
};

addListener(
    'DOMContentLoaded',
    function() {
        document.body.parentNode.$data = {};
        // Attach controllers.
        APP = require('main');
setTimeout(function (){if(typeof APP.start==='function')APP.start()});
var W = require('x-widget');
        W('comparator0', 'comparator', {
            slot: "drawImageBad",
            images: "sprite1, sprite2",
            loops: 10000})
        W('comparator1', 'comparator', {
            slot: "drawImageDepth",
            images: "sprite1, sprite2",
            loops: 10000})
        W('comparator2', 'comparator', {
            slot: "drawImageFast",
            images: "atlas",
            loops: 10000})
        W('comparator3', 'comparator', {
            slot: "drawImage",
            images: "sprite1, sprite2",
            loops: 10000})
        W('comparator4', 'comparator', {
            slot: "fillRect",
            images: [],
            loops: 10000})
        W('comparator5', 'comparator', {
            slot: "fillRectWithFillStyle",
            images: [],
            loops: 10000})
        W('comparator6', 'comparator', {
            slot: "fillRectWithFillStyleAndAlpha",
            images: [],
            loops: 10000})
        W('comparator7', 'comparator', {
            slot: "saveRestore",
            images: [],
            loops: 1000})
        W('comparator8', 'comparator', {
            slot: "saveRestoreFast",
            images: [],
            loops: 1000})
        W('comparator9', 'comparator', {
            slot: "rotateAndTranslate",
            images: [],
            loops: 10000})
        W('comparator10', 'comparator', {
            slot: "rotate",
            images: [],
            loops: 10000})
        W('comparator11', 'comparator', {
            slot: "translate",
            images: [],
            loops: 10000})
        W('comparator12', 'comparator', {
            slot: "fill",
            images: [],
            loops: 10000})

    }
);
