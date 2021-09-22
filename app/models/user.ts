import Model, { attr, hasMany } from '@ember-data/model';
import EmberArray from '@ember/array';
import ChallengeModel from './challenge';

export default class UserModel extends Model {
  @attr('string') declare username: string;

  @hasMany('challenge', { async: false }) declare challenges: EmberArray<ChallengeModel>;
}
