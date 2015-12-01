/**
 * Deploy site to netlify
 */

var gulp = require('gulp'),
    config = require('../netlify-config.js'),
    netlify = require('netlify');

gulp.task('deploy', ['build-site'], function() {
  netlify.deploy({
    access_token: config.NETLIFY_ACCESS_TOKEN,
    site_id: config.NETLIFY_SITE_ID,
    dir: config.NETLIFY_SITE_DIR
  }, function(err, deploy) {
    if (err) { throw(err) }
  });
});