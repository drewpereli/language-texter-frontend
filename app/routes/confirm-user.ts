import Route from '@ember/routing/route';
import fetch from 'fetch';
import ENV from 'spanish-texter/config/environment';
import { inject as service } from '@ember/service';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { SessionService } from 'custom-types';

interface QueryParams {
  token: string;
  user_id: number;
}

export default class ConfirmUser extends Route {
  async model(params: Record<keyof QueryParams, string>): Promise<void | { errorMessage: string }> {
    let { token, user_id } = params;

    let url = `${ENV.APP.apiHost}/users/${user_id}/confirm`;

    let response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ confirmation_token: token }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      this.flashMessages.success('Your account has been confirmed. You can now log in.');
      this.transitionTo('login');
    } else {
      let body = await response.json();

      let errorMessage = body.errors[0] || 'There was an error. Please try again later.';

      return { errorMessage };
    }
  }

  queryParams: Record<keyof QueryParams, Record<string, never>> = {
    token: {},
    user_id: {},
  };

  @service private declare flashMessages: FlashMessageService;
  @service declare session: SessionService;

  beforeModel(): void {
    this.session.prohibitAuthentication('authenticated.home');
  }
}
