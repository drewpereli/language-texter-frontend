import Component from '@glimmer/component';
import StudentTeacherInvitationModel from 'spanish-texter/models/student-teacher-invitation';
import { TaskGenerator } from 'ember-concurrency';
import { dropTask } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import moment from 'moment';
import { action } from '@ember/object';
import { getPhoneNumberValidationInfo } from 'spanish-texter/utils/validation-utils';
import { isAdapterError } from 'spanish-texter/utils/type-utils';

interface Args {
  studentTeacherInvitation: StudentTeacherInvitationModel;
}

export default class StudentTeacherInvitationComponent extends Component<Readonly<Args>> {
  get invitation(): StudentTeacherInvitationModel {
    return this.args.studentTeacherInvitation;
  }

  get recipientNameError(): string | null {
    if (this.invitation.recipientName !== '') {
      return null;
    }

    return 'Recipient name is required.';
  }

  get recipientPhoneNumberError(): string | null {
    // If the user hasn't entered anything in yet, we don't need to show an error
    if (this.invitation.recipientPhoneNumber === undefined) {
      return null;
    }

    return getPhoneNumberValidationInfo(this.invitation.recipientPhoneNumber).errorMessage;
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

      errors.push(...getPhoneNumberValidationInfo(this.invitation.recipientPhoneNumber).errors);

      if (errors.length > 0) {
        this.flashMessages.danger(errors.join(' '));
        return;
      }

      yield this.invitation.save();
      this.flashMessages.success("Invitation saved! We'll text you when they respond.");
    } catch (error) {
      if (!isAdapterError(error) || error.errors.length === 0) {
        return;
      }

      let responseError = error.errors[0];
      let attr = responseError.source.pointer.replace('/data/attributes/', '');

      if (attr === 'recipient_phone_number') {
        this.flashMessages.danger('Phone number is invalid.');
      }
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
