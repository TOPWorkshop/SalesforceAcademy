const config = require('config');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const AbstractController = require('.');

module.exports = class AuthController extends AbstractController {
  initRouter() {
    passport.use(new GoogleStrategy({
      clientID: config.get('google.clientId'),
      clientSecret: config.get('google.clientSecret'),
      callbackURL: `${config.get('server.baseUrl')}${config.get('google.callbackUrl')}`,
    }, (accessToken, refreshToken, profile, callback) => {
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);

      callback(profile);
    }));

    this.router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
    this.router.get(config.get('google.callbackUrl'), passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => AuthController.handleLogged(req, res));
  }

  static handleLogged(req, res) {
    res.redirect('/');
  }
};
