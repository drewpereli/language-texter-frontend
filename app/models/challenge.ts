import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import AttemptModel from './attempt';
import UserModel from './user';
import EmberArray from '@ember/array';
import { ValidationsObject } from 'custom-types';
import { validateNumber, validatePresence } from 'ember-changeset-validations/validators';
import Language from './language';

export default class ChallengeModel extends Model {
  @attr('string', { defaultValue: '' }) declare learningLanguageText: string;
  @attr('string', { defaultValue: '' }) declare nativeLanguageText: string;
  @attr('string') declare learningLanguageTextNote?: string;
  @attr('string') declare nativeLanguageTextNote?: string;
  @attr('number', { defaultValue: 20 }) declare requiredScore: number;
  @attr('number', { defaultValue: 0 }) declare currentStreak: number;
  @attr('string', { defaultValue: 'queued' }) declare status: string;
  @attr('date', { defaultValue: () => new Date() }) declare createdAt: Date;

  @attr('string') declare languageId: string;

  @belongsTo('user', { async: false }) declare creator?: UserModel; // Should only be undefined if new
  @belongsTo('user', { async: false }) declare student?: UserModel; // Should only be undefined if new

  @hasMany('attempts', { async: false }) declare attempts: EmberArray<AttemptModel>;

  get isQueued(): boolean {
    return this.status === 'queued';
  }

  get isActive(): boolean {
    return this.status === 'active';
  }

  get isComplete(): boolean {
    return this.status === 'complete';
  }

  get language(): Language {
    return this.store.peekRecord('language', this.languageId);
  }

  set language(language: Language) {
    this.languageId = language.id;
  }

  Validations: ValidationsObject = {
    languageId: validatePresence({ presence: true, message: "Language can't be blank" }),
    learningLanguageText: validatePresence(true),
    nativeLanguageText: validatePresence(true),
    requiredScore: validateNumber({ allowBlank: false, gt: 0 }),
  };
}
