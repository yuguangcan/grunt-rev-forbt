/*
 * grunt-rev
 * https://github.com/cbas/grunt-rev
 *
 * Copyright (c) 2013 Sebastiaan Deckers
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
  path = require('path'),
  crypto = require('crypto');

module.exports = function(grunt) {

  function md5(filepath, algorithm, encoding, fileEncoding) {
    var hash = crypto.createHash(algorithm);
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    hash.update(grunt.file.read(filepath), fileEncoding);
    return hash.digest(encoding);
  }

  grunt.registerMultiTask('rev', 'Prefix static asset file names with a content hash', function() {

    var options = this.options({
      encoding: 'utf8',
      algorithm: 'md5',
      length: 8
    });

    this.files.forEach(function(filePair) {
      filePair.src.forEach(function(f) {

        var hash = md5(f, options.algorithm, 'hex', options.encoding),
          prefix = hash.slice(0, options.length),
          renamed = [prefix, path.basename(f)].join('.');

        // check file whether been md5ed or not
        if(path.basename(f).substr(0,prefix.length) == prefix){
            renamed = path.basename(f);
        }
        
        var outPath = path.resolve(path.dirname(f), renamed);
        grunt.verbose.ok().ok(hash);
        fs.renameSync(f, outPath);
        grunt.log.write(f + ' ').ok(renamed);

      });
    });

  });

};
