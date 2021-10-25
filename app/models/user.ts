import Model, { attr, hasMany } from '@ember-data/model';
import EmberArray from '@ember/array';
import ChallengeModel from './challenge';
import { inject as service } from '@ember/service';
import CurrentUserService from 'spanish-texter/services/current-user';

export default class UserModel extends Model {
  @attr('string') declare username: string;

  @hasMany('challenge', { async: false }) declare challenges: EmberArray<ChallengeModel>;

  @service private declare currentUser: CurrentUserService;

  get isCurrentUser(): boolean {
    return Boolean(this.currentUser.user && this.id.toString() === this.currentUser.user.id.toString());
  }
}
