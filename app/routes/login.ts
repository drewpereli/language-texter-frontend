import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';

export default class LoginRoute extends Route {
  @service declare session: SessionService;

  beforeModel(): void {
    this.session.prohibitAuthentication('authenticated.home');
  }
}
