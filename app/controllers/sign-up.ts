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
import { passwordValidationInfo } from 'spanish-texter/utils/password-utils';
import IntlService from 'ember-intl/services/intl';

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

  private get passwordValidationInfo(): ReturnType<typeof passwordValidationInfo> {
    return passwordValidationInfo(this.password, this.intl.t.bind(this.intl));
  }

  protected get passwordConfirmationError(): string | null {
    if (this.password && this.passwordConfirmation && this.password !== this.passwordConfirmation) {
      return this.intl.t('error_messages.password_mismatch');
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
        this.flashMessages.danger(this.intl.t('error_messages.password_mismatch'));
        return;
      }

      let user = { username, phone_number: phoneNumber, password, password_confirmation: passwordConfirmation };

      let url = `${ENV.APP.apiHost}/users`;

      let response: Response = yield fetch(url, {
        method: 'POST',
        body: JSON.stringify({ user }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        this.flashMessages.success(this.intl.t('success_message.sign_up_success'));
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
        this.flashMessages.danger(this.intl.t('error_messages.generic'));
      }
    } catch (error) {
      this.flashMessages.danger(this.intl.t('error_messages.generic'));
    }

    this.password = undefined;
    this.passwordConfirmation = undefined;
  }

  @service private declare session: SessionService;
  @service private declare flashMessages: FlashMessageService;
  @service private declare intl: IntlService;
}
