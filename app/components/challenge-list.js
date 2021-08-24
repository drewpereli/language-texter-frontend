import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { enqueueTask } from 'ember-concurrency-decorators';

export default class ChallengeListComponent extends Component {
  @service store;

  get challenges() {
    return this.store.peekAll('challenge').filterBy('status', this.args.status).sortBy('createdAt').reverse();
  }

  @action
  addNewChallenge() {
    this.store.createRecord('challenge');
  }

  @enqueueTask
  *fetchChallenges() {
    yield this.store.query('challenge', { status: this.args.status });
  }
}
