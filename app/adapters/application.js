import ActiveModelAdapter from 'active-model-adapter';
import ENV from 'spanish-texter/config/environment';
import { inject as service } from '@ember/service';

export default class ApplicationAdapter extends ActiveModelAdapter {
  @service session;

  host = ENV.APP.apiHost;

  get headers() {
    if (this.session.isAuthenticated) {
      return {
        Authorization: `Bearer ${this.session.data.authenticated.token}`,
      };
    } else {
      return {};
    }
  }

  changePassword({ oldPassword, newPassword, newPasswordConfirmation }) {
    let data = {
      old_password: oldPassword,
      new_password: newPassword,
      new_password_confirmation: newPasswordConfirmation,
    };

    return this.ajax(`${this.host}/change_password`, 'POST', { data });
  }
}
