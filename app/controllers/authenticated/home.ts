import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import StoreService from '@ember-data/store';
import EmberArray from '@ember/array';
import ChallengeModel from 'spanish-texter/models/challenge';

export default class AuthenticatedHomeController extends Controller {
  @service declare store: StoreService;

  challengeLists = [
    { status: 'queued', startCollapsed: true },
    { status: 'active', startCollapsed: false },
    { status: 'complete', startCollapsed: true },
  ];

  get newChallenges(): EmberArray<ChallengeModel> {
    return this.store.peekAll('challenge').filterBy('isNew');
  }

  @action
  createNewChallenge(): void {
    this.store.createRecord('challenge');
  }
}
