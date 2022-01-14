import Model, { attr, belongsTo } from '@ember-data/model';
import ChallengeModel from './challenge';

export enum LanguageType {
  LearningLanguage = 'learning_language',
  NativeLanguage = 'native_language',
}

export default class AttemptModel extends Model {
  @attr('string') declare text: string;
  @attr('string') declare questionLanguage: LanguageType;
  @attr('boolean') declare isCorrect: boolean;
  @attr('date') declare createdAt: Date;

  @belongsTo('challenge', { async: false }) declare challenge: ChallengeModel;

  get attemptLanguage(): LanguageType {
    return this.questionLanguage === LanguageType.LearningLanguage
      ? LanguageType.NativeLanguage
      : LanguageType.LearningLanguage;
  }
}
