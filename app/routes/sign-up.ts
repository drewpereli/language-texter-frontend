import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { RouteTransition, SessionService } from 'custom-types';
import SignUpController from 'spanish-texter/controllers/sign-up';
import Language from 'spanish-texter/models/language';
import { Timezone } from 'spanish-texter/models/user-settings';

export interface SignUpRouteModel {
  languages: Language[];
}

export default class SignUp extends Route<SignUpRouteModel> {
  @service declare session: SessionService;

  beforeModel(): void {
    this.session.prohibitAuthentication('authenticated.home');
  }

  public async model(): Promise<SignUpRouteModel> {
    let languages = (await this.store.findAll('language')).toArray();

    return { languages };
  }

  setupController(controller: SignUpController, model: SignUpRouteModel, transition: RouteTransition): void {
    super.setupController(controller, model, transition);

    controller.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone;

    let spanish = model.languages.find((language) => language.name === 'Spanish');

    if (!spanish) throw new Error('Spanish language not loaded');

    controller.defaultChallengeLanguageId = spanish.id;
  }
}
