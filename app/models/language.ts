import Model, { attr } from '@ember-data/model';

export default class Language extends Model {
  @attr('string') declare code: string;
  @attr('string') declare name: string;
  @attr('string') declare native_name: string;
}
