import Controller from '@ember/controller';
import StudentTeacherInvitationModel from 'language-texter/models/student-teacher-invitation';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';
import EmberArray from '@ember/array';
import StoreService from '@ember-data/store';
import { action } from '@ember/object';

export default class AuthenticatedInvitationsController extends Controller {
  get newStudentTeacherInvitations(): EmberArray<StudentTeacherInvitationModel> {
    return this.studentTeacherInvitations.filterBy('isNew');
  }

  get invitationLists(): Array<{ label: string; invitations: StudentTeacherInvitationModel[] }> {
    return [
      {
        label: 'Awaiting Your Response',
        invitations: this.notNewStudentTeacherInvitations.filter((inv) => {
          return inv.isPending && inv.wasReceivedByCurrentUser;
        }),
      },
      {
        label: 'Awaiting Recipient Response',
        invitations: this.notNewStudentTeacherInvitations.filter((inv) => {
          return inv.isPending && inv.wasSentByCurrentUser;
        }),
      },
      {
        label: 'Complete',
        invitations: this.notNewStudentTeacherInvitations.filter((inv) => {
          return inv.isComplete;
        }),
      },
    ];
  }

  @action
  createNewStudentTeacherInvitation(): void {
    this.store.createRecord('student-teacher-invitation');
  }

  @service private declare session: SessionService;
  @service declare store: StoreService;

  private get notNewStudentTeacherInvitations(): EmberArray<StudentTeacherInvitationModel> {
    return this.studentTeacherInvitations.rejectBy('isNew');
  }

  private get studentTeacherInvitations(): EmberArray<StudentTeacherInvitationModel> {
    return this.store.peekAll('student-teacher-invitation');
  }
}
