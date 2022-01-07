import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import Language from 'spanish-texter/models/language';
import UserSettingsModel from 'spanish-texter/models/user-settings';
import CurrentUserService from 'spanish-texter/services/current-user';

export interface SettingsRouteModel {
  userSettings: UserSettingsModel;
  languages: Language[];
}

export default class AuthenticatedSettingsRoute extends Route<SettingsRouteModel> {
  @service declare currentUser: CurrentUserService;

  model(): SettingsRouteModel {
    let { languages } = this.modelFor('application');

    return {
      userSettings: this.currentUser.user?.userSettings as UserSettingsModel,
      languages,
    };
  }
}
