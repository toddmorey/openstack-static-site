require("harmonize")(["harmony-generators"]);

var gulp = require('gulp'),
    Metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    markdown = require('metalsmith-markdown'),
    inplace = require('metalsmith-in-place'),
    layouts = require('metalsmith-layouts'),
    sass = require('metalsmith-sass'),
    permalinks = require('metalsmith-permalinks'),    
    extender = require('../modules/metalsmith-extends.js'),
    nunjucks = require('nunjucks'),
    browserSync = require('metalsmith-browser-sync'),
    main_dir = process.cwd();

var env = nunjucks.configure({noCache : true});


var browserSyncOptions = {
    server: main_dir + '/build',
    files: [ 
                main_dir + '/content/**/*.*'
           ]
};

gulp.task('watch', function (cb) {
  console.time('[metalsmith] build finished');
  Metalsmith(__dirname)
    .source(main_dir + '/content')
    .destination(main_dir + '/build')
    .use(drafts())
    .use(markdown())
    .use(permalinks({
      relative: false
    }))  
    .use(extender())
    .use(inplace('nunjucks'))
    .use(layouts({
        "engine": "nunjucks",
        directory: main_dir + '/layouts'
      }))
    .use(sass({
      includePaths: [main_dir + '/content/scss'],
      outputDir: function(originalPath) {
        // this will change scss/some/path to css/some/path
        return originalPath.replace("scss", "stylesheets");
      }
    }))
    .use(browserSync(browserSyncOptions))
    .build(function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('[metalsmith] build finished');
        }
    });
    cb();
});