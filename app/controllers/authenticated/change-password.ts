import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { dropTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { getOwner } from '@ember/application';
import { SessionService, ValidationsObject } from 'custom-types';
import { EuiToasterService } from 'custom-types';
import { TaskGenerator } from 'ember-concurrency';
import { validatePresence, validateConfirmation } from 'ember-changeset-validations/validators';
import validatePasswordStrength from 'spanish-texter/validators/validate-password-strength';

const Validations: ValidationsObject = {
  oldPassword: validatePresence(true),
  newPassword: validatePasswordStrength(),
  newPasswordConfirmation: validateConfirmation({ on: 'newPassword', allowBlank: false }),
};

export default class AuthenticatedChangePasswordController extends Controller {
  @service declare session: SessionService;
  @service declare euiToaster: EuiToasterService;

  @tracked oldPassword: string | undefined;
  @tracked newPassword: string | undefined;
  @tracked newPasswordConfirmation: string | undefined;

  Validations = Validations;

  @dropTask
  *onSubmit(): TaskGenerator<void> {
    let { oldPassword, newPassword, newPasswordConfirmation } = this;

    let adapter = getOwner(this).lookup('adapter:application');

    try {
      yield adapter.changePassword({ oldPassword, newPassword, newPasswordConfirmation });

      this.euiToaster.show({ title: 'Password updated', color: 'success' });

      this.oldPassword = undefined;
      this.newPassword = undefined;
      this.newPasswordConfirmation = undefined;
    } catch (responseError) {
      let error = responseError.errors[0];

      if (Number(error.status) === 401) {
        this.euiToaster.show({ title: 'Old password is incorrect.', color: 'danger' });
      } else {
        this.euiToaster.show({ title: 'There was an error.', body: 'Please try again later.', color: 'danger' });
      }
    }
  }
}
