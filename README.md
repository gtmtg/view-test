#view-test

##Introduction
view-test is a command line app written in node.js that enables easy testing of Jade and EJS templates. To install, simply run ```npm install view-test -g```. Then, to get started, run ```view-test [options]```. The templates will be accessible at ```http://localhost:[port]/[template name without extension]```. For example, if we run ```view-test -p 1234 -e jade``` in a directory with a Jade template named ```demo.jade```, the file would be accessible at ```http://localhost:1234/demo```.

##Options
These are accessible by typing ```view-test —help``` as well.

+ ```-e, --engine``` — Specify the templating engine to be used - either “jade” or “ejs”. Defaults to ejs.
+ ```-p, --port``` — Specify the port on which the templates can be accessed. Defaults to 3000.
+ ```-v, --vars``` — Specify the variables to be rendered in the templates. Defaults to nothing. Note that these should be in JSON format, but with properties separated by a period instead of a comma. If you would like to change this, feel free to fork the project and edit line 22, character 33.
+ ```-d, --dir``` — Specify the directory of the template files. Defaults to the current directory. 
+ ```-s, --static``` — Specify the directory of the static files (stylesheets, images, etc). Defaults to the templates directory.
+ ```-i, --index``` — Specify the index template (accessible at localhost:port/). Defaults to nothing.

##License and Copyright
view-test is open-source and is licensed under the MIT License. To put it simply, this means that you can use it in both free and commercial work with a few conditions. For more information, see the license file included with this source code or visit http://opensource.org/licenses/MIT.

view-test is © 2012 gtmtg. Some rights reserved. See the license file or visit the link above for more information.