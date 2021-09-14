import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class ChallengeModel extends Model {
  @attr('string') spanishText;
  @attr('string') englishText;
  @attr('string') spanishTextNote;
  @attr('string') englishTextNote;
  @attr('number', { defaultValue: 20 }) requiredStreakForCompletion;
  @attr('number') currentStreak;
  @attr('string') status;
  @attr('date') createdAt;

  @belongsTo('user', { async: false }) user;

  @hasMany('attempts', { async: false }) attempts;

  get isQueued() {
    return this.status === 'queued';
  }

  get isActive() {
    return this.status === 'active';
  }

  get isComplete() {
    return this.status === 'complete';
  }
}
