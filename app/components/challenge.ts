import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { dropTask, restartableTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import GoogleTranslateClient from 'spanish-texter/utils/google-translate-client';
import ChallengeModel from 'spanish-texter/models/challenge';
import { TaskGenerator } from 'ember-concurrency';
import { EuiToasterService } from 'custom-types';
import { taskFor } from 'ember-concurrency-ts';
import CurrentUserService from 'spanish-texter/services/current-user';
import UserModel from 'spanish-texter/models/user';
import { LanguageType } from 'spanish-texter/models/attempt';
import StorageService from '@ember-data/store';
import Language from 'spanish-texter/models/language';
interface Args {
  challenge: ChallengeModel;
}

export default class ChallengeComponent extends Component<Args> {
  @service declare euiToaster: EuiToasterService;
  @service declare currentUser: CurrentUserService;
  @service declare store: StorageService;

  googleTranslateClient: GoogleTranslateClient = new GoogleTranslateClient();

  @tracked isEditing = false;
  @tracked showDeleteConfirmation = false;

  @tracked nativeLanguageTranslationSuggestion: string | undefined;
  @tracked learningLanguageTranslationSuggestion: string | undefined;

  @tracked nativeLanguageTranslationSuggestionRunning = false;
  @tracked learningLanguageTranslationSuggestionRunning = false;

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

  get studentOptions(): { value: UserModel; label: string }[] | null {
    let user = this.currentUser.user;

    if (!user || user.students.length === 0) {
      return null;
    }

    let studentOptions = user.students.map((student) => {
      return {
        label: student.username,
        value: student,
      };
    });

    return [{ label: 'You', value: user }, ...studentOptions];
  }

  get languageOptions(): { value: string; text: string }[] {
    return this.store.peekAll('language').map((language: Language) => {
      return {
        value: language.id,
        text: language.name,
      };
    });
  }

  @dropTask
  *saveChallenge(): TaskGenerator<void> {
    try {
      yield this.args.challenge.save();

      let title = 'Challenge saved';

      let body =
        this.args.challenge.status === 'queued'
          ? 'Challenge added to the queue'
          : 'Challenge added to active challenges';

      this.euiToaster.show({
        title,
        body,
        color: 'success',
      });

      this.isEditing = false;
    } catch (error) {
      this.euiToaster.show({
        title: 'There was an error',
        body: 'Please try again later.',
        color: 'danger',
      });

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
      this.euiToaster.show({
        title: 'Challenge deleted',
        color: 'success',
      });

      this.showDeleteConfirmation = false;
    } catch (error) {
      this.euiToaster.show({
        title: 'There was an error',
        body: 'Please try again later.',
        color: 'danger',
      });

      console.log(error);
    }
  }

  @action
  onSelectLanguage(e: Event): void {
    let languageId = (e.target as HTMLSelectElement).value;

    let language = this.store.peekRecord('language', languageId);

    console.log(language);

    this.args.challenge.language = language;
  }

  @action
  onInputChallengeText(languageType: LanguageType, text: string): void {
    if (languageType === LanguageType.NativeLanguage) {
      this.args.challenge.nativeLanguageText = text;
    } else {
      this.args.challenge.learningLanguageText = text;
    }

    if (languageType === LanguageType.NativeLanguage) {
      taskFor(this.setLearningSuggestion).perform(text);
    } else {
      taskFor(this.setNativeSuggestion).perform(text);
    }
  }

  @restartableTask
  private *setLearningSuggestion(text: string): TaskGenerator<void> {
    if (!text || !this.args.challenge.language) {
      this.learningLanguageTranslationSuggestion = undefined;
      this.learningLanguageTranslationSuggestionRunning = false;
      return;
    }

    this.learningLanguageTranslationSuggestionRunning = true;

    yield timeout(500); // 500 ms debounce

    let suggestion = yield this.googleTranslateClient.translate({
      text,
      from: 'english',
      to: this.args.challenge.language.code,
    });

    this.learningLanguageTranslationSuggestion = suggestion;
    this.learningLanguageTranslationSuggestionRunning = false;
  }

  @restartableTask
  private *setNativeSuggestion(text: string): TaskGenerator<void> {
    if (!text || !this.args.challenge.language) {
      this.nativeLanguageTranslationSuggestion = undefined;
      this.nativeLanguageTranslationSuggestionRunning = false;
      return;
    }

    this.nativeLanguageTranslationSuggestionRunning = true;

    yield timeout(500); // 500 ms debounce

    let suggestion = yield this.googleTranslateClient.translate({
      text,
      from: this.args.challenge.language.code,
      to: 'english',
    });

    this.nativeLanguageTranslationSuggestion = suggestion;
    this.nativeLanguageTranslationSuggestionRunning = false;
  }
}
