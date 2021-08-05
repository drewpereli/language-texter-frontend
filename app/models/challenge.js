import Model, { attr, belongsTo } from '@ember-data/model';

export default class ChallengeModel extends Model {
  @attr('string') spanishText;
  @attr('string') englishText;
  @attr('number', { defaultValue: 20 }) requiredStreakForCompletion;
  @attr('boolean', { defaultValue: false }) isComplete;
  @attr('string') createByName;

  @belongsTo('user', { async: false }) user;
}
