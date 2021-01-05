const application = require('./application');

global.application = new application();
global.application.run();