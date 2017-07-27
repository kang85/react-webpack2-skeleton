

const render = require('./lib');

exports.handler = function(event, context, callback) {
  console.log(JSON.stringify(event));

  var path = event.path;
  render.default(event, callback);
}
