import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { SessionService, RouteTransition } from 'custom-types';

export default class AuthenticatedRoute extends Route {
  @service declare session: SessionService;

  beforeModel(transition: RouteTransition): void {
    let authenticated = this.session.requireAuthentication(transition, 'login');

    if (authenticated && transition.targetName === 'authenticated.index') {
      this.transitionTo('authenticated.home');
    }
  }
}
