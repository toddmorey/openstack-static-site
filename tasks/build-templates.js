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
    flatten = require('gulp-flatten'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    main_dir = process.cwd();

var env = nunjucks.configure({noCache : true});

var template_dir = "/Users/toddmorey/Documents/webdev/websites/www-openstack-org/themes/openstack/templates/static";

gulp.task('build-templates', function (cb) {
  console.time('[metalsmith] build finished');
  Metalsmith(__dirname)
    .source(main_dir + '/content')
    .destination(main_dir + '/os-templates')
    .use(drafts())
    .use(markdown())
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
    .build(function(err) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('[metalsmith] build finished');
            cb();
        }
    });
});

gulp.task('copy-templates', function (cb) {
    gulp.src(main_dir + '/os-templates/*.html')
      .pipe(rename({
        extname: ".ss"
      }))
      .pipe(flatten())
      .pipe(gulp.dest(template_dir));    
});

gulp.task('templates', function(cb) {
    runSequence('build-templates','copy-templates')
});

