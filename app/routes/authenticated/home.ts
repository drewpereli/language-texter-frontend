import Route from '@ember/routing/route';

export default class AuthenticatedHomeRoute extends Route {
  async model(): Promise<void> {
    await this.store.findAll('user');
  }
}
