require("harmonize")(["harmony-generators"]);

var Metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    markdown = require('metalsmith-markdown'),
    inplace = require('metalsmith-in-place'),
    layouts = require('metalsmith-layouts'),
    watch = require('metalsmith-watch'),
    sass = require('metalsmith-sass'),
    serve = require('metalsmith-serve'),
    permalinks = require('metalsmith-permalinks'),    
    extender = require('./modules/metalsmith-extends.js'),
    nunjucks = require('nunjucks');

var env = nunjucks.configure({noCache : true});    

Metalsmith(__dirname)
  .source('./content')
  .destination('./build')
  .use(drafts())
  .use(markdown())
  .use(permalinks({
    relative: false
  }))  
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
      return originalPath.replace("scss", "css");
    }
  }))
  .use(
    watch({
      paths: {
        "${source}/**/*": true,
        "layouts/**/*": "**/*",
      },
      livereload: false
    })
  )
  .use(serve({ port: 8081 }))  
  .build(function(err) {
      if (err) {
          console.log(err);
      }
      else {
          console.log('Build completed');
      }
  });
