import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TaskGenerator } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency-decorators';
import { SessionService, ValidationsObject } from 'custom-types';
import { EuiToasterService } from 'custom-types';
import fetch from 'fetch';
import ENV from 'spanish-texter/config/environment';
import { capitalize } from '@ember/string';
import { validatePresence, validateFormat, validateConfirmation } from 'ember-changeset-validations/validators';
import validatePasswordStrength from 'spanish-texter/validators/validate-password-strength';

const Validations: ValidationsObject = {
  username: validatePresence(true),
  phoneNumber: validateFormat({ allowBlank: false, type: 'phone' }),
  password: validatePasswordStrength(),
  passwordConfirmation: validateConfirmation({ on: 'password', allowBlank: false }),
};
export default class SignUp extends Controller {
  @tracked protected username = '';
  @tracked protected phoneNumber = '';
  @tracked protected password = '';
  @tracked protected passwordConfirmation = '';

  Validations = Validations;

  @dropTask
  protected *onSubmit(): TaskGenerator<void> {
    try {
      let { username, phoneNumber, password, passwordConfirmation } = this;

      let user = {
        username,
        phone_number: phoneNumber,
        password,
        password_confirmation: passwordConfirmation,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };

      let url = `${ENV.APP.apiHost}/users`;

      let response: Response = yield fetch(url, {
        method: 'POST',
        body: JSON.stringify({ user }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.euiToaster.show({
          title: 'Sign up successful',
          body: "You'll receive a text within the next few minutes with a link to confirm your account.",
        });
      } else if (response.status === 401) {
        let body = yield response.json();

        let errors: Record<string, string[]> = body.errors;

        let errorMessages: string[] = [];

        Object.keys(errors).forEach((attr) => {
          let messages = errors[attr];

          let humanizedAttr = attr.split('_').join(' ');

          let fullMessages = messages.map((message) => `${capitalize(humanizedAttr)} ${message}.`);

          errorMessages = [...errorMessages, ...fullMessages];
        });

        let errorMessage = errorMessages.join('\n');

        this.euiToaster.show({ title: 'There was an error', body: errorMessage, color: 'danger' });
      } else {
        this.euiToaster.show({ title: 'There was an error.', body: 'Please try again later.', color: 'danger' });
      }
    } catch (error) {
      this.euiToaster.show({ title: 'There was an error.', body: 'Please try again later.', color: 'danger' });
    }

    this.password = '';
    this.passwordConfirmation = '';
  }

  @service private declare session: SessionService;
  @service private declare euiToaster: EuiToasterService;
}
