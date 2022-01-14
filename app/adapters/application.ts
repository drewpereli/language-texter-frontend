import ActiveModelAdapter from 'active-model-adapter';
import ENV from 'language-texter/config/environment';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';

export default class ApplicationAdapter extends ActiveModelAdapter {
  @service declare session: SessionService;

  host = ENV.APP.apiHost;

  get headers(): { Authorization: string } | Record<string, never> {
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      };
    } else {
      return {};
    }
  }

  changePassword({
    oldPassword,
    newPassword,
    newPasswordConfirmation,
  }: {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirmation: string;
  }): Promise<unknown> {
    let data = {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    };

    return this.ajax(`${this.host}/users/change_password`, 'POST', { data });
  }
}
