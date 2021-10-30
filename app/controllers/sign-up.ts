import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { TaskGenerator } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { dropTask } from 'ember-concurrency-decorators';
import { SessionService } from 'custom-types';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import fetch from 'fetch';
import ENV from 'spanish-texter/config/environment';
import { capitalize } from '@ember/string';
import { getPasswordValidationInfo } from 'spanish-texter/utils/validation-utils';

export default class SignUp extends Controller {
  @tracked protected username: string | undefined;
  @tracked protected phoneNumber: string | undefined;
  @tracked protected password: string | undefined;
  @tracked protected passwordConfirmation: string | undefined;

  protected get passwordError(): string | null {
    if (!this.password) {
      return null;
    }

    return this.passwordValidationInfo.errors[0] || this.passwordValidationInfo.warnings[0] || null;
  }

  private get passwordValidationInfo(): ReturnType<typeof getPasswordValidationInfo> {
    return getPasswordValidationInfo(this.password);
  }

  protected get passwordConfirmationError(): string | null {
    if (this.password && this.passwordConfirmation && this.password !== this.passwordConfirmation) {
      return "Password confirmation doesn't match password.";
    }

    return null;
  }

  @dropTask
  protected *onSubmit(): TaskGenerator<void> {
    try {
      let { username, phoneNumber, password, passwordConfirmation } = this;

      if (!this.passwordValidationInfo.valid) {
        this.flashMessages.danger(this.passwordValidationInfo.errors[0]);
        return;
      }

      if (password !== passwordConfirmation) {
        this.flashMessages.danger("Password doesn't match confirmation");
        return;
      }

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
        this.flashMessages.success(
          "Sign up successful. You'll receive a text within the next few minutes with a link to confirm your account."
        );
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

        this.flashMessages.danger(errorMessage);
      } else {
        this.flashMessages.danger('There was an error. Please try again later.');
      }
    } catch (error) {
      this.flashMessages.danger('There was an error. Please try again later.');
    }

    this.password = undefined;
    this.passwordConfirmation = undefined;
  }

  @service private declare session: SessionService;
  @service private declare flashMessages: FlashMessageService;
}
