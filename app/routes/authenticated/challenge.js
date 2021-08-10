import Route from '@ember/routing/route';

export default class AuthenticatedChallengeRoute extends Route {
  async model(params) {
    let challenge = await this.store.findRecord('challenge', params.challenge_id);
    let attempts = await this.store.queryRecord('attempt', { challenge_id: params.challenge_id }); // Load attempts

    return { challenge, attempts };
  }
}
