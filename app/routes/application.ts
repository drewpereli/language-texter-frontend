import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { SessionService } from 'custom-types';
import CurrentUserService from 'spanish-texter/services/current-user';
import Language from 'spanish-texter/models/language';

interface RouteModel {
  languages: Language[];
}

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

  public async model(): Promise<RouteModel> {
    let languages = (await this.store.findAll('language')).toArray();

    return { languages };
  }
}
