require("harmonize")(["harmony-generators"]);

var Metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    markdown = require('metalsmith-markdown'),
    inplace = require('metalsmith-in-place'),
    layouts = require('metalsmith-layouts'),
    watch = require('metalsmith-watch'),
    msriot = require('./modules/metalsmith-riot.js'),
    riot = require('riot'),
    sass = require('metalsmith-sass'),
    serve = require('metalsmith-serve'),
    webpack = require('metalsmith-plugin-webpack'),
    wpconfig = require('./webpack.config.js'),
    extender = require('./modules/metalsmith-extends.js'),
    nunjucks = require('nunjucks');

var env = nunjucks.configure({noCache : true});    

Metalsmith(__dirname)
  .source('./content')
  .destination('./build')
  .use(webpack(wpconfig))
  .use(drafts())
  .use(markdown())
  .use(extender())
  .use(inplace('nunjucks'))
  .use(layouts({
      "engine": "nunjucks",
      settings:  {
        noCache: true
      }
    }))
  .use(sass({
    outputDir: function(originalPath) {
      // this will change scss/some/path to css/some/path
      return originalPath.replace("scss", "stylesheets");
    }
  }))
  .use(
    watch({
      paths: {
        "${source}/**/*": true,
        "layouts/**/*": "**/*",
        "app/**/*": true
      },
      livereload: false
    })
  )
  .use(serve({}))
  .build(function(err) {
      if (err) {
          console.log(err);
      }
      else {
          console.log('Build completed');
      }
  });
