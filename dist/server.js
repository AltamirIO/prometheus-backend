'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _githubCMSAuth = require('./githubCMSAuth');

var _githubCMSAuth2 = _interopRequireDefault(_githubCMSAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (process.env.NODE_ENV !== 'production') {
  console.log('not loading from .env file');
  require('dotenv').config({ silent: true });
}

var port = process.env.PORT || 3000;

var app = (0, _express2.default)();

app.use((0, _compression2.default)());
app.use((0, _cors2.default)());
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

(0, _githubCMSAuth2.default)(app);

// Server any static files
// app.use(express.static('public'))

var server = (0, _http.createServer)(app);

server.listen(port, function () {
  console.log('API Server is now running on port ' + port);
});
//# sourceMappingURL=server.js.map