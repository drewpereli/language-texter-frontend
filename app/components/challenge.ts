import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { dropTask, restartableTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import GoogleTranslateClient from 'spanish-texter/utils/google-translate-client';
import ChallengeModel from 'spanish-texter/models/challenge';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import { TaskGenerator } from 'ember-concurrency';
import { Language } from 'custom-types';
import { taskFor } from 'ember-concurrency-ts';
import { SelectOption } from './ui/select';
import CurrentUserService from 'spanish-texter/services/current-user';

interface Args {
  challenge: ChallengeModel;
}

export default class ChallengeComponent extends Component<Args> {
  @service declare flashMessages: FlashMessageService;
  @service declare currentUser: CurrentUserService;

  googleTranslateClient: GoogleTranslateClient = new GoogleTranslateClient();

  @tracked isEditing = false;
  @tracked showDeleteConfirmation = false;

  @tracked englishTranslationSuggestion: string | undefined;
  @tracked spanishTranslationSuggestion: string | undefined;

  @tracked englishTranslationSuggestionRunning = false;
  @tracked spanishTranslationSuggestionRunning = false;

  get isNewOrEditing(): boolean {
    return !!this.args.challenge.isNew || this.isEditing;
  }

  get streakBarInnerStyle(): string {
    let completionFraction = Math.min(this.args.challenge.currentStreak / this.args.challenge.requiredScore, 1);

    let completionPercentage = 100 * completionFraction;

    return `width: ${completionPercentage}%`;
  }

  get studentCreatorText(): string {
    let { student, creator } = this.args.challenge;

    if (!student || !creator) {
      return '';
    }

    if (student.isCurrentUser && creator.isCurrentUser) {
      return 'Created by and assigned to you';
    }

    if (student.isCurrentUser) {
      return `Created by ${creator.username}`;
    }

    return `Assigned to ${student.username}`;
  }

  get studentOptions(): SelectOption[] | null {
    let user = this.currentUser.user;

    if (!user || user.students.length === 0) {
      return null;
    }

    let studentOptions = user.students.map((student) => {
      return {
        id: student.id,
        label: student.username,
        value: student,
      };
    });

    return [{ id: user.id, label: 'You', value: user }, ...studentOptions];
  }

  @dropTask
  *saveChallenge(): TaskGenerator<void> {
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
  cancel(): void {
    let challenge = this.args.challenge;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (challenge.isNew) {
      challenge.deleteRecord();
    } else {
      this.args.challenge.rollbackAttributes();
    }

    this.isEditing = false;
  }

  @dropTask
  *destroyChallenge(): TaskGenerator<void> {
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
  onInputChallengeText(language: Language, text: string): void {
    if (language === 'english') {
      this.args.challenge.englishText = text;
    } else {
      this.args.challenge.spanishText = text;
    }

    if (language === 'english') {
      taskFor(this.setSpanishSuggestion).perform(text);
    } else {
      taskFor(this.setEnglishSuggestion).perform(text);
    }
  }

  @restartableTask
  *setSpanishSuggestion(text: string): TaskGenerator<void> {
    if (!text) {
      this.spanishTranslationSuggestion = undefined;
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
  *setEnglishSuggestion(text: string): TaskGenerator<void> {
    if (!text) {
      this.englishTranslationSuggestion = undefined;
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
