import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class AuthenticatedHomeController extends Controller {
  @service store;

  challengeLists = [
    { status: 'queued', startCollapsed: true },
    { status: 'active', startCollapsed: false },
    { status: 'complete', startCollapsed: true },
  ];

  get newChallenges() {
    return this.store.peekAll('challenge').filterBy('isNew');
  }

  @action
  createNewChallenge() {
    this.store.createRecord('challenge');
  }
}
