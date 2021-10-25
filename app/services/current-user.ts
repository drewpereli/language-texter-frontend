import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';
import StoreService from '@ember-data/store';
import UserModel from 'spanish-texter/models/user';

export default class CurrentUserService extends Service {
  @service declare session: SessionService;
  @service declare store: StoreService;

  @tracked user?: UserModel;

  public get loggedIn(): boolean {
    return this.session.isAuthenticated;
  }

  async loadIfNeeded(): Promise<void> {
    if (this.user) {
      return;
    }

    let user = await this.store.queryRecord('user', { me: true });
    this.user = user;
  }
}
