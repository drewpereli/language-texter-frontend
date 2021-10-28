import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { SessionService } from 'custom-types';
import CurrentUserService from 'spanish-texter/services/current-user';

export default class ApplicationRoute extends Route {
  @service public declare session: SessionService;
  @service public declare currentUser: CurrentUserService;

  public beforeModel(): void {
    if (this.session.isAuthenticated) {
      this.currentUser.loadIfNeeded();
    } else {
      this.session.on('authenticationSucceeded', () => {
        this.currentUser.loadIfNeeded();
      });
    }
  }
}
