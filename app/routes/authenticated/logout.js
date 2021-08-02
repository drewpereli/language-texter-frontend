import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AuthenticatedLogoutRoute extends Route {
  @service session;

  beforeModel() {
    this.session.invalidate();
  }
}
