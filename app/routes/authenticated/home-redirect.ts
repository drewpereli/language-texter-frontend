import Route from '@ember/routing/route';

export default class AuthenticatedHomeRedirectRoute extends Route {
  beforeModel(): void {
    this.transitionTo('authenticated.home');
  }
}
