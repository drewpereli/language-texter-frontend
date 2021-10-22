import Route from '@ember/routing/route';

export default class AuthenticatedInvitations extends Route {
  async model(): Promise<void> {
    let userPromise = this.store.findAll('user');
    let invitationPromise = this.store.findAll('student-teacher-invitation');

    await Promise.all([invitationPromise, userPromise]);
  }
}
