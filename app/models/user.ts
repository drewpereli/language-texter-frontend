import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import EmberArray from '@ember/array';
import ChallengeModel from './challenge';
import { inject as service } from '@ember/service';
import CurrentUserService from 'spanish-texter/services/current-user';
import UserSettingsModel from './user-settings';

export default class UserModel extends Model {
  @attr('string') declare username: string;

  @hasMany('user', { async: false, inverse: 'teachers' }) declare students: EmberArray<UserModel>;
  @hasMany('user', { async: false, inverse: 'students' }) declare teachers: EmberArray<UserModel>;

  @hasMany('challenge', { async: false, inverse: 'student' }) declare challengesAssigned: EmberArray<ChallengeModel>;
  @hasMany('challenge', { async: false, inverse: 'creator' }) declare challengesCreated: EmberArray<ChallengeModel>;

  @belongsTo('user-settings', { async: false }) declare userSettings: UserSettingsModel;

  @service private declare currentUser: CurrentUserService;

  get isCurrentUser(): boolean {
    return Boolean(this.currentUser.user && this.id.toString() === this.currentUser.user.id.toString());
  }
}
