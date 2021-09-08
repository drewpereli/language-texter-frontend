import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { enqueueTask } from 'ember-concurrency-decorators';

export default class ChallengeListComponent extends Component {
  @service infinity;

  @tracked challenges;

  @enqueueTask
  *fetchInitialChallenges() {
    this.challenges = yield this.infinity.model('challenge', { status: this.args.status });
  }
}
