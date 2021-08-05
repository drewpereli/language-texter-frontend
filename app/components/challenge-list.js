import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ChallengeListComponent extends Component {
  @service store;

  get challenges() {
    let challenges = this.store.peekAll('challenge');

    let newChallenges = challenges.filterBy('isNew');
    let oldChallenges = challenges.rejectBy('isNew');

    return [...newChallenges, ...oldChallenges];
  }

  @action
  addNewChallenge() {
    this.store.createRecord('challenge');
  }
}
