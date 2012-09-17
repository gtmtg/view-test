#!/usr/bin/env node

var cli = require('commander');
var express = require('express');
var fs = require('fs');
var app = express();

function engineValidate(engine) {
  if (engine == 'ejs') {
    return 'ejs';
  } else if (engine == 'jade') {
    return 'jade';
  } else {
    console.log('Templating engine specified was invalid. Defaulting to ejs.');
    return 'ejs';
  }
}

function parseVars(vars) {
  if (vars != '') {
    console.log(vars);
    var argsArray = vars.split('.');
    argsArray[0] = argsArray[0].replace(/^\{/, '');
    argsArray[argsArray.length-1] = argsArray[argsArray.length-1].replace(/\}$/, '');
    console.log(argsArray);
    var parsed = new Object();
    for (i = 0; i < argsArray.length; i++) {
      argsArray[i] = argsArray[i].trim();
      var varsArray = argsArray[i].split(':');
      parsed[varsArray[0]] = varsArray[1];
    }
    console.log(parsed);
    if (parsed === Object(parsed)) {
      return parsed;
    } else {
      console.log('Variables specified were invalid. Defaulting to nothing.');
      return '';
    }
  } else {
    return '';
  }
}

function checkDir(dir, type) {
  var directory = dir;
  try {
    stats = fs.lstatSync(dir);
    if (stats.isDirectory()) {
      directory = directory.replace(/\/$/, '');
    } else {
      directory = process.cwd().toString();
      if (type == 'templates') {
        console.log('Templates directory specified was invalid. Defaulting to ' + process.cwd().toString() + '.');
      } else if (type == 'static') {
        console.log('Statics directory specified was invalid. Defaulting to ' + cli.dir + '.');
      }
    }
  }
  catch (e) {
    directory = process.cwd().toString();
    if (type == 'templates') {
      console.log('Templates directory specified was invalid. Defaulting to ' + process.cwd().toString() + '.');
    } else if (type == 'static') {
      console.log('Statics directory specified was invalid. Defaulting to ' + process.cwd().toString() + '.');
    }
  }
  return directory;
}

cli
  .version('0.1.0')
  .option('-e, --engine [string]', 'Specify the templating engine to be used - either “jade” or “ejs” [ejs]')
  .option('-p, --port [string]', 'Specify the port on which the templates can be accessed [3000]')
  .option('-v, --vars [string]', 'Specify the variables to be rendered in the templates. Note that these should be in JSON format, but with properties separated by a period instead of a comma.')
  .option('-d, --dir [string]', 'Specify the directory of the template files [' + process.cwd().toString() + ']')
  .option('-s, --static [string]', 'Specify the directory of the static files (stylesheets, images, etc) [templates directory]')
  .parse(process.argv);

app.configure(function(){
  if (!cli.engine) {
    cli.engine = 'ejs';
  }
  if (!cli.port) {
    cli.port = '3000';
  }
  if (!cli.vars) {
    cli.vars = '';
  }
  if (!cli.dir) {
    cli.dir = process.cwd().toString();
  }
  cli.dir = checkDir(cli.dir, 'templates');
  if (!cli.static) {
    cli.static = cli.dir;
  }
  cli.engine = engineValidate(cli.engine);
  if (isNaN(cli.port)) {
    cli.port = '3000';
    console.log('Port specified was invalid. Defaulting to 3000.');
  }
  cli.vars = parseVars(cli.vars);
  cli.static = checkDir(cli.static, 'static');
  app.set('port', cli.port);
  app.set('views',cli.dir);
  app.set('view engine', cli.engine);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(cli.static));
  app.use(express.errorHandler());
});

//Handle requests
app.get('/:template', function(request, response) {
  if (fs.existsSync(cli.dir + '/' + request.params.template + '.' + cli.engine)) {
    if (cli.vars == '') {
      response.render(request.params.template);
    } else {
      response.render(request.params.template, cli.vars);
    }
  } else {
    console.log('Requested template doesn\'t exist');
    response.writeHead(404, {"Content-Type": "text/plain"});
    response.write('The requested template does\'t exist. Please check the URL and try again.');
    response.end();
  }
});

app.listen(app.get('port'));
console.log('view-test was started on port ' + app.get('port') + '. You can access your templates at http://localhost:' + app.get('port') + '/[template name without extension].');