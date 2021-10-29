import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from './user';

export default class UserSettingsModel extends Model {
  @belongsTo('user', { async: false }) declare user: UserModel;

  @attr('string') declare timezone: string;
}
