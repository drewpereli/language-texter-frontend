import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

/**
 * @param {ChallengeModel} challenge
 */
export default class ChallengeComponent extends Component {
  @service flashMessages;

  @tracked isEditing = false;

  get isNewOrEditing() {
    return this.args.challenge.isNew || this.isEditing;
  }

  @task
  *saveChallenge() {
    try {
      yield this.args.challenge.save();
      this.flashMessages.success('Challenge saved!');
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
}
