import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { enqueueTask } from 'ember-concurrency-decorators';
import { TaskGenerator } from 'ember-concurrency';
import ChallengeModel from 'spanish-texter/models/challenge';
import { InfinityService } from 'custom-types';

interface Args {
  status: string;
}

export default class ChallengeListComponent extends Component<Args> {
  @service declare infinity: InfinityService;

  @tracked challenges: ChallengeModel[] | undefined;

  @enqueueTask
  *fetchInitialChallenges(): TaskGenerator<void> {
    this.challenges = yield this.infinity.model('challenge', { status: this.args.status });
  }
}
