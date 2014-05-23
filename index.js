var nodemiral = require('nodemiral');
var path = require('path');

/*
  vars: vars for the paramters, following fields are containing
    no fileds for now - needs no input
*/
exports.install = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('HaProxy Installation', taskListOptions);
  taskList.executeScript('install', {
    script: path.resolve(__dirname, 'scripts/install.sh')
  });

  taskList.execute('updating-status', {
    command: 'echo installed | sudo tee /opt/nodemiral/haproxy/status'
  });

  return taskList;
};

/*
  vars: vars for the paramters, following fields are containing
    nodes: ['nodehost1', 'nodehost2']
*/
exports.configure = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('HaProxy Configuration', taskListOptions);

  taskList.copy('upstart', {
    src: path.resolve(__dirname, 'templates/haproxy.init.conf'),
    dest: '/etc/init/haproxy.conf'
  });
  
  taskList.copy('configure', {
    src: path.resolve(__dirname, 'templates/haproxy.cfg'),
    dest: '/opt/nodemiral/haproxy/haproxy.cfg',
    vars: vars
  });

  //restart haproxy
  taskList.execute('restarting-haproxy', {
    command: '(sudo stop haproxy || :) && (sudo start haproxy || :)'
  });

  taskList.execute('updating-status', {
    command: 'echo configured | sudo tee /opt/nodemiral/haproxy/status'
  });

  return taskList;
};

/*
  vars: vars for the paramters, following fields are containing
    no fileds for now - needs no input
*/
exports.start = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('Start HaProxy', taskListOptions);

  taskList.execute('start', {
    command: 'sudo start haproxy || :'
  });
  
  return taskList;
};

/*
  vars: vars for the paramters, following fields are containing
    no fileds for now - needs no input
*/
exports.stop = function(vars, taskListOptions) {
  var taskList = nodemiral.taskList('Stop HaProxy', taskListOptions);
  taskList.execute('stop', {
    command: 'sudo stop haproxy || :'
  });
  
  return taskList;
};