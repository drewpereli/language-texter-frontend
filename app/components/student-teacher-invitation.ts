import Component from '@glimmer/component';
import StudentTeacherInvitationModel from 'spanish-texter/models/student-teacher-invitation';
import { TaskGenerator } from 'ember-concurrency';
import { dropTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import moment from 'moment';
import { action } from '@ember/object';

interface Args {
  studentTeacherInvitation: StudentTeacherInvitationModel;
}

export default class StudentTeacherInvitationComponent extends Component<Readonly<Args>> {
  get invitation(): StudentTeacherInvitationModel {
    return this.args.studentTeacherInvitation;
  }

  get recipientNameError(): string | undefined {
    if (this.invitation.recipientName !== '') {
      return;
    }

    return 'Recipient name is required.';
  }

  get recipientPhoneNumberError(): string | undefined {
    if (this.invitation.recipientPhoneNumber !== '') {
      return;
    }

    return 'Recipient phone number is required.';
  }

  get sentTimeAgo(): string {
    return moment(this.invitation.createdAt).from(Date.now());
  }

  get needsResponse(): boolean {
    return this.invitation.isPending && this.invitation.wasReceivedByCurrentUser;
  }

  @dropTask
  *save(): TaskGenerator<void> {
    try {
      let errors: string[] = [];

      if (!this.invitation.recipientName) {
        errors.push('Recipient name is required.');
      }

      if (!this.invitation.recipientPhoneNumber) {
        errors.push('Recipient name is required.');
      }

      if (errors.length > 0) {
        this.flashMessages.danger(errors.join(' '));
        return;
      }

      yield this.invitation.save();
      this.flashMessages.success("Invitation saved! We'll text you when they respond.");
    } catch (error) {
      console.log(error);
    }
  }

  @dropTask
  *accept(): TaskGenerator<void> {
    try {
      this.invitation.status = 'accepted';
      yield this.invitation.save();
      this.flashMessages.success('Invitation accepted!');
    } catch (error) {
      console.log(error);
    }
  }

  @dropTask
  *reject(): TaskGenerator<void> {
    try {
      this.invitation.status = 'rejected';
      yield this.invitation.save();
      this.flashMessages.success('Invitation declined');
    } catch (error) {
      console.log(error);
    }
  }

  @action
  cancel(): void {
    this.invitation.rollbackAttributes();
  }

  @service private declare flashMessages: FlashMessageService;
}
