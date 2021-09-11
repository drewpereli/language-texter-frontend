import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import GoogleTranslateClient from 'spanish-texter/utils/google-translate-client';

/**
 * @param {ChallengeModel} challenge
 */
export default class ChallengeComponent extends Component {
  @service flashMessages;

  googleTranslateClient = new GoogleTranslateClient();

  @tracked isEditing = false;
  @tracked showDeleteConfirmation = false;

  @tracked englishTranslationSuggestion;
  @tracked spanishTranslationSuggestion;

  @tracked englishTranslationSuggestionRunning;
  @tracked spanishTranslationSuggestionRunning;

  get showEnglishSuggestion() {
    return this.englishTranslationSuggestion || this.englishTranslationSuggestionRunning;
  }

  get showSpanishSuggestion() {
    return this.spanishTranslationSuggestion || this.spanishTranslationSuggestionRunning;
  }

  get isNewOrEditing() {
    return this.args.challenge.isNew || this.isEditing;
  }

  get streakBarInnerStyle() {
    let completionFraction = Math.min(
      this.args.challenge.currentStreak / this.args.challenge.requiredStreakForCompletion,
      1
    );

    let completionPercentage = 100 * completionFraction;

    return `width: ${completionPercentage}%`;
  }

  @task
  *saveChallenge() {
    try {
      yield this.args.challenge.save();
      let message = 'Challenge saved ';

      if (this.args.challenge.status === 'queued') {
        message += 'and added to the queue';
      } else {
        message += 'and added to active challenges';
      }

      this.flashMessages.success(message);
      this.isEditing = false;
    } catch (error) {
      this.flashMessages.danger('There was an error saving the challenge. Please try again later.');
      console.log(error);
    }
  }

  @action
  cancel() {
    let challenge = this.args.challenge;

    if (challenge.isNew) {
      challenge.deleteRecord();
    } else {
      this.args.challenge.rollbackAttributes();
    }

    this.isEditing = false;
  }

  @task
  *destroyChallenge() {
    try {
      yield this.args.challenge.destroyRecord();
      this.flashMessages.success('Challenge deleted');
      this.showDeleteConfirmation = false;
    } catch (error) {
      this.flashMessages.danger('There was an error deleting the challenge. Please try again later.');
      console.log(error);
    }
  }

  @action
  onInputChallengeText(language, text) {
    if (language === 'english') {
      this.args.challenge.englishText = text;
    } else {
      this.args.challenge.spanishText = text;
    }

    if (language === 'english') {
      this.setSpanishSuggestion.perform(text);
    } else {
      this.setEnglishSuggestion.perform(text);
    }
  }

  @restartableTask
  *setSpanishSuggestion(text) {
    if (!text) {
      this.spanishTranslationSuggestion = null;
      this.spanishTranslationSuggestionRunning = false;
      return;
    }

    this.spanishTranslationSuggestionRunning = true;

    yield timeout(500); // 500 ms debounce

    let suggestion = yield this.googleTranslateClient.translate({ text, from: 'english', to: 'spanish' });

    this.spanishTranslationSuggestion = suggestion;
    this.spanishTranslationSuggestionRunning = false;
  }

  @restartableTask
  *setEnglishSuggestion(text) {
    if (!text) {
      this.englishTranslationSuggestion = null;
      this.englishTranslationSuggestionRunning = false;
      return;
    }

    this.englishTranslationSuggestionRunning = true;

    yield timeout(500); // 500 ms debounce

    let suggestion = yield this.googleTranslateClient.translate({ text, from: 'spanish', to: 'english' });

    this.englishTranslationSuggestion = suggestion;
    this.englishTranslationSuggestionRunning = false;
  }
}
