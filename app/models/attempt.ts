import Model, { attr, belongsTo } from '@ember-data/model';
import { Language } from 'custom-types';
import ChallengeModel from './challenge';

export default class AttemptModel extends Model {
  @attr('string') declare text: string;
  @attr('string') declare queryLanguage: Language;
  @attr('boolean') declare isCorrect: boolean;
  @attr('date') declare createdAt: Date;

  @belongsTo('challenge', { async: false }) declare challenge: ChallengeModel;

  get attemptLanguage(): Language {
    return this.queryLanguage === 'spanish' ? 'english' : 'spanish';
  }
}
