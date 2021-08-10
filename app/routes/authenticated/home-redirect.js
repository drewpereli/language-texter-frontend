import Route from '@ember/routing/route';

export default class AuthenticatedHomeRedirectRoute extends Route {
  beforeModel() {
    this.transitionTo('authenticated.home');
  }
}
