import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import AttemptModel from './attempt';
import UserModel from './user';
import EmberArray from '@ember/array';

export default class ChallengeModel extends Model {
  @attr('string', { defaultValue: '' }) declare spanishText: string;
  @attr('string', { defaultValue: '' }) declare englishText: string;
  @attr('string') declare spanishTextNote?: string;
  @attr('string') declare englishTextNote?: string;
  @attr('number', { defaultValue: 20 }) declare requiredScore: number;
  @attr('number', { defaultValue: 0 }) declare currentStreak: number;
  @attr('string', { defaultValue: 'queued' }) declare status: string;
  @attr('date', { defaultValue: () => new Date() }) declare createdAt: Date;

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
}
