import Route from '@ember/routing/route';
import AttemptModel from 'language-texter/models/attempt';
import ChallengeModel from 'language-texter/models/challenge';

interface RouteModel {
  challenge: ChallengeModel;
  attempts: AttemptModel[];
}

interface RouteParams {
  challenge_id: number;
}

export default class AuthenticatedChallengeRoute extends Route {
  async model(params: RouteParams): Promise<RouteModel> {
    let challenge = await this.store.findRecord('challenge', params.challenge_id);
    let attempts = await this.store.queryRecord('attempt', { challenge_id: params.challenge_id }); // Load attempts

    return { challenge, attempts };
  }
}
