import Model, { attr, belongsTo } from '@ember-data/model';

export default class AttemptModel extends Model {
  @attr('string') text;
  @attr('string') queryLanguage;
  @attr('boolean') isCorrect;
  @attr('date') createdAt;

  @belongsTo('challenge', { async: false }) challenge;

  get attemptLanguage() {
    return this.queryLanguage === 'spanish' ? 'english' : 'spanish';
  }
}
