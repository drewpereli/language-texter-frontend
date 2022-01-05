import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import StoreService from '@ember-data/store';
import EmberArray from '@ember/array';
import ChallengeModel from 'spanish-texter/models/challenge';
import CurrentUserService from 'spanish-texter/services/current-user';

export default class AuthenticatedHomeController extends Controller {
  @service declare store: StoreService;
  @service declare currentUser: CurrentUserService;

  challengeLists = [
    { status: 'queued', startOpen: false },
    { status: 'active', startOpen: true },
    { status: 'complete', startOpen: false },
  ];

  get newChallenges(): EmberArray<ChallengeModel> {
    return this.store.peekAll('challenge').filterBy('isNew');
  }

  @action
  createNewChallenge(): void {
    this.store.createRecord('challenge', {
      languageId: this.currentUser.user?.userSettings.defaultChallengeLanguage.id,
    });
  }
}
