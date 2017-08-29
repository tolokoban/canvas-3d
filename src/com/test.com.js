"use strict";

/**
 * Component page
 */

exports.tags = [ "test:[a-zA-Z0-9_-]+" ];
exports.priority = 0;

/**
 * Compile a node of the HTML tree.
 */
exports.compile = function( root, libs ) {
  var TAG = libs.Tree.TAG;
  var att = root.attribs || {};
  var testName = root.name.substr( 5 );
  root.name = 'div';
  var loops = parseInt( root.attribs.loops );
  if( isNaN( loops ) ) loops = 10000;
  var children = [
    {
      type: TAG,
      name: 'x-code',
      attribs: {
        src: "mod/main.js",
        lang: "js",
        section: testName
      }
    },
    {
      type: TAG,
      name: 'x-widget',
      attribs: {
        name: "comparator",
        $slot: testName,
        $images: root.attribs.images || [],
        $loops: loops
      }
    }
  ];
  root.attribs = { "class": root.attribs.class };
  root.children = children;
  libs.compile( root );
  
};
