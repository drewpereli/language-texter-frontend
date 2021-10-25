import Model, { attr, belongsTo } from '@ember-data/model';
import UserModel from './user';
import { inject as service } from '@ember/service';
import { SessionService } from 'custom-types';

export type StudentTeacherRequestedRole = 'teacher' | 'student';
export type StudentTeacherInvitationStatus = 'sent' | 'accepted' | 'rejected';

enum InvitationUserType {
  New,
  SentByCurrentUser,
  ReceivedByCurrentUser,
}

export default class StudentTeacherInvitationModel extends Model {
  @attr('string') public declare creatorUsername?: string;
  @attr('string') public declare recipientName?: string;
  @attr('string') public declare recipientPhoneNumber?: string;
  @attr('string', { defaultValue: 'teacher' }) public declare requestedRole: StudentTeacherRequestedRole;
  @attr('string') public declare status?: StudentTeacherInvitationStatus;
  @attr('date') public declare createdAt?: Date;

  @belongsTo('user', { async: false }) public declare creator: UserModel | undefined;
  @belongsTo('user', { async: false }) public declare recipient: UserModel | null | undefined;

  public get isRequestingTeacherRole(): boolean {
    return this.requestedRole === 'teacher';
  }

  public get isPending(): boolean {
    return this.status === 'sent';
  }

  public get isComplete(): boolean {
    return this.status !== 'sent';
  }

  public get wasAccepted(): boolean {
    return this.status === 'accepted';
  }

  public get wasRejected(): boolean {
    return this.status === 'rejected';
  }

  public get wasSentByCurrentUser(): boolean {
    return this.invitationUserType === InvitationUserType.SentByCurrentUser;
  }

  public get wasReceivedByCurrentUser(): boolean {
    return this.invitationUserType === InvitationUserType.ReceivedByCurrentUser;
  }

  @service private declare session: SessionService;

  private get invitationUserType(): InvitationUserType {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.isNew) {
      return InvitationUserType.New;
    } else if (this.creator?.isCurrentUser) {
      return InvitationUserType.SentByCurrentUser;
    } else if (this.recipient?.isCurrentUser) {
      return InvitationUserType.ReceivedByCurrentUser;
    }

    throw new Error('Should not be seeing invitation that is neither new, nor received nor send by the current user');
  }
}
