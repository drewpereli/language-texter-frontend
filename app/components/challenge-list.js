import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ChallengeListComponent extends Component {
  @service store;

  get challenges() {
    return this.store.peekAll('challenge').sortBy('isNew', 'createdAt').reverse();
  }

  @action
  addNewChallenge() {
    this.store.createRecord('challenge');
  }
}
