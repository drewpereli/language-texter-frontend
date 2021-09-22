import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { SessionService } from 'custom-types';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { TaskGenerator } from 'ember-concurrency';

export default class AuthenticatedChangePasswordController extends Controller {
  @service declare session: SessionService;
  @service declare flashMessages: FlashMessageService;

  @tracked oldPassword: string | undefined;
  @tracked newPassword: string | undefined;
  @tracked newPasswordConfirmation: string | undefined;

  @dropTask
  *onSubmit(): TaskGenerator<void> {
    let { oldPassword, newPassword, newPasswordConfirmation } = this;

    if (newPassword !== newPasswordConfirmation) {
      this.flashMessages.danger("New password doesn't match confirmation");
      return;
    }

    let adapter = getOwner(this).lookup('adapter:application');

    try {
      yield adapter.changePassword({ oldPassword, newPassword, newPasswordConfirmation });

      this.flashMessages.success('Password updated');

      this.oldPassword = undefined;
      this.newPassword = undefined;
      this.newPasswordConfirmation = undefined;
    } catch (responseError) {
      let error = responseError.errors[0];

      if (Number(error.status) === 401) {
        this.flashMessages.danger('Old password is incorrect');
      } else {
        this.flashMessages.danger('There was an error. Please try again later.');
      }
    }
  }
}
