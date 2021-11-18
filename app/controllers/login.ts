import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { TaskGenerator } from 'ember-concurrency';
import { SessionService } from 'custom-types';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { validatePresence } from 'ember-changeset-validations/validators';

const Validations = {
  username: validatePresence(true),
  password: validatePresence(true),
};

export default class LoginController extends Controller {
  @service declare session: SessionService;
  @service declare flashMessages: FlashMessageService;

  Validations = Validations;

  @tracked username = '';
  @tracked password = '';

  @dropTask
  *onSubmit(): TaskGenerator<void> {
    try {
      let { username, password } = this;

      yield this.session.authenticate('authenticator:jwt', { username, password });
    } catch (error) {
      if (error.status === 401) {
        this.flashMessages.danger(error.json.errors);
      } else {
        this.flashMessages.danger('There was an error. Please try again later.');
      }
    }
  }
}
