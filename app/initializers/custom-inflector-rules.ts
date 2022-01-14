import Inflector from 'ember-inflector';

export function initialize(): void {
  let inflector = Inflector.inflector;

  inflector.uncountable('user_settings');
}

export default {
  name: 'custom-inflector-rules',
  initialize,
};
