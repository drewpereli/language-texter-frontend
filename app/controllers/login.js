import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class LoginController extends Controller {
  @service session;
  @service flashMessages;

  @tracked username;
  @tracked password;
  @tracked errorMessage;

  @dropTask
  *onSubmit() {
    try {
      let { username, password } = this;
      yield this.session.authenticate('authenticator:jwt', { username, password });
    } catch (error) {
      if (error.status === 401) {
        this.flashMessages.danger('Invalid username or password');
      } else {
        this.flashMessages.danger('There was an error. Please try again later.');
      }
    }
  }
}
