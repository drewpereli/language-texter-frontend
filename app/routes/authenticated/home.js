import Route from '@ember/routing/route';

export default class AuthenticatedHomeRoute extends Route {
  async model() {
    await this.store.findAll('user');

    let challenges = await this.store.findAll('challenge');

    return { challenges };
  }
}
