'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

exports.default = addGithubCMSAuth;

var _simpleOauth = require('simple-oauth2');

var _simpleOauth2 = _interopRequireDefault(_simpleOauth);

var _randomstring = require('randomstring');

var _randomstring2 = _interopRequireDefault(_randomstring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addGithubCMSAuth(app) {
  var oauth2 = _simpleOauth2.default.create({
    client: {
      id: process.env.OAUTH_CLIENT_ID,
      secret: process.env.OAUTH_CLIENT_SECRET
    },
    auth: {
      // Supply GIT_HOSTNAME for enterprise github installs.
      tokenHost: process.env.GIT_HOSTNAME || 'https://github.com',
      tokenPath: process.env.OAUTH_TOKEN_PATH || '/login/oauth/access_token',
      authorizePath: process.env.OAUTH_AUTHORIZE_PATH || '/login/oauth/authorize'
    }
  });

  // Authorization uri definition
  var authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URL,
    scope: process.env.SCOPES || 'repo,user',
    state: _randomstring2.default.generate(32)
  });

  // Server any static files
  // app.use(express.static('public'))


  // Initial page redirecting to Github
  app.get('/auth', function (req, res) {
    res.redirect(authorizationUri);
  });

  // Callback service parsing the authorization token and asking for the access token
  app.get('/callback', function (req, res) {
    var code = req.query.code;
    var options = {
      code: code
    };

    oauth2.authorizationCode.getToken(options, function (error, result) {
      var mess = void 0,
          content = void 0;

      if (error) {
        console.error('Access Token Error', error.message);
        mess = 'error';
        content = (0, _stringify2.default)(error);
      } else {
        var token = oauth2.accessToken.create(result);
        mess = 'success';
        content = {
          token: token.token.access_token,
          provider: 'github'
        };
      }

      var script = '\n      <script>\n      (function() {\n        function recieveMessage(e) {\n          console.log("recieveMessage %o", e)\n          // send message to main window with da app\n          window.opener.postMessage(\n            \'authorization:github:' + mess + ':' + (0, _stringify2.default)(content) + '\',\n            e.origin\n          )\n        }\n        window.addEventListener("message", recieveMessage, false)\n        // Start handshare with parent\n        console.log("Sending message: %o", "github")\n        window.opener.postMessage("authorizing:github", "*")\n        })()\n      </script>';
      return res.send(script);
    });
  });

  app.get('/success', function (req, res) {
    res.send('');
  });
}
//# sourceMappingURL=githubCMSAuth.js.map