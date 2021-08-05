import EmberRouter from '@ember/routing/router';
import config from 'spanish-texter/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('authenticated', { path: '' }, function () {
    this.route('home');
    this.route('logout');
    this.route('change-password');
  });
});
