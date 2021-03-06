import EmberRouter from '@ember/routing/router';
import config from 'language-texter/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('authenticated', { path: '' }, function () {
    this.route('home', { path: '/' });
    this.route('home-redirect', { path: '/home' });
    this.route('logout');
    this.route('change-password');
    this.route('challenge', { path: '/challenges/:challenge_id' });
    this.route('invitations');
    this.route('settings');
  });
  this.route('sign-up');
  this.route('confirm-user');
});
